using ApparelHubERP.Core.DTOs.Procurement;
using ApparelHubERP.Core.Entities;
using ApparelHubERP.Core.Interfaces.Repositories;
using ApparelHubERP.Core.Interfaces.Services;

namespace ApparelHubERP.Core.Services
{
    // ✅ Primary constructor (IDE0290)
    public class SupplierService(ISupplierRepository repository) : ISupplierService
    {
        private readonly ISupplierRepository _repository = repository;

        public async Task<IEnumerable<SupplierResponseDto>> GetAllSuppliersAsync()
        {
            var suppliers = await _repository.GetAllAsync();
            return suppliers.Select(s => new SupplierResponseDto
            {
                Id = s.Id,
                Name = s.Name,
                ContactPerson = s.ContactPerson,
                Email = s.Email,
                Phone = s.Phone,
                Address = s.Address,
                IsActive = s.IsActive,
                CreatedAt = s.CreatedAt
            });
        }

        public async Task<SupplierResponseDto?> GetSupplierByIdAsync(int id)
        {
            var supplier = await _repository.GetByIdAsync(id);
            if (supplier is null) return null;  // ✅ Null check simplified
            return new SupplierResponseDto
            {
                Id = supplier.Id,
                Name = supplier.Name,
                ContactPerson = supplier.ContactPerson,
                Email = supplier.Email,
                Phone = supplier.Phone,
                Address = supplier.Address,
                IsActive = supplier.IsActive,
                CreatedAt = supplier.CreatedAt
            };
        }

        public async Task<SupplierResponseDto> CreateSupplierAsync(CreateSupplierDto dto)
        {
            var supplier = new Supplier
            {
                Name = dto.Name,
                ContactPerson = dto.ContactPerson,
                Email = dto.Email,
                Phone = dto.Phone,
                Address = dto.Address,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _repository.AddAsync(supplier);
            await _repository.SaveChangesAsync();

            return new SupplierResponseDto
            {
                Id = supplier.Id,
                Name = supplier.Name,
                ContactPerson = supplier.ContactPerson,
                Email = supplier.Email,
                Phone = supplier.Phone,
                Address = supplier.Address,
                IsActive = supplier.IsActive,
                CreatedAt = supplier.CreatedAt
            };
        }

        public async Task<bool> UpdateSupplierAsync(UpdateSupplierDto dto)
        {
            var supplier = await _repository.GetByIdAsync(dto.Id);
            if (supplier is null) return false;  // ✅ Null check simplified

            supplier.Name = dto.Name;
            supplier.ContactPerson = dto.ContactPerson;
            supplier.Phone = dto.Phone;
            supplier.Address = dto.Address;
            supplier.UpdatedAt = DateTime.UtcNow;

            _repository.Update(supplier);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ToggleSupplierStatusAsync(int id)
        {
            var supplier = await _repository.GetByIdAsync(id);
            if (supplier is null) return false;  // ✅ Null check simplified

            supplier.IsActive = !supplier.IsActive;
            supplier.UpdatedAt = DateTime.UtcNow;

            _repository.Update(supplier);
            await _repository.SaveChangesAsync();
            return true;
        }
    }
}