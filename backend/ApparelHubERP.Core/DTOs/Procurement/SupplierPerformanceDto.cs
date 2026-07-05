using System;
using System.Collections.Generic;

namespace ApparelHubERP.Core.DTOs.Procurement
{
    public class SupplierPerformanceDto
    {
        public int SupplierId { get; set; }
        public string SupplierName { get; set; } = string.Empty;
        public int TotalOrders { get; set; }
        public int OnTimeDeliveries { get; set; }
        public int LateDeliveries { get; set; }
        public int AcceptedOrders { get; set; }
        public int RejectedOrders { get; set; }
        public decimal AverageResponseTimeHours { get; set; }
        public decimal AverageDeliveryTimeDays { get; set; }
        public decimal QualityScore { get; set; }
        public decimal OnTimeDeliveryRate { get; set; }
        public decimal AcceptanceRate { get; set; }
        public decimal RejectionRate { get; set; }
        public decimal OverallScore { get; set; }
        public string PerformanceRating { get; set; } = string.Empty;
        public string RatingBadgeClass { get; set; } = string.Empty;
        public DateTime LastUpdated { get; set; }
    }

    public class SupplierPerformanceSummaryDto
    {
        public int TotalSuppliers { get; set; }
        public int ExcellentSuppliers { get; set; }
        public int GoodSuppliers { get; set; }
        public int AverageSuppliers { get; set; }
        public int BelowAverageSuppliers { get; set; }
        public int PoorSuppliers { get; set; }
        public decimal AverageOverallScore { get; set; }
        public List<SupplierPerformanceDto> TopPerformers { get; set; } = [];  // ✅ Fixed
        public List<SupplierPerformanceDto> BottomPerformers { get; set; } = [];  // ✅ Fixed
    }
}