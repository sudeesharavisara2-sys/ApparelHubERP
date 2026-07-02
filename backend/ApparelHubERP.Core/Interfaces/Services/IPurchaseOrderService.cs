using ApparelHubERP.Core.DTOs.Procurement;

namespace ApparelHubERP.Core.Interfaces.Services
{
    public interface IPurchaseOrderService
    {
        Task<PurchaseOrderResponseDto> CreatePurchaseOrderAsync(CreatePurchaseOrderDto dto);
        Task<PurchaseOrderResponseDto?> GetOrderByIdAsync(int id);
        Task<IEnumerable<PurchaseOrderResponseDto>> GetAllOrdersAsync();
        Task<IEnumerable<PurchaseOrderResponseDto>> GetOrdersBySupplierAsync(int supplierId);
        Task<PurchaseOrderResponseDto> UpdateOrderStatusAsync(int orderId, UpdatePurchaseOrderStatusDto dto);
        Task<PurchaseOrderResponseDto> ReceiveOrderAsync(int orderId);
        Task<IEnumerable<object>> GetReorderSuggestionsAsync();
    }
}