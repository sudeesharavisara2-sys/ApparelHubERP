using Microsoft.EntityFrameworkCore;
using ApparelHubERP.Core.DTOs.Procurement;
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
                .Where(p => !p.IsDeleted)
                .ToListAsync();

        public async Task<PurchaseOrder?> GetByIdAsync(int id)
            => await _context.PurchaseOrders
                .Include(p => p.Supplier)
                .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);

        public async Task<PurchaseOrder?> GetOrderWithItemsAndSupplierAsync(int id)
            => await _context.PurchaseOrders
                .Include(p => p.Supplier)
                .Include(p => p.Items)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);

        public async Task<IEnumerable<PurchaseOrder>> GetOrdersBySupplierAsync(int supplierId)
            => await _context.PurchaseOrders
                .Where(p => p.SupplierId == supplierId && !p.IsDeleted)
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

        // ✅ NEW: Advanced Methods
        public async Task<PagedResult<PurchaseOrder>> GetFilteredAsync(PurchaseOrderFilterDto filter, CancellationToken cancellationToken = default)
        {
            var query = _context.PurchaseOrders
                .Include(p => p.Supplier)
                .AsNoTracking();

            if (filter.IsDeleted.HasValue)
                query = query.Where(p => p.IsDeleted == filter.IsDeleted.Value);
            else
                query = query.Where(p => !p.IsDeleted);

            if (filter.SupplierId.HasValue)
                query = query.Where(p => p.SupplierId == filter.SupplierId.Value);
            if (filter.Status.HasValue)
                query = query.Where(p => p.Status == filter.Status.Value);
            if (filter.FromDate.HasValue)
                query = query.Where(p => p.OrderDate >= filter.FromDate.Value);
            if (filter.ToDate.HasValue)
                query = query.Where(p => p.OrderDate <= filter.ToDate.Value);

            var total = await query.CountAsync(cancellationToken);

            query = filter.SortBy?.ToLower() switch
            {
                "orderdate" => filter.SortDescending ? query.OrderByDescending(p => p.OrderDate) : query.OrderBy(p => p.OrderDate),
                "totalamount" => filter.SortDescending ? query.OrderByDescending(p => p.TotalAmount) : query.OrderBy(p => p.TotalAmount),
                _ => query.OrderByDescending(p => p.OrderDate)
            };

            var items = await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync(cancellationToken);

            return new PagedResult<PurchaseOrder>
            {
                Items = items,
                TotalCount = total,
                Page = filter.Page,
                PageSize = filter.PageSize
            };
        }

        public async Task<IEnumerable<PurchaseOrder>> GetDeletedAsync(CancellationToken cancellationToken = default)
            => await _context.PurchaseOrders.IgnoreQueryFilters()
                .Where(p => p.IsDeleted)
                .Include(p => p.Supplier)
                .ToListAsync(cancellationToken);

        public async Task BulkDeleteAsync(IEnumerable<int> ids, CancellationToken cancellationToken = default)
        {
            var orders = await _context.PurchaseOrders
                .Where(p => ids.Contains(p.Id) && !p.IsDeleted)
                .ToListAsync(cancellationToken);
            foreach (var o in orders)
                o.SoftDelete();
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<OrderStatisticsDto> GetStatisticsAsync(CancellationToken cancellationToken = default)
        {
            var orders = await _context.PurchaseOrders
                .Where(p => !p.IsDeleted)
                .ToListAsync(cancellationToken);

            return new OrderStatisticsDto
            {
                TotalOrders = orders.Count,
                TotalAmount = orders.Sum(o => o.TotalAmount),
                StatusCounts = orders.GroupBy(o => o.Status)
                    .ToDictionary(g => g.Key, g => g.Count()),
                AverageOrderValue = orders.Any() ? orders.Average(o => o.TotalAmount) : 0
            };
        }
    }
}