namespace ApparelHubERP.Core.DTOs.Procurement
{
    public class UpdateOrderItemsDto
    {
        public List<PurchaseOrderItemDto> Items { get; set; } = new();
    }
}