using System;

namespace ApparelHubERP.Core.DTOs.Procurement
{
    /// <summary>
    /// DTO for creating a new supplier
    /// </summary>
    public class CreateSupplierDto
    {
        public string Name { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;

        /// <summary>
        /// Types of products this supplier provides
        /// </summary>
        public string? ProductCategories { get; set; }

        /// <summary>
        /// Average delivery days for this supplier
        /// </summary>
        public int AverageDeliveryDays { get; set; } = 7;

        /// <summary>
        /// Minimum order value required
        /// </summary>
        public decimal MinimumOrderValue { get; set; } = 0;
    }

    /// <summary>
    /// DTO for updating an existing supplier
    /// </summary>
    public class UpdateSupplierDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;

        /// <summary>
        /// Types of products this supplier provides
        /// </summary>
        public string? ProductCategories { get; set; }

        /// <summary>
        /// Average delivery days for this supplier
        /// </summary>
        public int AverageDeliveryDays { get; set; } = 7;
    }

    /// <summary>
    /// Response DTO for supplier data
    /// </summary>
    public class SupplierDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Types of products this supplier provides
        /// </summary>
        public string? ProductCategories { get; set; }

        /// <summary>
        /// Average delivery days for this supplier
        /// </summary>
        public int AverageDeliveryDays { get; set; }

        /// <summary>
        /// Minimum order value required
        /// </summary>
        public decimal MinimumOrderValue { get; set; }
    }
}