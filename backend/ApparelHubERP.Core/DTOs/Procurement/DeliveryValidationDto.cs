namespace ApparelHubERP.Core.DTOs.Procurement
{
    public class DeliveryValidationDto
    {
        public int PurchaseOrderId { get; set; }
        public string PONumber { get; set; } = string.Empty;
        public List<DeliveryItemValidationDto> Items { get; set; } = [];  // ✅ Fixed
        public bool IsValid { get; set; }
        public string? ValidationMessage { get; set; }
    }

    public class DeliveryItemValidationDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int OrderedQuantity { get; set; }
        public int ReceivedQuantity { get; set; }
        public bool IsMatch { get; set; }
        public string? DiscrepancyMessage { get; set; }
    }
}