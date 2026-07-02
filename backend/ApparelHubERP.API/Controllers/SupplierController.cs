using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ApparelHubERP.Core.DTOs.Procurement;
using ApparelHubERP.Core.Interfaces.Services;

namespace ApparelHubERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "ProcurementOfficer,ManagerBoard,Admin")]
    public class SupplierController : ControllerBase
    {
        private readonly ISupplierService _supplierService;

        public SupplierController(ISupplierService supplierService)
        {
            _supplierService = supplierService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var suppliers = await _supplierService.GetAllSuppliersAsync();
            return Ok(suppliers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var supplier = await _supplierService.GetSupplierByIdAsync(id);
            if (supplier == null)
                return NotFound(new { message = "Supplier not found." });
            return Ok(supplier);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSupplierDto dto)
        {
            try
            {
                var result = await _supplierService.CreateSupplierAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateSupplierDto dto)
        {
            if (id != dto.Id)
                return BadRequest(new { message = "ID mismatch." });

            try
            {
                var result = await _supplierService.UpdateSupplierAsync(dto);
                if (!result)
                    return NotFound(new { message = "Supplier not found." });
                return Ok(new { message = "Supplier updated successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("{id}/toggle-status")]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            try
            {
                var result = await _supplierService.ToggleSupplierStatusAsync(id);
                if (!result)
                    return NotFound(new { message = "Supplier not found." });
                return Ok(new { message = "Supplier status toggled successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}