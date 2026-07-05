using ApparelHubERP.Core.DTOs.Procurement;

namespace ApparelHubERP.Core.Interfaces.Services
{
    public interface ISupplierResponseService
    {
        Task<IEnumerable<SupplierResponseDto>> GetResponsesForSupplierAsync(int supplierId);
        Task<SupplierResponseDto> CreateOrUpdateResponseAsync(int supplierId, CreateSupplierResponseDto dto);
        Task<IEnumerable<PurchaseOrderResponseDto>> GetOrdersForSupplierAsync(int supplierId);
    }
}