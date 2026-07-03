using Microsoft.EntityFrameworkCore;
using ApparelHubERP.Core.Entities;
using ApparelHubERP.Core.Interfaces.Repositories;
using ApparelHubERP.Infrastructure.Data;

namespace ApparelHubERP.Infrastructure.Repositories
{
    public class PurchaseOrderRepository(ApparelHubERPContext context) : IPurchaseOrderRepository
    {
        private readonly ApparelHubERPContext _context = context;

        public async Task<IEnumerable<PurchaseOrder>> GetAllAsync()
            => await _context.PurchaseOrders
                .Include(p => p.Supplier)
                .ToListAsync();

        public async Task<PurchaseOrder?> GetByIdAsync(int id)
            => await _context.PurchaseOrders
                .Include(p => p.Supplier)
                .FirstOrDefaultAsync(p => p.Id == id);

        public async Task<PurchaseOrder?> GetOrderWithItemsAndSupplierAsync(int id)
            => await _context.PurchaseOrders
                .Include(p => p.Supplier)
                .Include(p => p.Items)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(p => p.Id == id);

        public async Task<IEnumerable<PurchaseOrder>> GetOrdersBySupplierAsync(int supplierId)
            => await _context.PurchaseOrders
                .Where(p => p.SupplierId == supplierId)
                .Include(p => p.Items)
                .ToListAsync();

        public async Task AddAsync(PurchaseOrder order)
            => await _context.PurchaseOrders.AddAsync(order);

        public void Update(PurchaseOrder order)
            => _context.PurchaseOrders.Update(order);

        public async Task<string> GeneratePONumberAsync()
        {
            var year = DateTime.UtcNow.Year;
            var count = await _context.PurchaseOrders.CountAsync() + 1;
            return $"PO-{year}-{count:D4}";
        }

        public async Task SaveChangesAsync()
            => await _context.SaveChangesAsync();
    }
}