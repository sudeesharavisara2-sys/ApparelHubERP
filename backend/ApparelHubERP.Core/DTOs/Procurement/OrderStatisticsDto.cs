using System.Collections.Generic;
using ApparelHubERP.Core.Entities;

namespace ApparelHubERP.Core.DTOs.Procurement
{
    public class PurchaseOrderStatisticsDto
    {
        public int TotalOrders { get; set; }
        public decimal TotalAmount { get; set; }
        public Dictionary<PurchaseOrderStatus, int> StatusCounts { get; set; } = [];
        public decimal AverageOrderValue { get; set; }
    }
}