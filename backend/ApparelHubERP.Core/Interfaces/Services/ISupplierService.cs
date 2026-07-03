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

        // ✅ NEW: Advanced Methods
        Task<PagedResult<SupplierResponseDto>> GetFilteredAsync(SupplierFilterDto filter);
        Task<IEnumerable<SupplierResponseDto>> GetDeletedAsync();
        Task SoftDeleteAsync(int id);
        Task RestoreAsync(int id);
        Task BulkDeleteAsync(BulkOperationDto dto);
    }
}