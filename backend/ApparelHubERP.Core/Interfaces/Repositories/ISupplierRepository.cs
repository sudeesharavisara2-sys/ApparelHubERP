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
        Task<PagedResult<Supplier>> GetFilteredAsync(SupplierFilterDto filter);
        Task<IEnumerable<Supplier>> GetDeletedAsync();
        Task BulkDeleteAsync(IEnumerable<int> ids);
        Task RestoreAsync(int id);
    }
}