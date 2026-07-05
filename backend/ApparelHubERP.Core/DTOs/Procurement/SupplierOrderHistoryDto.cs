using System;
using System.Collections.Generic;

namespace ApparelHubERP.Core.DTOs.Procurement
{
    public class SupplierOrderHistoryDto
    {
        public int SupplierId { get; set; }
        public string SupplierName { get; set; } = string.Empty;
        public List<OrderHistoryItemDto> Orders { get; set; } = [];  // ✅ Fixed
        public OrderHistorySummaryDto Summary { get; set; } = new();
    }

    public class OrderHistoryItemDto
    {
        public int Id { get; set; }
        public string PONumber { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string SupplierResponseStatus { get; set; } = "Pending";
        public int ItemCount { get; set; }
        public string Season { get; set; } = string.Empty;
        public decimal? PreviousSeasonPrice { get; set; }
        public decimal CurrentPrice { get; set; }
        public decimal PriceVariance { get; set; }
        public string PriceVariancePercentage { get; set; } = "0%";
    }

    public class OrderHistorySummaryDto
    {
        public int TotalOrders { get; set; }
        public int PendingOrders { get; set; }
        public int AcceptedOrders { get; set; }
        public int DeliveredOrders { get; set; }
        public int RejectedOrders { get; set; }
        public decimal TotalSpent { get; set; }
        public decimal AverageOrderValue { get; set; }
        public decimal AveragePriceVariance { get; set; }
    }
}