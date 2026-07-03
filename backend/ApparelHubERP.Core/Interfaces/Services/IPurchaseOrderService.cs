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

        // ✅ NEW: Advanced Methods
        Task<PagedResult<PurchaseOrderResponseDto>> GetFilteredAsync(PurchaseOrderFilterDto filter);
        Task<IEnumerable<PurchaseOrderResponseDto>> GetDeletedAsync();
        Task SoftDeleteAsync(int id);
        Task RestoreAsync(int id);
        Task BulkDeleteAsync(BulkOperationDto dto);
        Task CancelOrderAsync(int id);
        Task UpdateOrderItemsAsync(int orderId, UpdateOrderItemsDto dto);
        Task RemoveItemAsync(int orderId, int itemId);
        Task<OrderStatisticsDto> GetStatisticsAsync();
    }
}