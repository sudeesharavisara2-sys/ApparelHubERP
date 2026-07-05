using ApparelHubERP.Core.DTOs.Procurement;
using ApparelHubERP.Core.Entities;
using ApparelHubERP.Core.Interfaces.Repositories;
using ApparelHubERP.Core.Interfaces.Services;   // ✅ Only once

namespace ApparelHubERP.Core.Services
{
    public class SupplierService(ISupplierRepository _repository) : ISupplierService
    {
        // _repository is available throughout the class; keep the rest of the file unchanged.

        // ============================================================
        // BASIC CRUD
        // ============================================================

        public async Task<IEnumerable<SupplierDto>> GetAllSuppliersAsync()
        {
            var suppliers = await _repository.GetAllAsync();
            return suppliers.Select(s => new SupplierDto
            {
                Id = s.Id,
                Name = s.Name,
                ContactPerson = s.ContactPerson,
                Email = s.Email,
                Phone = s.Phone,
                Address = s.Address,
                IsActive = s.IsActive,
                IsDeleted = s.IsDeleted,
                CreatedAt = s.CreatedAt,
                ProductCategories = s.ProductCategories,
                AverageDeliveryDays = s.AverageDeliveryDays,
                MinimumOrderValue = s.MinimumOrderValue
            });
        }

        public async Task<SupplierDto?> GetSupplierByIdAsync(int id)
        {
            var s = await _repository.GetByIdAsync(id);
            if (s == null) return null;
            return new SupplierDto
            {
                Id = s.Id,
                Name = s.Name,
                ContactPerson = s.ContactPerson,
                Email = s.Email,
                Phone = s.Phone,
                Address = s.Address,
                IsActive = s.IsActive,
                IsDeleted = s.IsDeleted,
                CreatedAt = s.CreatedAt,
                ProductCategories = s.ProductCategories,
                AverageDeliveryDays = s.AverageDeliveryDays,
                MinimumOrderValue = s.MinimumOrderValue
            };
        }

        public async Task<SupplierDto> CreateSupplierAsync(CreateSupplierDto dto)
        {
            var supplier = new Supplier
            {
                Name = dto.Name,
                ContactPerson = dto.ContactPerson,
                Email = dto.Email,
                Phone = dto.Phone,
                Address = dto.Address,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                ProductCategories = dto.ProductCategories,
                AverageDeliveryDays = dto.AverageDeliveryDays,
                MinimumOrderValue = dto.MinimumOrderValue
            };

            await _repository.AddAsync(supplier);
            await _repository.SaveChangesAsync();

            return new SupplierDto
            {
                Id = supplier.Id,
                Name = supplier.Name,
                ContactPerson = supplier.ContactPerson,
                Email = supplier.Email,
                Phone = supplier.Phone,
                Address = supplier.Address,
                IsActive = supplier.IsActive,
                CreatedAt = supplier.CreatedAt,
                ProductCategories = supplier.ProductCategories,
                AverageDeliveryDays = supplier.AverageDeliveryDays,
                MinimumOrderValue = supplier.MinimumOrderValue
            };
        }

        public async Task<bool> UpdateSupplierAsync(UpdateSupplierDto dto)
        {
            var supplier = await _repository.GetByIdAsync(dto.Id);
            if (supplier == null) return false;

            supplier.Name = dto.Name;
            supplier.ContactPerson = dto.ContactPerson;
            supplier.Phone = dto.Phone;
            supplier.Address = dto.Address;
            supplier.ProductCategories = dto.ProductCategories;
            supplier.AverageDeliveryDays = dto.AverageDeliveryDays;
            supplier.UpdatedAt = DateTime.UtcNow;

            _repository.Update(supplier);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ToggleSupplierStatusAsync(int id)
        {
            var supplier = await _repository.GetByIdAsync(id);
            if (supplier == null) return false;

            supplier.IsActive = !supplier.IsActive;
            supplier.UpdatedAt = DateTime.UtcNow;

            _repository.Update(supplier);
            await _repository.SaveChangesAsync();
            return true;
        }

        // ============================================================
        // PAGINATION & FILTERING
        // ============================================================

        public async Task<PagedResult<SupplierDto>> GetFilteredAsync(SupplierFilterDto filter)
        {
            var result = await _repository.GetFilteredAsync(filter);
            return new PagedResult<SupplierDto>
            {
                Items = [.. result.Items.Select(s => new SupplierDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    ContactPerson = s.ContactPerson,
                    Email = s.Email,
                    Phone = s.Phone,
                    Address = s.Address,
                    IsActive = s.IsActive,
                    IsDeleted = s.IsDeleted,
                    CreatedAt = s.CreatedAt,
                    ProductCategories = s.ProductCategories,
                    AverageDeliveryDays = s.AverageDeliveryDays,
                    MinimumOrderValue = s.MinimumOrderValue
                })],
                TotalCount = result.TotalCount,
                Page = result.Page,
                PageSize = result.PageSize
            };
        }

        // ============================================================
        // SOFT DELETE & BULK OPERATIONS
        // ============================================================

        public async Task<IEnumerable<SupplierDto>> GetDeletedAsync()
        {
            var suppliers = await _repository.GetDeletedAsync();
            return suppliers.Select(s => new SupplierDto
            {
                Id = s.Id,
                Name = s.Name,
                ContactPerson = s.ContactPerson,
                Email = s.Email,
                Phone = s.Phone,
                Address = s.Address,
                IsActive = s.IsActive,
                CreatedAt = s.CreatedAt,
                ProductCategories = s.ProductCategories,
                AverageDeliveryDays = s.AverageDeliveryDays,
                MinimumOrderValue = s.MinimumOrderValue
            });
        }

        public async Task SoftDeleteAsync(int id)
        {
            var supplier = await _repository.GetByIdAsync(id) ?? throw new Exception("Supplier not found.");
            supplier.SoftDelete();
            await _repository.SaveChangesAsync();
        }

        public async Task RestoreAsync(int id)
        {
            await _repository.RestoreAsync(id);
        }

        public async Task BulkDeleteAsync(BulkOperationDto dto)
        {
            if (dto.Ids == null || dto.Ids.Count == 0)
                throw new Exception("No supplier IDs provided.");
            await _repository.BulkDeleteAsync(dto.Ids);
        }
    }
}