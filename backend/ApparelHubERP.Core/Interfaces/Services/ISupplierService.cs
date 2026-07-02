using ApparelHubERP.Core.DTOs.Procurement;

namespace ApparelHubERP.Core.Interfaces.Services
{
    public interface ISupplierService
    {
        Task<IEnumerable<SupplierResponseDto>> GetAllSuppliersAsync();
        Task<SupplierResponseDto?> GetSupplierByIdAsync(int id);
        Task<SupplierResponseDto> CreateSupplierAsync(CreateSupplierDto dto);
        Task<bool> UpdateSupplierAsync(UpdateSupplierDto dto);
        Task<bool> ToggleSupplierStatusAsync(int id);
    }
}