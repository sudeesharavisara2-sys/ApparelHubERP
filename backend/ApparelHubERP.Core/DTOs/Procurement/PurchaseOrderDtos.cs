using ApparelHubERP.Core.Entities;

namespace ApparelHubERP.Core.DTOs.Procurement
{
    public class PurchaseOrderItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitCost { get; set; }
    }

    public class CreatePurchaseOrderDto
    {
        public int SupplierId { get; set; }
        public DateTime? ExpectedDeliveryDate { get; set; }
        public string? Remarks { get; set; }
        public List<PurchaseOrderItemDto> Items { get; set; } = new();
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
    }

    public class PurchaseOrderResponseDto
    {
        public int Id { get; set; }
        public string PONumber { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public DateTime? ExpectedDeliveryDate { get; set; }
        public decimal TotalAmount { get; set; }
        public PurchaseOrderStatus Status { get; set; }
        public string? Remarks { get; set; }
        public string SupplierName { get; set; } = string.Empty;
        public List<PurchaseOrderItemResponseDto> Items { get; set; } = new();
    }
}