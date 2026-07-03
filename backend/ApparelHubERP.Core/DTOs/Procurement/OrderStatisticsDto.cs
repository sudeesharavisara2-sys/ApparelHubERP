using ApparelHubERP.Core.Entities;

namespace ApparelHubERP.Core.DTOs.Procurement
{
    public class OrderStatisticsDto
    {
        public int TotalOrders { get; set; }
        public decimal TotalAmount { get; set; }
        public Dictionary<PurchaseOrderStatus, int> StatusCounts { get; set; } = new();
        public decimal AverageOrderValue { get; set; }
    }
}