using ApparelHubERP.Core.Entities;

namespace ApparelHubERP.Core.Interfaces.Repositories
{
    // ⚠️ TEMPORARY - Remove when Member 04 finishes
    public interface IProductRepository
    {
        Task<Product?> GetByIdAsync(int id);
        Task<IEnumerable<Product>> GetLowStockProductsAsync();
        void Update(Product product);
        Task SaveChangesAsync();
    }
}