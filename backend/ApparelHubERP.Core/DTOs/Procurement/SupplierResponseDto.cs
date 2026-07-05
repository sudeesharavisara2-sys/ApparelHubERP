using System;

namespace ApparelHubERP.Core.DTOs.Procurement
{
    /// <summary>
    /// Response DTO for supplier responses to purchase orders
    /// </summary>
    public class SupplierResponseDto
    {
        public int Id { get; set; }
        public int PurchaseOrderId { get; set; }
        public string PONumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string StatusDisplayName { get; set; } = string.Empty;
        public decimal? QuotedTotal { get; set; }
        public DateTime? QuotedDeliveryDate { get; set; }
        public string? Remarks { get; set; }
        public DateTime RespondedAt { get; set; }
        public bool HasResponded { get; set; }
        public bool IsPositiveResponse { get; set; }
        public string StatusBadgeClass { get; set; } = string.Empty;
        public string SupplierName { get; set; } = string.Empty;
    }

    public class CreateSupplierResponseDto
    {
        public int PurchaseOrderId { get; set; }
        public string Status { get; set; } = "Accepted";
        public decimal? QuotedTotal { get; set; }
        public DateTime? QuotedDeliveryDate { get; set; }
        public string? Remarks { get; set; }
    }

    public class UpdateSupplierResponseDto
    {
        public int Id { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal? QuotedTotal { get; set; }
        public DateTime? QuotedDeliveryDate { get; set; }
        public string? Remarks { get; set; }
    }
}