using ApparelHubERP.Core.DTOs.Procurement;
using ApparelHubERP.Core.Entities;
using ApparelHubERP.Core.Interfaces.Repositories;
using ApparelHubERP.Core.Interfaces.Services;

namespace ApparelHubERP.Core.Services
{
    public class SupplierResponseService(IPurchaseOrderRepository poRepo, ISupplierRepository supplierRepo) : ISupplierResponseService
    {
        private readonly IPurchaseOrderRepository _poRepo = poRepo;
        private readonly ISupplierRepository _supplierRepo = supplierRepo;

        public async Task<IEnumerable<SupplierResponseDto>> GetResponsesForSupplierAsync(int supplierId)
        {
            var orders = await _poRepo.GetOrdersBySupplierAsync(supplierId);
            return orders
                .Where(o => o.SupplierResponse != null)
                .Select(o => new SupplierResponseDto
                {
                    Id = o.SupplierResponse!.Id,
                    PurchaseOrderId = o.Id,
                    PONumber = o.PONumber,
                    Status = o.SupplierResponse.Status.ToString(),
                    StatusDisplayName = o.SupplierResponse.StatusDisplayName,
                    QuotedTotal = o.SupplierResponse.QuotedTotal,
                    QuotedDeliveryDate = o.SupplierResponse.QuotedDeliveryDate,
                    Remarks = o.SupplierResponse.Remarks,
                    RespondedAt = o.SupplierResponse.RespondedAt,
                    HasResponded = o.SupplierResponse.HasResponded,
                    IsPositiveResponse = o.SupplierResponse.IsPositiveResponse,
                    StatusBadgeClass = o.SupplierResponse.StatusBadgeClass,
                    SupplierName = o.Supplier?.Name ?? "Unknown"
                });
        }

        public async Task<SupplierResponseDto> CreateOrUpdateResponseAsync(int supplierId, CreateSupplierResponseDto dto)
        {
            var order = await _poRepo.GetOrderWithItemsAndSupplierAsync(dto.PurchaseOrderId)
                ?? throw new Exception("Order not found.");

            if (order.SupplierId != supplierId)
                throw new Exception("You are not authorized to respond to this order.");

            var response = order.SupplierResponse;
            if (response == null)
            {
                response = new SupplierResponse
                {
                    PurchaseOrderId = dto.PurchaseOrderId,
                    SupplierId = supplierId,
                    Status = Enum.Parse<SupplierResponseStatus>(dto.Status),
                    QuotedTotal = dto.QuotedTotal,
                    QuotedDeliveryDate = dto.QuotedDeliveryDate,
                    Remarks = dto.Remarks,
                    RespondedAt = DateTime.UtcNow
                };
                order.SupplierResponse = response;
            }
            else
            {
                response.Status = Enum.Parse<SupplierResponseStatus>(dto.Status);
                response.QuotedTotal = dto.QuotedTotal;
                response.QuotedDeliveryDate = dto.QuotedDeliveryDate;
                response.Remarks = dto.Remarks;
                response.RespondedAt = DateTime.UtcNow;
            }

            await _poRepo.SaveChangesAsync();

            return new SupplierResponseDto
            {
                Id = response.Id,
                PurchaseOrderId = response.PurchaseOrderId,
                PONumber = order.PONumber,
                Status = response.Status.ToString(),
                StatusDisplayName = response.StatusDisplayName,
                QuotedTotal = response.QuotedTotal,
                QuotedDeliveryDate = response.QuotedDeliveryDate,
                Remarks = response.Remarks,
                RespondedAt = response.RespondedAt,
                HasResponded = response.HasResponded,
                IsPositiveResponse = response.IsPositiveResponse,
                StatusBadgeClass = response.StatusBadgeClass,
                SupplierName = order.Supplier?.Name ?? "Unknown"
            };
        }

        public async Task<IEnumerable<PurchaseOrderResponseDto>> GetOrdersForSupplierAsync(int supplierId)
        {
            var orders = await _poRepo.GetOrdersBySupplierAsync(supplierId);
            var result = new List<PurchaseOrderResponseDto>();
            foreach (var order in orders)
            {
                var dto = new PurchaseOrderResponseDto
                {
                    Id = order.Id,
                    PONumber = order.PONumber,
                    OrderDate = order.OrderDate,
                    TotalAmount = order.TotalAmount,
                    Status = order.Status,
                    SupplierName = order.Supplier?.Name ?? "Unknown",
                    ResponseStatus = order.SupplierResponse?.Status.ToString() ?? "Pending",
                    Season = order.Season,
                    ApprovalStatus = order.ApprovalStatus
                };
                result.Add(dto);
            }
            return result;
        }
    }
}