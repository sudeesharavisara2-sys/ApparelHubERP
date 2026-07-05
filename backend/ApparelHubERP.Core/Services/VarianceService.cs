using ApparelHubERP.Core.DTOs.Procurement;
using ApparelHubERP.Core.Entities;
using ApparelHubERP.Core.Interfaces.Repositories;
using ApparelHubERP.Core.Interfaces.Services;

namespace ApparelHubERP.Core.Services
{
    public class VarianceService(IPurchaseOrderRepository poRepo) : IVarianceService
    {
        private readonly IPurchaseOrderRepository _poRepo = poRepo;

        private CostVarianceDto CalculateVariance(PurchaseOrder order)
        {
            var budget = order.BudgetedAmount > 0 ? order.BudgetedAmount : order.TotalAmount * 1.1m;
            var variance = order.TotalAmount - budget;
            var percent = budget > 0 ? (variance / budget) * 100 : 0;

            return new CostVarianceDto
            {
                PurchaseOrderId = order.Id,
                PONumber = order.PONumber,
                SupplierName = order.Supplier?.Name ?? "Unknown",
                BudgetedAmount = budget,
                ActualAmount = order.TotalAmount,
                Variance = variance,
                VariancePercentage = percent,
                Status = variance switch
                {
                    < 0 => "Under Budget",
                    > 0 => "Over Budget",
                    _ => "On Budget"
                }
            };
        }

        public async Task<CostVarianceDto> GetVarianceByOrderIdAsync(int orderId)
        {
            var order = await _poRepo.GetOrderWithItemsAndSupplierAsync(orderId)
                ?? throw new Exception("Order not found.");
            return CalculateVariance(order);
        }

        public async Task<IEnumerable<CostVarianceDto>> GetAllVariancesAsync()
        {
            var orders = await _poRepo.GetAllAsync();
            return [.. orders.Select(CalculateVariance)];
        }

        public async Task<ProcurementDashboardDto> GetDashboardStatsAsync()
        {
            var orders = await _poRepo.GetAllAsync();
            var totalOrders = orders.Count();
            var totalSpend = orders.Sum(o => o.TotalAmount);
            var pending = orders.Count(o => o.Status == PurchaseOrderStatus.Draft || o.Status == PurchaseOrderStatus.PendingApproval);
            var received = orders.Count(o => o.Status == PurchaseOrderStatus.Received);

            return new ProcurementDashboardDto
            {
                TotalOrders = totalOrders,
                PendingOrders = pending,
                ReceivedOrders = received,
                TotalSpend = totalSpend,
                AverageOrderValue = totalOrders > 0 ? totalSpend / totalOrders : 0,
                TopVariances = [.. orders.Select(CalculateVariance)
                    .OrderByDescending(v => Math.Abs(v.Variance))
                    .Take(5)]
            };
        }
    }
}