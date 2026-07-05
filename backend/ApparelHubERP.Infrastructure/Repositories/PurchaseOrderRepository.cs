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

        // ============================================================
        // BASIC CRUD
        // ============================================================

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

        public async Task<PurchaseOrder?> GetOrderWithSupplierResponseAsync(int id)
            => await _context.PurchaseOrders
                .Include(p => p.SupplierResponse)
                .Include(p => p.Supplier)
                .Include(p => p.Items)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);

        public async Task<IEnumerable<PurchaseOrder>> GetOrdersBySupplierAsync(int supplierId)
            => await _context.PurchaseOrders
                .Where(p => p.SupplierId == supplierId && !p.IsDeleted)
                .Include(p => p.Supplier)
                .Include(p => p.Items)
                    .ThenInclude(i => i.Product)
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

        // ============================================================
        // PAGINATION & FILTERING – ✅ NO CancellationToken
        // ============================================================

        public async Task<PagedResult<PurchaseOrder>> GetFilteredAsync(PurchaseOrderFilterDto filter)
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

            var total = await query.CountAsync();

            query = filter.SortBy?.ToLower() switch
            {
                "orderdate" => filter.SortDescending ? query.OrderByDescending(p => p.OrderDate) : query.OrderBy(p => p.OrderDate),
                "totalamount" => filter.SortDescending ? query.OrderByDescending(p => p.TotalAmount) : query.OrderBy(p => p.TotalAmount),
                _ => query.OrderByDescending(p => p.OrderDate)
            };

            var items = await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return new PagedResult<PurchaseOrder>
            {
                Items = items,
                TotalCount = total,
                Page = filter.Page,
                PageSize = filter.PageSize
            };
        }

        // ============================================================
        // SOFT DELETE & BULK OPERATIONS – ✅ NO CancellationToken
        // ============================================================

        public async Task<IEnumerable<PurchaseOrder>> GetDeletedAsync()
            => await _context.PurchaseOrders.IgnoreQueryFilters()
                .Where(p => p.IsDeleted)
                .Include(p => p.Supplier)
                .ToListAsync();

        public async Task BulkDeleteAsync(IEnumerable<int> ids)
        {
            var orders = await _context.PurchaseOrders
                .Where(p => ids.Contains(p.Id) && !p.IsDeleted)
                .ToListAsync();
            foreach (var o in orders)
                o.SoftDelete();
            await _context.SaveChangesAsync();
        }

        // ============================================================
        // STATISTICS – ✅ NO CancellationToken
        // ============================================================

        public async Task<OrderStatisticsDto> GetStatisticsAsync()
        {
            var orders = await _context.PurchaseOrders
                .Where(p => !p.IsDeleted)
                .ToListAsync();

            return new OrderStatisticsDto
            {
                TotalOrders = orders.Count,
                TotalAmount = orders.Sum(o => o.TotalAmount),
                StatusCounts = orders.GroupBy(o => o.Status)
                    .ToDictionary(g => g.Key, g => g.Count()),
                AverageOrderValue = orders.Count != 0 ? orders.Average(o => o.TotalAmount) : 0
            };
        }

        // ============================================================
        // ✅ ADVANCED FEATURES – NO CancellationToken
        // ============================================================

        public async Task<IEnumerable<PurchaseOrder>> GetOrderHistoryBySupplierAsync(int supplierId)
            => await _context.PurchaseOrders
                .Where(p => p.SupplierId == supplierId && !p.IsDeleted)
                .Include(p => p.Supplier)
                .Include(p => p.Items)
                    .ThenInclude(i => i.Product)
                .OrderByDescending(p => p.OrderDate)
                .ToListAsync();

        public async Task<IEnumerable<PriceVarianceDto>> GetSeasonalPriceVariancesAsync(string? season = null)
        {
            var query = _context.PurchaseOrderItems
                .Include(i => i.PurchaseOrder)
                .Include(i => i.Product)
                .Where(i => i.PreviousSeasonUnitCost.HasValue
                            && i.PurchaseOrder.Status == PurchaseOrderStatus.Received
                            && !i.PurchaseOrder.IsDeleted);

            if (!string.IsNullOrEmpty(season))
                query = query.Where(i => i.Season == season);

            var items = await query.ToListAsync();

            return [.. items.Select(i => new PriceVarianceDto
            {
                ProductId = i.ProductId,
                ProductName = i.Product?.Name ?? "Unknown",
                Season = i.Season ?? "N/A",
                PreviousPrice = i.PreviousSeasonUnitCost ?? 0,
                CurrentPrice = i.UnitCost,
                Variance = i.UnitCost - (i.PreviousSeasonUnitCost ?? 0),
                VariancePercentage = i.PreviousSeasonUnitCost.HasValue && i.PreviousSeasonUnitCost.Value > 0
                    ? $"{((i.UnitCost - i.PreviousSeasonUnitCost.Value) / i.PreviousSeasonUnitCost.Value * 100):F1}%"
                    : "0%",
                VarianceStatus = i.UnitCost > (i.PreviousSeasonUnitCost ?? 0) ? "Increased"
                    : i.UnitCost < (i.PreviousSeasonUnitCost ?? 0) ? "Decreased" : "Stable",
                ComparisonDate = i.PurchaseOrder?.OrderDate ?? DateTime.UtcNow
            })];
        }
    }
}