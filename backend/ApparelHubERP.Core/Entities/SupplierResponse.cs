using System;

namespace ApparelHubERP.Core.Entities
{
    /// <summary>
    /// Status of a supplier's response to a purchase order
    /// </summary>
    public enum SupplierResponseStatus
    {
        /// <summary>
        /// Initial state - supplier has not yet responded
        /// </summary>
        Pending,

        /// <summary>
        /// Supplier has accepted the purchase order
        /// </summary>
        Accepted,

        /// <summary>
        /// Supplier has rejected the purchase order
        /// </summary>
        Rejected,

        /// <summary>
        /// Supplier has provided a counter-offer with different pricing/delivery
        /// </summary>
        Quoted
    }

    /// <summary>
    /// Represents a supplier's response to a purchase order
    /// Used for Supplier Response Portal feature
    /// </summary>
    public class SupplierResponse
    {
        // ============================================================
        // IDENTIFIER
        // ============================================================
        public int Id { get; set; }

        // ============================================================
        // FOREIGN KEYS
        // ============================================================

        /// <summary>
        /// The purchase order this response belongs to
        /// </summary>
        public int PurchaseOrderId { get; set; }

        /// <summary>
        /// The supplier who is responding
        /// </summary>
        public int SupplierId { get; set; }

        // ============================================================
        // NAVIGATION PROPERTIES
        // ============================================================
        public PurchaseOrder PurchaseOrder { get; set; } = null!;
        public Supplier Supplier { get; set; } = null!;

        // ============================================================
        // RESPONSE DETAILS
        // ============================================================

        /// <summary>
        /// Current status of the response
        /// </summary>
        public SupplierResponseStatus Status { get; set; } = SupplierResponseStatus.Pending;

        /// <summary>
        /// If supplier quoted a different total amount
        /// </summary>
        public decimal? QuotedTotal { get; set; }

        /// <summary>
        /// If supplier quoted a different delivery date
        /// </summary>
        public DateTime? QuotedDeliveryDate { get; set; }

        /// <summary>
        /// Any additional notes from the supplier
        /// </summary>
        public string? Remarks { get; set; }

        // ============================================================
        // AUDIT
        // ============================================================

        /// <summary>
        /// When the supplier responded (auto-set to UTC now)
        /// </summary>
        public DateTime RespondedAt { get; set; } = DateTime.UtcNow;

        // ============================================================
        // COMPUTED PROPERTIES
        // ============================================================

        /// <summary>
        /// True if the supplier has responded (status is not Pending)
        /// </summary>
        public bool HasResponded => Status != SupplierResponseStatus.Pending;

        /// <summary>
        /// True if the response was positive (Accepted or Quoted)
        /// </summary>
        public bool IsPositiveResponse => Status == SupplierResponseStatus.Accepted || Status == SupplierResponseStatus.Quoted;

        /// <summary>
        /// Gets the display status as a friendly string
        /// </summary>
        public string StatusDisplayName => Status switch
        {
            SupplierResponseStatus.Pending => "Awaiting Response",
            SupplierResponseStatus.Accepted => "Accepted",
            SupplierResponseStatus.Rejected => "Rejected",
            SupplierResponseStatus.Quoted => "Counter Offer Provided",
            _ => Status.ToString()
        };

        /// <summary>
        /// Gets the CSS class for status badge
        /// </summary>
        public string StatusBadgeClass => Status switch
        {
            SupplierResponseStatus.Pending => "badge-warning",
            SupplierResponseStatus.Accepted => "badge-success",
            SupplierResponseStatus.Rejected => "badge-danger",
            SupplierResponseStatus.Quoted => "badge-info",
            _ => "badge-secondary"
        };
    }
}