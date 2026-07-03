using Microsoft.EntityFrameworkCore;
using ApparelHubERP.Core.DTOs.Procurement;
using ApparelHubERP.Core.Entities;
using ApparelHubERP.Core.Interfaces.Repositories;
using ApparelHubERP.Infrastructure.Data;

namespace ApparelHubERP.Infrastructure.Repositories
{
    public class SupplierRepository(ApparelHubERPContext context) : ISupplierRepository
    {
        private readonly ApparelHubERPContext _context = context;

        public async Task<IEnumerable<Supplier>> GetAllAsync()
            => await _context.Suppliers.Where(s => !s.IsDeleted).ToListAsync();

        public async Task<Supplier?> GetByIdAsync(int id)
            => await _context.Suppliers.FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);

        public async Task AddAsync(Supplier supplier)
            => await _context.Suppliers.AddAsync(supplier);

        public void Update(Supplier supplier)
            => _context.Suppliers.Update(supplier);

        public async Task<bool> ExistsAsync(int id)
            => await _context.Suppliers.AnyAsync(s => s.Id == id && !s.IsDeleted);

        public async Task SaveChangesAsync()
            => await _context.SaveChangesAsync();

        // ✅ NEW: Advanced Methods
        public async Task<PagedResult<Supplier>> GetFilteredAsync(SupplierFilterDto filter, CancellationToken cancellationToken = default)
        {
            var query = _context.Suppliers.AsNoTracking();

            if (filter.IsDeleted.HasValue)
                query = query.Where(s => s.IsDeleted == filter.IsDeleted.Value);
            else
                query = query.Where(s => !s.IsDeleted);

            if (!string.IsNullOrWhiteSpace(filter.Name))
                query = query.Where(s => s.Name.Contains(filter.Name));
            if (!string.IsNullOrWhiteSpace(filter.Email))
                query = query.Where(s => s.Email.Contains(filter.Email));
            if (filter.IsActive.HasValue)
                query = query.Where(s => s.IsActive == filter.IsActive.Value);

            var total = await query.CountAsync(cancellationToken);

            query = filter.SortBy?.ToLower() switch
            {
                "name" => filter.SortDescending ? query.OrderByDescending(s => s.Name) : query.OrderBy(s => s.Name),
                "createdat" => filter.SortDescending ? query.OrderByDescending(s => s.CreatedAt) : query.OrderBy(s => s.CreatedAt),
                _ => query.OrderByDescending(s => s.CreatedAt)
            };

            var items = await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync(cancellationToken);

            return new PagedResult<Supplier>
            {
                Items = items,
                TotalCount = total,
                Page = filter.Page,
                PageSize = filter.PageSize
            };
        }

        public async Task<IEnumerable<Supplier>> GetDeletedAsync(CancellationToken cancellationToken = default)
            => await _context.Suppliers.IgnoreQueryFilters().Where(s => s.IsDeleted).ToListAsync(cancellationToken);

        public async Task BulkDeleteAsync(IEnumerable<int> ids, CancellationToken cancellationToken = default)
        {
            var suppliers = await _context.Suppliers.Where(s => ids.Contains(s.Id) && !s.IsDeleted).ToListAsync(cancellationToken);
            foreach (var s in suppliers)
                s.SoftDelete();
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task RestoreAsync(int id, CancellationToken cancellationToken = default)
        {
            var supplier = await _context.Suppliers.IgnoreQueryFilters()
                .FirstOrDefaultAsync(s => s.Id == id && s.IsDeleted, cancellationToken);
            if (supplier != null)
                supplier.Restore();
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}