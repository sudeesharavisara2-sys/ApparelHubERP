using ApparelHubERP.Core.Entities;

namespace ApparelHubERP.Core.DTOs.Procurement
{
    public class PurchaseOrderFilterDto
    {
        public int? SupplierId { get; set; }
        public PurchaseOrderStatus? Status { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public bool? IsDeleted { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SortBy { get; set; } // "OrderDate", "TotalAmount"
        public bool SortDescending { get; set; } = true;
    }
}