using ApparelHubERP.Core.DTOs.Procurement;

namespace ApparelHubERP.Core.Interfaces.Services
{
    public interface ISupplierService
    {
        // Basic CRUD
        Task<IEnumerable<SupplierDto>> GetAllSuppliersAsync();
        Task<SupplierDto?> GetSupplierByIdAsync(int id);
        Task<SupplierDto> CreateSupplierAsync(CreateSupplierDto dto);
        Task<bool> UpdateSupplierAsync(UpdateSupplierDto dto);
        Task<bool> ToggleSupplierStatusAsync(int id);

        // Advanced
        Task<PagedResult<SupplierDto>> GetFilteredAsync(SupplierFilterDto filter);
        Task<IEnumerable<SupplierDto>> GetDeletedAsync();
        Task SoftDeleteAsync(int id);
        Task RestoreAsync(int id);
        Task BulkDeleteAsync(BulkOperationDto dto);
    }
}