using System;
using System.Collections.Generic;
using ApparelHubERP.Core.Entities;

namespace ApparelHubERP.Core.DTOs.Procurement
{
    public class SupplierFilterDto
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SortBy { get; set; } // "Name", "CreatedAt"
        public bool SortDescending { get; set; } = false;
    }

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

    public partial class BulkOperationDto
    {
        public List<int> Ids { get; set; } = [];
    }

    public class OrderStatisticsDto
    {
        public int TotalOrders { get; set; }
        public decimal TotalAmount { get; set; }
        public Dictionary<PurchaseOrderStatus, int> StatusCounts { get; set; } = [];
        public decimal AverageOrderValue { get; set; }
    }
}