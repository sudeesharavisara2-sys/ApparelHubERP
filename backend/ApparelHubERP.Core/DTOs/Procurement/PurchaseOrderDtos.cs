using ApparelHubERP.Core.Entities;
using System;
using System.Collections.Generic;

namespace ApparelHubERP.Core.DTOs.Procurement
{
    public class PurchaseOrderItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitCost { get; set; }
        public decimal? PreviousSeasonUnitCost { get; set; }
    }

    public class CreatePurchaseOrderDto
    {
        public int SupplierId { get; set; }
        public DateTime? ExpectedDeliveryDate { get; set; }
        public string? Remarks { get; set; }
        public decimal BudgetedAmount { get; set; } = 0;
        public string? Season { get; set; }
        public List<PurchaseOrderItemDto> Items { get; set; } = [];
    }

    public class UpdatePurchaseOrderStatusDto
    {
        public PurchaseOrderStatus Status { get; set; }
    }

    public class PurchaseOrderItemResponseDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int QuantityOrdered { get; set; }
        public int QuantityReceived { get; set; }
        public decimal UnitCost { get; set; }
        public decimal TotalLineCost { get; set; }
        public decimal? PreviousSeasonUnitCost { get; set; }
        public string? Season { get; set; }
    }

    public class PurchaseOrderResponseDto
    {
        public int Id { get; set; }
        public string PONumber { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public DateTime? ExpectedDeliveryDate { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal BudgetedAmount { get; set; }
        public string Currency { get; set; } = "USD";
        public PurchaseOrderStatus Status { get; set; }
        public string? Remarks { get; set; }
        public string SupplierName { get; set; } = string.Empty;
        public string? ResponseStatus { get; set; }
        public string? Season { get; set; }
        public string? ApprovalStatus { get; set; }
        public decimal PriceVariance { get; set; }
        public List<PurchaseOrderItemResponseDto> Items { get; set; } = [];
    }

    // ❌ REMOVE UpdateOrderItemsDto FROM THIS FILE – It should be in its own file
}