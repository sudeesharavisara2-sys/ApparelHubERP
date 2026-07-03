using ApparelHubERP.Core.DTOs.Procurement;
using ApparelHubERP.Core.Entities;

namespace ApparelHubERP.Core.Interfaces.Repositories
{
    public interface ISupplierRepository
    {
        Task<IEnumerable<Supplier>> GetAllAsync();
        Task<Supplier?> GetByIdAsync(int id);
        Task AddAsync(Supplier supplier);
        void Update(Supplier supplier);
        Task<bool> ExistsAsync(int id);
        Task SaveChangesAsync();

        // ✅ NEW: Advanced Methods
        Task<PagedResult<Supplier>> GetFilteredAsync(SupplierFilterDto filter, CancellationToken cancellationToken = default);
        Task<IEnumerable<Supplier>> GetDeletedAsync(CancellationToken cancellationToken = default);
        Task BulkDeleteAsync(IEnumerable<int> ids, CancellationToken cancellationToken = default);
        Task RestoreAsync(int id, CancellationToken cancellationToken = default);
    }
}