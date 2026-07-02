namespace ApparelHubERP.Core.Entities
{
    // ⚠️ TEMPORARY - Remove when Member 04 finishes
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int StockQuantity { get; set; }
        public int ReorderLevel { get; set; }
    }
}