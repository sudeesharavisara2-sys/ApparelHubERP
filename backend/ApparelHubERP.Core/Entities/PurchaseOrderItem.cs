namespace ApparelHubERP.Core.Entities
{
    public class PurchaseOrderItem
    {
        public int Id { get; set; }

        // ============================================================
        // FOREIGN KEYS & NAVIGATION
        // ============================================================
        public int PurchaseOrderId { get; set; }
        public PurchaseOrder PurchaseOrder { get; set; } = null!;

        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        // ============================================================
        // QUANTITIES & COSTS
        // ============================================================
        public int QuantityOrdered { get; set; }
        public int QuantityReceived { get; set; } = 0;
        public decimal UnitCost { get; set; }

        // ✅ Computed Property
        public decimal TotalLineCost => QuantityOrdered * UnitCost;

        // ============================================================
        // ✅ NEW: SEASONAL PRICE TRACKING
        // ============================================================

        /// <summary>
        /// Price from previous season for comparison (e.g., Summer 2024)
        /// Used for Seasonal Price Variance Analysis
        /// </summary>
        public decimal? PreviousSeasonUnitCost { get; set; }

        /// <summary>
        /// Season this order belongs to (e.g., "Summer 2025", "Winter 2025")
        /// Used for filtering and seasonal trends
        /// </summary>
        public string? Season { get; set; }

        // ============================================================
        // ✅ NEW: CALCULATED PROPERTIES FOR ANALYTICS
        // ============================================================

        /// <summary>
        /// Price difference between current and previous season
        /// </summary>
        public decimal PriceVariance => PreviousSeasonUnitCost.HasValue
            ? UnitCost - PreviousSeasonUnitCost.Value
            : 0;

        /// <summary>
        /// Price variance as percentage
        /// </summary>
        public decimal PriceVariancePercentage => PreviousSeasonUnitCost.HasValue && PreviousSeasonUnitCost.Value > 0
            ? ((UnitCost - PreviousSeasonUnitCost.Value) / PreviousSeasonUnitCost.Value) * 100
            : 0;

        /// <summary>
        /// Status of price change: "Increased", "Decreased", "Stable", "N/A"
        /// </summary>
        public string PriceVarianceStatus => !PreviousSeasonUnitCost.HasValue
            ? "N/A"
            : UnitCost > PreviousSeasonUnitCost.Value
                ? "Increased"
                : UnitCost < PreviousSeasonUnitCost.Value
                    ? "Decreased"
                    : "Stable";
    }
}