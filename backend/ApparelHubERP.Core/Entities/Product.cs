using System;
using System.Collections.Generic;

namespace ApparelHubERP.Core.Entities
{
    public class Product
    {
        // ============================================================
        // BASIC IDENTIFIERS
        // ============================================================
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? SKU { get; set; } // Stock Keeping Unit
        public string? Barcode { get; set; }

        // ============================================================
        // CATEGORIZATION
        // ============================================================
        public string? Category { get; set; }          // e.g., "T-Shirts", "Jeans"
        public string? SubCategory { get; set; }       // e.g., "Men's", "Women's"
        public string? Type { get; set; }              // e.g., "Cotton", "Denim"
        public string? Brand { get; set; }

        // ============================================================
        // INVENTORY & STOCK
        // ============================================================
        public int StockQuantity { get; set; }

        // ============================================================
        // PRICING
        // ============================================================
        public decimal UnitPrice { get; set; }           // Selling price
        public decimal CostPrice { get; set; }           // Purchase cost
        public string? Currency { get; set; } = "USD";

        // ============================================================
        // ATTRIBUTES (For clothing items)
        // ============================================================
        public string? Color { get; set; }
        public string? Size { get; set; }
        public string? Material { get; set; }
        public string? Season { get; set; }              // e.g., "Summer", "Winter"

        // ============================================================
        // STATUS & TRACKING
        // ============================================================
        public bool IsActive { get; set; } = true;
        public bool IsDiscontinued { get; set; } = false;

        // ============================================================
        // AUDIT
        // ============================================================
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // ============================================================
        // COMPUTED PROPERTIES
        // ============================================================

        /// <summary>
        /// Returns true if stock is at or below reorder level
        /// </summary>
        public bool IsLowStock => StockQuantity <= ReorderLevel;

        /// <summary>
        /// Profit margin percentage (if UnitPrice > 0)
        /// </summary>
        public decimal ProfitMargin => UnitPrice > 0
            ? ((UnitPrice - CostPrice) / UnitPrice) * 100
            : 0;

        // ============================================================
        // NAVIGATION PROPERTIES
        // ============================================================

        /// <summary>
        /// Purchase order items for this product
        /// </summary>
        public ICollection<PurchaseOrderItem> PurchaseOrderItems { get; set; } = [];

        // ============================================================
        // METHODS
        // ============================================================

        public void UpdateStock(int quantity)
        {
            StockQuantity += quantity;
            UpdatedAt = DateTime.UtcNow;
        }

        public int GetSuggestedReorderQuantity()
        {
            if (StockQuantity >= ReorderLevel) return 0;
            return ReorderQuantity;
        }
    }
}