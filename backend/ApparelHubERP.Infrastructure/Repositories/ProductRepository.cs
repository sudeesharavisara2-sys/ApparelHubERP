using Microsoft.EntityFrameworkCore;
using ApparelHubERP.Core.DTOs.Procurement;
using ApparelHubERP.Core.Entities;
using ApparelHubERP.Core.Interfaces.Repositories;
using ApparelHubERP.Infrastructure.Data;

namespace ApparelHubERP.Infrastructure.Repositories
{
    // ⚠️ TEMPORARY - Remove when Member 04 finishes
    public class ProductRepository(ApparelHubERPContext context) : IProductRepository
    {
        private readonly ApparelHubERPContext _context = context;

        // ============================================================
        // BASIC CRUD
        // ============================================================

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

        // ============================================================
        // ✅ ADVANCED: Supplier Prices for Product (Price Compare)
        // ============================================================

        public async Task<IEnumerable<SupplierPriceDto>> GetSupplierPricesForProductAsync(int productId)
        {
            var query = from poi in _context.PurchaseOrderItems
                        join po in _context.PurchaseOrders on poi.PurchaseOrderId equals po.Id
                        join s in _context.Suppliers on po.SupplierId equals s.Id
                        where poi.ProductId == productId
                              && !po.IsDeleted
                              && po.Status == PurchaseOrderStatus.Received
                        orderby poi.UnitCost ascending
                        select new SupplierPriceDto
                        {
                            SupplierId = s.Id,
                            SupplierName = s.Name,
                            UnitCost = poi.UnitCost,
                            PriceDate = po.OrderDate
                        };

            return await query.ToListAsync();
        }
    }
}