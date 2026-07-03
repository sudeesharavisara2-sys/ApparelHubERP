using Microsoft.EntityFrameworkCore;
using ApparelHubERP.Core.Entities;
using ApparelHubERP.Core.Interfaces.Repositories;
using ApparelHubERP.Infrastructure.Data;

namespace ApparelHubERP.Infrastructure.Repositories
{
    // ⚠️ TEMPORARY - Remove when Member 04 finishes
    public class ProductRepository(ApparelHubERPContext context) : IProductRepository
    {
        private readonly ApparelHubERPContext _context = context;

        public async Task<Product?> GetByIdAsync(int id)
            => await _context.Products.FindAsync(id);

        public async Task<IEnumerable<Product>> GetLowStockProductsAsync()
            => await _context.Products
                .Where(p => p.StockQuantity <= p.ReorderLevel)
                .ToListAsync();

        public void Update(Product product)
            => _context.Products.Update(product);

        public async Task SaveChangesAsync()
            => await _context.SaveChangesAsync();
    }
}