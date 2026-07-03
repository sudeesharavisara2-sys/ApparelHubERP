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
        public int Id { get; set; }
        public string PONumber { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public DateTime? ExpectedDeliveryDate { get; set; }
        public decimal TotalAmount { get; set; }
        public PurchaseOrderStatus Status { get; set; } = PurchaseOrderStatus.Draft;
        public string? Remarks { get; set; }

        public int SupplierId { get; set; }
        public Supplier Supplier { get; set; } = null!;

        public ICollection<PurchaseOrderItem> Items { get; set; } = [];

        // ✅ NEW: Soft Delete Properties
        public bool IsDeleted { get; set; } = false;
        public DateTime? DeletedAt { get; set; }

        // ✅ NEW: Soft Delete Methods
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