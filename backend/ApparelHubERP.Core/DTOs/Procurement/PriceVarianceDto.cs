using System;
using System.Collections.Generic;

namespace ApparelHubERP.Core.DTOs.Procurement
{
    public class PriceVarianceDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string Season { get; set; } = string.Empty;
        public decimal PreviousPrice { get; set; }
        public decimal CurrentPrice { get; set; }
        public decimal Variance { get; set; }
        public string VariancePercentage { get; set; } = "0%";
        public string VarianceStatus { get; set; } = "Stable";
        public DateTime ComparisonDate { get; set; }
    }

    public class SeasonalPriceDashboardDto
    {
        public List<PriceVarianceDto> SeasonalVariances { get; set; } = [];  // ✅ Fixed
        public SummaryPriceStatsDto Summary { get; set; } = new();
    }

    public class SummaryPriceStatsDto
    {
        public decimal AveragePriceIncrease { get; set; }
        public int ProductsWithPriceIncrease { get; set; }
        public int ProductsWithPriceDecrease { get; set; }
        public int ProductsStable { get; set; }
        public decimal HighestPriceIncrease { get; set; }
        public decimal HighestPriceDecrease { get; set; }
    }
}