using ApparelHubERP.Core.DTOs.Employee;
using ApparelHubERP.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace ApparelHubERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var employees = await _employeeService.GetAllEmployeesAsync();
            return Ok(employees);
        }
        [HttpGet("deleted")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetDeleted()
        {
            var employees = await _employeeService.GetDeletedEmployeesAsync();
            return Ok(employees);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var employee = await _employeeService.GetEmployeeByIdAsync(id);
            if (employee == null) return NotFound(new { message = "Employee not found." });
            return Ok(employee);
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEmployeeDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _employeeService.CreateEmployeeAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateEmployeeDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updated = await _employeeService.UpdateEmployeeAsync(id, dto);
            if (updated == null) return NotFound(new { message = "Employee not found." });
            return Ok(updated);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _employeeService.DeleteEmployeeAsync(id);
            if (!success) return NotFound(new { message = "Employee not found." });
            return Ok(new { message = "Employee deactivated successfully." });
        }
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateEmployeeStatusDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var changedBy = User?.Identity?.Name ?? "System";
            var updated = await _employeeService.UpdateStatusAsync(id, dto, changedBy);
            if (updated == null) return NotFound(new { message = "Employee not found." });
            return Ok(updated);
        }
        [HttpGet("{id}/status-logs")]
        public async Task<IActionResult> GetStatusLogs(int id)
        {
            var logs = await _employeeService.GetStatusLogsAsync(id);
            return Ok(logs);
        }
        [HttpPatch("{id}/role")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateRole(int id, [FromBody] UpdateEmployeeRoleDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updated = await _employeeService.UpdateRoleAsync(id, dto);
            if (updated == null) return NotFound(new { message = "Employee not found." });
            return Ok(updated);
        }
    }
}