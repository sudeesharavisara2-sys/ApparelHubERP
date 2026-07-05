using System;

namespace ApparelHubERP.Core.Entities
{
    /// <summary>
    /// Represents performance metrics for a supplier
    /// Used for Supplier Performance Scorecard feature
    /// </summary>
    public class SupplierPerformance
    {
        // ============================================================
        // IDENTIFIER
        // ============================================================
        public int Id { get; set; }

        // ============================================================
        // FOREIGN KEYS
        // ============================================================

        /// <summary>
        /// The supplier these metrics belong to
        /// </summary>
        public int SupplierId { get; set; }

        // ============================================================
        // NAVIGATION
        // ============================================================
        public Supplier Supplier { get; set; } = null!;

        // ============================================================
        // ORDER METRICS
        // ============================================================

        /// <summary>
        /// Total number of orders placed with this supplier
        /// </summary>
        public int TotalOrders { get; set; }

        /// <summary>
        /// Number of orders delivered on time
        /// </summary>
        public int OnTimeDeliveries { get; set; }

        /// <summary>
        /// Number of orders delivered late
        /// </summary>
        public int LateDeliveries { get; set; }

        /// <summary>
        /// Number of orders accepted by supplier
        /// </summary>
        public int AcceptedOrders { get; set; }

        /// <summary>
        /// Number of orders rejected by supplier
        /// </summary>
        public int RejectedOrders { get; set; }

        // ============================================================
        // TIME METRICS
        // ============================================================

        /// <summary>
        /// Average response time in hours (from PO send to supplier response)
        /// </summary>
        public decimal AverageResponseTimeHours { get; set; }

        /// <summary>
        /// Average delivery time in days (from shipment to receipt)
        /// </summary>
        public decimal AverageDeliveryTimeDays { get; set; }

        // ============================================================
        // QUALITY METRICS
        // ============================================================

        /// <summary>
        /// Quality score out of 100 (based on returns, defects, etc.)
        /// </summary>
        public decimal QualityScore { get; set; } // 0 to 100

        // ============================================================
        // AUDIT
        // ============================================================

        /// <summary>
        /// When these metrics were last updated
        /// </summary>
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

        // ============================================================
        // COMPUTED PROPERTIES
        // ============================================================

        /// <summary>
        /// On-time delivery rate as percentage
        /// </summary>
        public decimal OnTimeDeliveryRate => TotalOrders > 0
            ? Math.Round((decimal)OnTimeDeliveries / TotalOrders * 100, 2)
            : 0;

        /// <summary>
        /// Acceptance rate as percentage
        /// </summary>
        public decimal AcceptanceRate => TotalOrders > 0
            ? Math.Round((decimal)AcceptedOrders / TotalOrders * 100, 2)
            : 0;

        /// <summary>
        /// Rejection rate as percentage
        /// </summary>
        public decimal RejectionRate => TotalOrders > 0
            ? Math.Round((decimal)RejectedOrders / TotalOrders * 100, 2)
            : 0;

        /// <summary>
        /// Overall performance score (weighted average)
        /// </summary>
        public decimal OverallScore
        {
            get
            {
                // Weighted average: 40% OnTime, 30% Acceptance, 30% Quality
                var weightedScore = (OnTimeDeliveryRate * 0.4m) +
                                    (AcceptanceRate * 0.3m) +
                                    (QualityScore * 0.3m);
                return Math.Round(weightedScore, 2);
            }
        }

        /// <summary>
        /// Performance rating based on OverallScore
        /// </summary>
        public string PerformanceRating => OverallScore switch
        {
            >= 90 => "Excellent",
            >= 75 => "Good",
            >= 60 => "Average",
            >= 40 => "Below Average",
            _ => "Poor"
        };

        /// <summary>
        /// CSS class for performance rating badge
        /// </summary>
        public string RatingBadgeClass => OverallScore switch
        {
            >= 90 => "badge-success",
            >= 75 => "badge-info",
            >= 60 => "badge-warning",
            >= 40 => "badge-danger",
            _ => "badge-danger"
        };

        // ============================================================
        // METHODS
        // ============================================================

        /// <summary>
        /// Update performance metrics based on a new order
        /// </summary>
        public void UpdateMetrics(bool onTime, bool accepted, decimal responseHours, decimal deliveryDays)
        {
            TotalOrders++;
            if (onTime) OnTimeDeliveries++;
            else LateDeliveries++;
            if (accepted) AcceptedOrders++;
            else RejectedOrders++;

            // Update running averages
            AverageResponseTimeHours = ((AverageResponseTimeHours * (TotalOrders - 1)) + responseHours) / TotalOrders;
            AverageDeliveryTimeDays = ((AverageDeliveryTimeDays * (TotalOrders - 1)) + deliveryDays) / TotalOrders;

            LastUpdated = DateTime.UtcNow;
        }

        /// <summary>
        /// Update quality score
        /// </summary>
        public void UpdateQualityScore(decimal qualityScore)
        {
            QualityScore = Math.Clamp(qualityScore, 0, 100);
            LastUpdated = DateTime.UtcNow;
        }
    }
}