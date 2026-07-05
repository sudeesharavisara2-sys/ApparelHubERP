using System.Collections.Generic;

namespace ApparelHubERP.Core.DTOs.Procurement
{
    public class ProcurementDashboardDto
    {
        public int TotalOrders { get; set; }
        public int PendingOrders { get; set; }
        public int ApprovedOrders { get; set; }
        public int ReceivedOrders { get; set; }
        public decimal TotalSpend { get; set; }
        public decimal AverageOrderValue { get; set; }
        public decimal TotalSavings { get; set; }
        public List<CostVarianceDto> TopVariances { get; set; } = [];  // ✅ Fixed
        public List<SupplierPerformanceDto> TopPerformers { get; set; } = [];  // ✅ Fixed
    }
}