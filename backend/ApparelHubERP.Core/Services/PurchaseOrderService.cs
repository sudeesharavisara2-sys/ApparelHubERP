using ApparelHubERP.Core.DTOs.Procurement;
using ApparelHubERP.Core.Entities;
using ApparelHubERP.Core.Interfaces.Repositories;
using ApparelHubERP.Core.Interfaces.Services;

namespace ApparelHubERP.Core.Services
{
    public class PurchaseOrderService(
        IPurchaseOrderRepository poRepository,
        ISupplierRepository supplierRepository,
        IProductRepository productRepository) : IPurchaseOrderService
    {
        private readonly IPurchaseOrderRepository _poRepository = poRepository;
        private readonly ISupplierRepository _supplierRepository = supplierRepository;
        private readonly IProductRepository _productRepository = productRepository;

        private static async Task<PurchaseOrderResponseDto> MapToResponse(PurchaseOrder order)
        {
            return new PurchaseOrderResponseDto
            {
                Id = order.Id,
                PONumber = order.PONumber,
                OrderDate = order.OrderDate,
                ExpectedDeliveryDate = order.ExpectedDeliveryDate,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                Remarks = order.Remarks,
                SupplierName = order.Supplier?.Name ?? "Unknown",
                Items = [.. order.Items.Select(i => new PurchaseOrderItemResponseDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product?.Name ?? "Unknown Product",
                    QuantityOrdered = i.QuantityOrdered,
                    QuantityReceived = i.QuantityReceived,
                    UnitCost = i.UnitCost,
                    TotalLineCost = i.TotalLineCost
                })]
            };
        }

        public async Task<PurchaseOrderResponseDto> CreatePurchaseOrderAsync(CreatePurchaseOrderDto dto)
        {
            if (!await _supplierRepository.ExistsAsync(dto.SupplierId))
                throw new Exception("Supplier not found.");

            var poNumber = await _poRepository.GeneratePONumberAsync();
            var order = new PurchaseOrder
            {
                PONumber = poNumber,
                SupplierId = dto.SupplierId,
                ExpectedDeliveryDate = dto.ExpectedDeliveryDate,
                Remarks = dto.Remarks,
                OrderDate = DateTime.UtcNow,
                Status = PurchaseOrderStatus.Draft
            };

            decimal total = 0;
            foreach (var itemDto in dto.Items)
            {
                var product = await _productRepository.GetByIdAsync(itemDto.ProductId)
                    ?? throw new Exception($"Product with ID {itemDto.ProductId} not found.");

                var item = new PurchaseOrderItem
                {
                    ProductId = itemDto.ProductId,
                    QuantityOrdered = itemDto.Quantity,
                    UnitCost = itemDto.UnitCost
                };

                total += item.TotalLineCost;
                order.Items.Add(item);
            }

            order.TotalAmount = total;
            await _poRepository.AddAsync(order);
            await _poRepository.SaveChangesAsync();

            return await MapToResponse(order);
        }

        public async Task<PurchaseOrderResponseDto?> GetOrderByIdAsync(int id)
        {
            var order = await _poRepository.GetOrderWithItemsAndSupplierAsync(id);
            return order is null ? null : await MapToResponse(order);
        }

        public async Task<IEnumerable<PurchaseOrderResponseDto>> GetAllOrdersAsync()
        {
            var orders = await _poRepository.GetAllAsync();
            var result = new List<PurchaseOrderResponseDto>();
            foreach (var order in orders)
                result.Add(await MapToResponse(order));
            return result;
        }

        public async Task<IEnumerable<PurchaseOrderResponseDto>> GetOrdersBySupplierAsync(int supplierId)
        {
            var orders = await _poRepository.GetOrdersBySupplierAsync(supplierId);
            var result = new List<PurchaseOrderResponseDto>();
            foreach (var order in orders)
                result.Add(await MapToResponse(order));
            return result;
        }

        public async Task<PurchaseOrderResponseDto> UpdateOrderStatusAsync(int orderId, UpdatePurchaseOrderStatusDto dto)
        {
            var order = await _poRepository.GetOrderWithItemsAndSupplierAsync(orderId)
                ?? throw new Exception("Order not found.");

            if (order.Status == PurchaseOrderStatus.Received && dto.Status != PurchaseOrderStatus.Received)
                throw new Exception("Cannot change status of a received order.");

            if (order.Status == PurchaseOrderStatus.Cancelled)
                throw new Exception("Cannot change status of a cancelled order.");

            order.Status = dto.Status;
            _poRepository.Update(order);
            await _poRepository.SaveChangesAsync();

            return await MapToResponse(order);
        }

        public async Task<PurchaseOrderResponseDto> ReceiveOrderAsync(int orderId)
        {
            var order = await _poRepository.GetOrderWithItemsAndSupplierAsync(orderId)
                ?? throw new Exception("Order not found.");

            if (order.Status != PurchaseOrderStatus.Shipped)
                throw new Exception("Only 'Shipped' orders can be received.");

            foreach (var item in order.Items)
            {
                var product = await _productRepository.GetByIdAsync(item.ProductId);
                if (product is not null)
                {
                    product.StockQuantity += item.QuantityOrdered;
                    _productRepository.Update(product);
                }
                item.QuantityReceived = item.QuantityOrdered;
            }

            order.Status = PurchaseOrderStatus.Received;
            _poRepository.Update(order);

            await _poRepository.SaveChangesAsync();
            await _productRepository.SaveChangesAsync();

            return await MapToResponse(order);
        }

        public async Task<IEnumerable<object>> GetReorderSuggestionsAsync()
        {
            var lowStockProducts = await _productRepository.GetLowStockProductsAsync();
            return lowStockProducts.Select(p => new
            {
                p.Id,
                p.Name,
                CurrentStock = p.StockQuantity,
                p.ReorderLevel,
                SuggestedQuantity = p.ReorderLevel * 2
            });
        }

        // ✅ NEW: Advanced Methods
        public async Task<PagedResult<PurchaseOrderResponseDto>> GetFilteredAsync(PurchaseOrderFilterDto filter)
        {
            var result = await _poRepository.GetFilteredAsync(filter);
            var items = new List<PurchaseOrderResponseDto>();
            foreach (var order in result.Items)
                items.Add(await MapToResponse(order));

            return new PagedResult<PurchaseOrderResponseDto>
            {
                Items = items,
                TotalCount = result.TotalCount,
                Page = result.Page,
                PageSize = result.PageSize
            };
        }

        public async Task<IEnumerable<PurchaseOrderResponseDto>> GetDeletedAsync()
        {
            var orders = await _poRepository.GetDeletedAsync();
            var result = new List<PurchaseOrderResponseDto>();
            foreach (var order in orders)
                result.Add(await MapToResponse(order));
            return result;
        }

        public async Task SoftDeleteAsync(int id)
        {
            var order = await _poRepository.GetOrderWithItemsAndSupplierAsync(id)
                ?? throw new Exception("Order not found.");
            order.SoftDelete();
            await _poRepository.SaveChangesAsync();
        }

        public async Task RestoreAsync(int id)
        {
            var order = await _poRepository.GetOrderWithItemsAndSupplierAsync(id)
                ?? throw new Exception("Order not found.");
            order.Restore();
            await _poRepository.SaveChangesAsync();
        }

        public async Task BulkDeleteAsync(BulkOperationDto dto)
        {
            if (dto.Ids == null || !dto.Ids.Any())
                throw new Exception("No order IDs provided.");
            await _poRepository.BulkDeleteAsync(dto.Ids);
        }

        public async Task CancelOrderAsync(int id)
        {
            var order = await _poRepository.GetOrderWithItemsAndSupplierAsync(id)
                ?? throw new Exception("Order not found.");
            if (order.Status == PurchaseOrderStatus.Received || order.Status == PurchaseOrderStatus.Cancelled)
                throw new Exception("Cannot cancel a received or already cancelled order.");
            order.Status = PurchaseOrderStatus.Cancelled;
            await _poRepository.SaveChangesAsync();
        }

        public async Task UpdateOrderItemsAsync(int orderId, UpdateOrderItemsDto dto)
        {
            var order = await _poRepository.GetOrderWithItemsAndSupplierAsync(orderId)
                ?? throw new Exception("Order not found.");
            if (order.Status != PurchaseOrderStatus.Draft)
                throw new Exception("Items can only be updated for Draft orders.");

            order.Items.Clear();
            decimal total = 0;
            foreach (var itemDto in dto.Items)
            {
                var product = await _productRepository.GetByIdAsync(itemDto.ProductId)
                    ?? throw new Exception($"Product {itemDto.ProductId} not found.");
                var item = new PurchaseOrderItem
                {
                    ProductId = itemDto.ProductId,
                    QuantityOrdered = itemDto.Quantity,
                    UnitCost = itemDto.UnitCost
                };
                order.Items.Add(item);
                total += item.TotalLineCost;
            }
            order.TotalAmount = total;
            await _poRepository.SaveChangesAsync();
        }

        public async Task RemoveItemAsync(int orderId, int itemId)
        {
            var order = await _poRepository.GetOrderWithItemsAndSupplierAsync(orderId)
                ?? throw new Exception("Order not found.");
            if (order.Status != PurchaseOrderStatus.Draft)
                throw new Exception("Items can only be removed from Draft orders.");

            var item = order.Items.FirstOrDefault(i => i.Id == itemId)
                ?? throw new Exception("Item not found.");
            order.Items.Remove(item);
            order.TotalAmount = order.Items.Sum(i => i.TotalLineCost);
            await _poRepository.SaveChangesAsync();
        }

        public async Task<OrderStatisticsDto> GetStatisticsAsync()
        {
            return await _poRepository.GetStatisticsAsync();
        }
    }
}