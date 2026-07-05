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

        // ============================================================
        // MAPPER
        // ============================================================
        private static async Task<PurchaseOrderResponseDto> MapToResponse(PurchaseOrder order)
        {
            return new PurchaseOrderResponseDto
            {
                Id = order.Id,
                PONumber = order.PONumber,
                OrderDate = order.OrderDate,
                ExpectedDeliveryDate = order.ExpectedDeliveryDate,
                TotalAmount = order.TotalAmount,
                BudgetedAmount = order.BudgetedAmount,
                Currency = order.Currency,
                Status = order.Status,
                Remarks = order.Remarks,
                SupplierName = order.Supplier?.Name ?? "Unknown",
                ResponseStatus = order.SupplierResponse?.Status.ToString() ?? "Pending",
                Season = order.Season,
                ApprovalStatus = order.ApprovalStatus,
                PriceVariance = order.BudgetedAmount > 0
                    ? ((order.TotalAmount - order.BudgetedAmount) / order.BudgetedAmount * 100)
                    : 0,
                Items = [.. order.Items.Select(i => new PurchaseOrderItemResponseDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product?.Name ?? "Unknown Product",
                    QuantityOrdered = i.QuantityOrdered,
                    QuantityReceived = i.QuantityReceived,
                    UnitCost = i.UnitCost,
                    TotalLineCost = i.TotalLineCost,
                    PreviousSeasonUnitCost = i.PreviousSeasonUnitCost,
                    Season = i.Season
                })]
            };
        }

        // ============================================================
        // BASIC CRUD
        // ============================================================

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
                BudgetedAmount = dto.BudgetedAmount > 0 ? dto.BudgetedAmount : 0,
                OrderDate = DateTime.UtcNow,
                Status = PurchaseOrderStatus.Draft,
                ApprovalStatus = "Draft",
                Season = dto.Season
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
                    UnitCost = itemDto.UnitCost,
                    PreviousSeasonUnitCost = itemDto.PreviousSeasonUnitCost,
                    Season = dto.Season
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
            if (dto.Status == PurchaseOrderStatus.Approved)
            {
                order.ApprovalStatus = "Approved";
                order.ApprovedAt = DateTime.UtcNow;
            }
            _poRepository.Update(order);
            await _poRepository.SaveChangesAsync();

            return await MapToResponse(order);
        }

        // ✅ TWO ReceiveOrderAsync METHODS – ONE FOR INTERFACE, ONE WITH OPTIONAL PARAM

        // This one matches the interface (IPurchaseOrderService.ReceiveOrderAsync(int))
        public async Task<PurchaseOrderResponseDto> ReceiveOrderAsync(int orderId)
        {
            return await ReceiveOrderAsync(orderId, null);
        }

        // This one is the full implementation with optional quantities
        public async Task<PurchaseOrderResponseDto> ReceiveOrderAsync(int orderId, Dictionary<int, int>? receivedQuantities = null)
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
                    var receivedQty = receivedQuantities?.GetValueOrDefault(item.ProductId, item.QuantityOrdered) ?? item.QuantityOrdered;
                    product.StockQuantity += receivedQty;
                    _productRepository.Update(product);
                }
                item.QuantityReceived = receivedQuantities?.GetValueOrDefault(item.ProductId, item.QuantityOrdered) ?? item.QuantityOrdered;
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

        // ============================================================
        // PAGINATION & FILTERING
        // ============================================================

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

        // ============================================================
        // SOFT DELETE & BULK OPERATIONS
        // ============================================================

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
            if (dto.Ids == null || dto.Ids.Count == 0)
                throw new Exception("No order IDs provided.");
            await _poRepository.BulkDeleteAsync(dto.Ids);
        }

        // ============================================================
        // ADDITIONAL ACTIONS
        // ============================================================

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
                    UnitCost = itemDto.UnitCost,
                    PreviousSeasonUnitCost = itemDto.PreviousSeasonUnitCost,
                    Season = order.Season
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

        // ============================================================
        // ✅ ADVANCED FEATURES
        // ============================================================

        public async Task<SupplierOrderHistoryDto> GetSupplierOrderHistoryAsync(int supplierId)
        {
            var orders = await _poRepository.GetOrderHistoryBySupplierAsync(supplierId);
            var supplier = await _supplierRepository.GetByIdAsync(supplierId);

            var history = new SupplierOrderHistoryDto
            {
                SupplierId = supplierId,
                SupplierName = supplier?.Name ?? "Unknown",
                Orders = [.. orders.Select(o => new OrderHistoryItemDto
                {
                    Id = o.Id,
                    PONumber = o.PONumber,
                    OrderDate = o.OrderDate,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status.ToString(),
                    SupplierResponseStatus = o.SupplierResponse?.Status.ToString() ?? "Pending",
                    ItemCount = o.Items.Count,
                    Season = o.Season ?? "N/A",
                    CurrentPrice = o.TotalAmount,
                    PreviousSeasonPrice = o.Items.FirstOrDefault()?.PreviousSeasonUnitCost,
                    PriceVariance = o.TotalAmount - (o.Items.FirstOrDefault()?.PreviousSeasonUnitCost ?? 0),
                    PriceVariancePercentage = o.Items.FirstOrDefault()?.PreviousSeasonUnitCost != null
                        ? $"{((o.TotalAmount - (o.Items.FirstOrDefault()?.PreviousSeasonUnitCost ?? 0)) / (o.Items.FirstOrDefault()?.PreviousSeasonUnitCost ?? 1) * 100):F1}%"
                        : "N/A"
                })]
            };

            List<OrderHistoryItemDto> orders1 = history.Orders;
            var ordersList = orders1;
            history.Summary = new OrderHistorySummaryDto
            {
                TotalOrders = ordersList.Count,
                PendingOrders = ordersList.Count(o => o.Status == "PendingApproval" || o.Status == "Draft"),
                AcceptedOrders = ordersList.Count(o => o.Status == "Approved" || o.Status == "Shipped"),
                DeliveredOrders = ordersList.Count(o => o.Status == "Received"),
                RejectedOrders = ordersList.Count(o => o.Status == "Cancelled"),
                TotalSpent = ordersList.Sum(o => o.TotalAmount),
                AverageOrderValue = ordersList.Count != 0 ? ordersList.Average(o => o.TotalAmount) : 0,
                AveragePriceVariance = ordersList.Count != 0 ? ordersList.Average(o => o.PriceVariance) : 0
            };

            return history;
        }

        public async Task<SeasonalPriceDashboardDto> GetSeasonalPriceVariancesAsync(string? season = null)
        {
            var variances = await _poRepository.GetSeasonalPriceVariancesAsync(season);

            var summary = new SummaryPriceStatsDto
            {
                AveragePriceIncrease = variances.Any() ? variances.Average(v => v.Variance) : 0,
                ProductsWithPriceIncrease = variances.Count(v => v.VarianceStatus == "Increased"),
                ProductsWithPriceDecrease = variances.Count(v => v.VarianceStatus == "Decreased"),
                ProductsStable = variances.Count(v => v.VarianceStatus == "Stable"),
                HighestPriceIncrease = variances.Any() ? variances.Max(v => v.Variance) : 0,
                HighestPriceDecrease = variances.Any() ? variances.Min(v => v.Variance) : 0
            };

            return new SeasonalPriceDashboardDto
            {
                SeasonalVariances = [.. variances],
                Summary = summary
            };
        }

        public async Task<DeliveryValidationDto> ValidateDeliveryAsync(int orderId, Dictionary<int, int> receivedQuantities)
        {
            var order = await _poRepository.GetOrderWithItemsAndSupplierAsync(orderId)
                ?? throw new Exception("Order not found.");

            var validation = new DeliveryValidationDto
            {
                PurchaseOrderId = orderId,
                PONumber = order.PONumber,
                IsValid = true
            };

            foreach (var item in order.Items)
            {
                var receivedQty = receivedQuantities.GetValueOrDefault(item.ProductId, 0);
                var itemValidation = new DeliveryItemValidationDto
                {
                    ProductId = item.ProductId,
                    ProductName = item.Product?.Name ?? "Unknown",
                    OrderedQuantity = item.QuantityOrdered,
                    ReceivedQuantity = receivedQty,
                    IsMatch = receivedQty == item.QuantityOrdered
                };

                if (!itemValidation.IsMatch)
                {
                    validation.IsValid = false;
                    itemValidation.DiscrepancyMessage = $"Ordered: {item.QuantityOrdered}, Received: {receivedQty}";
                }

                validation.Items.Add(itemValidation);
            }

            validation.ValidationMessage = validation.IsValid
                ? "All items match the order."
                : "Some items have quantity discrepancies.";

            return validation;
        }
    }
}