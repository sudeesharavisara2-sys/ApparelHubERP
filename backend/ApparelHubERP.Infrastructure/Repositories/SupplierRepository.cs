using Microsoft.EntityFrameworkCore;
using ApparelHubERP.Core.Entities;
using ApparelHubERP.Core.Interfaces.Repositories;
using ApparelHubERP.Infrastructure.Data;

namespace ApparelHubERP.Infrastructure.Repositories
{
    public class SupplierRepository(ApparelHubERPContext context) : ISupplierRepository
    {
        private readonly ApparelHubERPContext _context = context;

        public async Task<IEnumerable<Supplier>> GetAllAsync()
            => await _context.Suppliers.ToListAsync();

        public async Task<Supplier?> GetByIdAsync(int id)
            => await _context.Suppliers.FindAsync(id);

        public async Task AddAsync(Supplier supplier)
            => await _context.Suppliers.AddAsync(supplier);

        public void Update(Supplier supplier)
            => _context.Suppliers.Update(supplier);

        public async Task<bool> ExistsAsync(int id)
            => await _context.Suppliers.AnyAsync(s => s.Id == id);

        public async Task SaveChangesAsync()
            => await _context.SaveChangesAsync();
    }
}