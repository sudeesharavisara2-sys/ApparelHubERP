using System;
using System.Collections.Generic;

namespace ApparelHubERP.Core.DTOs.Procurement
{
    public class PriceCompareDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public List<SupplierPriceDto> SupplierPrices { get; set; } = [];  // ✅ Fixed
        public decimal BestPrice { get; set; }
        public string BestSupplier { get; set; } = string.Empty;
    }

    public class SupplierPriceDto
    {
        public int SupplierId { get; set; }
        public string SupplierName { get; set; } = string.Empty;
        public decimal UnitCost { get; set; }
        public DateTime PriceDate { get; set; }
    }
}