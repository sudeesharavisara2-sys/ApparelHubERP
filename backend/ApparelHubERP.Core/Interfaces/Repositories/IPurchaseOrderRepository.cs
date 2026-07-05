using ApparelHubERP.Core.DTOs.Procurement;
using ApparelHubERP.Core.Entities;

namespace ApparelHubERP.Core.Interfaces.Repositories
{
    public interface IPurchaseOrderRepository
    {
        // Basic CRUD
        Task<IEnumerable<PurchaseOrder>> GetAllAsync();
        Task<PurchaseOrder?> GetByIdAsync(int id);
        Task<PurchaseOrder?> GetOrderWithItemsAndSupplierAsync(int id);
        Task<PurchaseOrder?> GetOrderWithSupplierResponseAsync(int id);
        Task<IEnumerable<PurchaseOrder>> GetOrdersBySupplierAsync(int supplierId);
        Task AddAsync(PurchaseOrder order);
        void Update(PurchaseOrder order);
        Task<string> GeneratePONumberAsync();
        Task SaveChangesAsync();

        // Advanced
        Task<PagedResult<PurchaseOrder>> GetFilteredAsync(PurchaseOrderFilterDto filter);
        Task<IEnumerable<PurchaseOrder>> GetDeletedAsync();
        Task BulkDeleteAsync(IEnumerable<int> ids);
        Task<OrderStatisticsDto> GetStatisticsAsync();
        Task<IEnumerable<PurchaseOrder>> GetOrderHistoryBySupplierAsync(int supplierId);
        Task<IEnumerable<PriceVarianceDto>> GetSeasonalPriceVariancesAsync(string? season = null);
    }
}