using System.Linq;
using ApparelHubERP.Core.DTOs.Procurement;
using ApparelHubERP.Core.Interfaces.Repositories;
using ApparelHubERP.Core.Interfaces.Services;

namespace ApparelHubERP.Core.Services
{
    public class PriceCompareService(IProductRepository productRepo, IPurchaseOrderRepository poRepo) : IPriceCompareService
    {
        public IPurchaseOrderRepository PoRepo { get; } = poRepo;

        public async Task<PriceCompareDto> ComparePricesForProductAsync(int productId)
        {
            var product = await productRepo.GetByIdAsync(productId)
                ?? throw new Exception("Product not found.");

            var prices = await productRepo.GetSupplierPricesForProductAsync(productId);
            var best = prices.OrderBy(p => p.UnitCost).FirstOrDefault();

            return new PriceCompareDto
            {
                ProductId = productId,
                ProductName = product.Name,
                SupplierPrices = [.. prices],
                BestPrice = best?.UnitCost ?? 0,
                BestSupplier = best?.SupplierName ?? "N/A"
            };
        }
    }
}