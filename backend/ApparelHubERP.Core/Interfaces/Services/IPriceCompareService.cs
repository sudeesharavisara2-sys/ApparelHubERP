using ApparelHubERP.Core.DTOs.Procurement;

namespace ApparelHubERP.Core.Interfaces.Services
{
    public interface IPriceCompareService
    {
        Task<PriceCompareDto> ComparePricesForProductAsync(int productId);
    }
}