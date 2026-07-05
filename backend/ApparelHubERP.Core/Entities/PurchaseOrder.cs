using System;
using System.Collections.Generic;

namespace ApparelHubERP.Core.Entities
{
    public enum PurchaseOrderStatus
    {
        Draft,
        PendingApproval,
        Approved,
        Shipped,
        Received,
        Cancelled
    }

    public class PurchaseOrder
    {
        // ============================================================
        // IDENTIFIERS & BASIC INFO
        // ============================================================
        public int Id { get; set; }
        public string PONumber { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public DateTime? ExpectedDeliveryDate { get; set; }

        // ============================================================
        // FINANCIALS
        // ============================================================
        public decimal TotalAmount { get; set; }

        /// <summary>
        /// Estimated budget for this purchase order.
        /// Used for Cost Variance Analytics.
        /// </summary>
        public decimal BudgetedAmount { get; set; } = 0;

        /// <summary>
        /// Currency of the order (e.g., "USD", "LKR", "EUR")
        /// </summary>
        public string Currency { get; set; } = "USD";

        // ============================================================
        // STATUS & WORKFLOW
        // ============================================================
        public PurchaseOrderStatus Status { get; set; } = PurchaseOrderStatus.Draft;

        /// <summary>
        /// Approval workflow status: "Draft", "Pending", "Approved", "Rejected"
        /// </summary>
        public string? ApprovalStatus { get; set; } = "Draft";

        /// <summary>
        /// User ID who approved this order
        /// </summary>
        public int? ApprovedByUserId { get; set; }

        /// <summary>
        /// Date and time when the order was approved
        /// </summary>
        public DateTime? ApprovedAt { get; set; }

        // ============================================================
        // SEASON & REMARKS
        // ============================================================
        public string? Remarks { get; set; }

        /// <summary>
        /// Season for this order (e.g., "Summer 2025", "Winter 2025")
        /// Used for seasonal price variance analysis.
        /// </summary>
        public string? Season { get; set; }

        // ============================================================
        // SOFT DELETE
        // ============================================================
        public bool IsDeleted { get; set; } = false;
        public DateTime? DeletedAt { get; set; }

        // ============================================================
        // FOREIGN KEYS & NAVIGATION
        // ============================================================
        public int SupplierId { get; set; }
        public Supplier Supplier { get; set; } = null!;

        public ICollection<PurchaseOrderItem> Items { get; set; } = [];

        /// <summary>
        /// Supplier response to this order (one-to-one)
        /// </summary>
        public SupplierResponse? SupplierResponse { get; set; }

        // ============================================================
        // SOFT DELETE METHODS
        // ============================================================
        public void SoftDelete()
        {
            IsDeleted = true;
            DeletedAt = DateTime.UtcNow;
        }

        public void Restore()
        {
            IsDeleted = false;
            DeletedAt = null;
        }
    }
}