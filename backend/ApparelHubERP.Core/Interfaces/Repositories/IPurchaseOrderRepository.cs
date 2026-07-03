using ApparelHubERP.Core.DTOs.Procurement;
using ApparelHubERP.Core.Entities;

namespace ApparelHubERP.Core.Interfaces.Repositories
{
    public interface IPurchaseOrderRepository
    {
        Task<IEnumerable<PurchaseOrder>> GetAllAsync();
        Task<PurchaseOrder?> GetByIdAsync(int id);
        Task<PurchaseOrder?> GetOrderWithItemsAndSupplierAsync(int id);
        Task<IEnumerable<PurchaseOrder>> GetOrdersBySupplierAsync(int supplierId);
        Task AddAsync(PurchaseOrder order);
        void Update(PurchaseOrder order);
        Task<string> GeneratePONumberAsync();
        Task SaveChangesAsync();

        // ✅ NEW: Advanced Methods
        Task<PagedResult<PurchaseOrder>> GetFilteredAsync(PurchaseOrderFilterDto filter, CancellationToken cancellationToken = default);
        Task<IEnumerable<PurchaseOrder>> GetDeletedAsync(CancellationToken cancellationToken = default);
        Task BulkDeleteAsync(IEnumerable<int> ids, CancellationToken cancellationToken = default);
        Task<OrderStatisticsDto> GetStatisticsAsync(CancellationToken cancellationToken = default);
    }
}