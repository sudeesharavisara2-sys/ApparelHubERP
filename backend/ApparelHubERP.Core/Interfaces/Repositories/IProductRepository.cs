using ApparelHubERP.Core.DTOs.Procurement;
using ApparelHubERP.Core.Entities;

namespace ApparelHubERP.Core.Interfaces.Repositories
{
    public interface IProductRepository
    {
        Task<Product?> GetByIdAsync(int id);
        Task<IEnumerable<Product>> GetLowStockProductsAsync();
        void Update(Product product);
        Task SaveChangesAsync();
        Task<IEnumerable<SupplierPriceDto>> GetSupplierPricesForProductAsync(int productId);
    }
}