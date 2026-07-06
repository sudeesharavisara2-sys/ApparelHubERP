using ApparelHubERP.Core.DTOs.Employee;

namespace ApparelHubERP.Core.Interfaces.Services
{
    public interface IEmployeeService
    {
        Task<List<EmployeeDto>> GetAllEmployeesAsync();
        Task<EmployeeDto?> GetEmployeeByIdAsync(int id);
        Task<EmployeeDto> CreateEmployeeAsync(CreateEmployeeDto dto);
        Task<EmployeeDto?> UpdateEmployeeAsync(int id, UpdateEmployeeDto dto);
        Task<bool> DeleteEmployeeAsync(int id); // deactivates instead of hard delete
        Task<EmployeeDto?> UpdateStatusAsync(int id, UpdateEmployeeStatusDto dto, string changedBy);
        Task<EmployeeDto?> UpdateRoleAsync(int id, UpdateEmployeeRoleDto dto);
        Task<List<object>> GetStatusLogsAsync(int employeeId);
        Task<List<EmployeeDto>> GetDeletedEmployeesAsync();
    }
}