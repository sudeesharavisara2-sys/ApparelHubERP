using System;
using System.Collections.Generic;

namespace ApparelHubERP.Core.Entities
{
    public class Supplier
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // ============================================================
        // ✅ SOFT DELETE PROPERTIES
        // ============================================================
        public bool IsDeleted { get; set; } = false;
        public DateTime? DeletedAt { get; set; }

        // ============================================================
        // ✅ NEW: SUPPLIER DETAILS FOR ADVANCED FEATURES
        // ============================================================

        /// <summary>
        /// Types of clothing/products this supplier provides (e.g., "T-Shirts, Jeans, Dresses")
        /// </summary>
        public string? ProductCategories { get; set; }

        /// <summary>
        /// Primary product category (e.g., "Men's Wear", "Women's Wear")
        /// </summary>
        public string? PrimaryCategory { get; set; }

        /// <summary>
        /// Average delivery days for this supplier
        /// </summary>
        public int AverageDeliveryDays { get; set; } = 7;

        /// <summary>
        /// Minimum order value required by this supplier
        /// </summary>
        public decimal MinimumOrderValue { get; set; } = 0;

        // ============================================================
        // NAVIGATION PROPERTIES
        // ============================================================

        /// <summary>
        /// Purchase orders placed with this supplier
        /// </summary>
        public ICollection<PurchaseOrder> PurchaseOrders { get; set; } = [];

        /// <summary>
        /// Supplier responses to purchase orders
        /// </summary>
        public ICollection<SupplierResponse> SupplierResponses { get; set; } = [];

        /// <summary>
        /// Performance metrics for this supplier
        /// </summary>
        public SupplierPerformance? Performance { get; set; }

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