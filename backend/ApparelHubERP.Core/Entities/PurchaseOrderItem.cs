namespace ApparelHubERP.Core.Entities
{
    public class PurchaseOrderItem
    {
        public int Id { get; set; }
        public int PurchaseOrderId { get; set; }
        public PurchaseOrder PurchaseOrder { get; set; } = null!;

        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public int QuantityOrdered { get; set; }
        public int QuantityReceived { get; set; } = 0;
        public decimal UnitCost { get; set; }

        public decimal TotalLineCost => QuantityOrdered * UnitCost;
    }
}