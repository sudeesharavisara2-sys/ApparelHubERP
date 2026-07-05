using ApparelHubERP.Core.DTOs.Employee;
using ApparelHubERP.Core.Entities;
using ApparelHubERP.Core.Interfaces.Services;
using Microsoft.EntityFrameworkCore;

namespace ApparelHubERP.Core.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly DbContext _context;

        public EmployeeService(DbContext context)
        {
            _context = context;
        }

        public async Task<List<EmployeeDto>> GetAllEmployeesAsync()
        {
            return await _context.Set<Employee>()
                .OrderBy(e => e.Name)
                .Select(e => MapToDto(e))
                .ToListAsync();
        }

        public async Task<EmployeeDto?> GetEmployeeByIdAsync(int id)
        {
            var employee = await _context.Set<Employee>().FindAsync(id);
            return employee == null ? null : MapToDto(employee);
        }

        public async Task<EmployeeDto> CreateEmployeeAsync(CreateEmployeeDto dto)
        {
            var employee = new Employee
            {
                Name = dto.Name,
                Email = dto.Email,
                Position = dto.Position,
                NIC = dto.NIC,
                Phone = dto.Phone,
                Address = dto.Address,
                Department = dto.Department,
                Role = dto.Role,
                EPFNo = dto.EPFNo,
                Age = dto.Age,
                Birthday = dto.Birthday,
                DateOfJoining = dto.DateOfJoining,
                BasicSalary = dto.BasicSalary,
                Status = "Active",
                CreatedAt = DateTime.UtcNow
            };

            _context.Set<Employee>().Add(employee);
            await _context.SaveChangesAsync();

            return MapToDto(employee);
        }

        public async Task<EmployeeDto?> UpdateEmployeeAsync(int id, UpdateEmployeeDto dto)
        {
            var employee = await _context.Set<Employee>().FindAsync(id);
            if (employee == null) return null;

            employee.Name = dto.Name;
            employee.Email = dto.Email;
            employee.Position = dto.Position;
            employee.NIC = dto.NIC;
            employee.Phone = dto.Phone;
            employee.Address = dto.Address;
            employee.Department = dto.Department;
            employee.EPFNo = dto.EPFNo;
            employee.Age = dto.Age;
            employee.Birthday = dto.Birthday;
            employee.DateOfJoining = dto.DateOfJoining;
            employee.BasicSalary = dto.BasicSalary;
            employee.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return MapToDto(employee);
        }

        public async Task<bool> DeleteEmployeeAsync(int id)
        {
            var employee = await _context.Set<Employee>().FindAsync(id);
            if (employee == null) return false;

            // Soft delete: deactivate instead of removing the row,
            // since Hansi's payroll module and Chamoth's analytics need historical data
            var previousStatus = employee.Status;
            employee.Status = "Deleted";
            employee.UpdatedAt = DateTime.UtcNow;

            _context.Set<EmployeeStatusLog>().Add(new EmployeeStatusLog
            {
                EmployeeId = employee.Id,
                PreviousStatus = previousStatus,
                NewStatus = "Deleted",
                Reason = "Deactivated via DELETE endpoint",
                ChangedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<EmployeeDto?> UpdateStatusAsync(int id, UpdateEmployeeStatusDto dto, string changedBy)
        {
            var employee = await _context.Set<Employee>().FindAsync(id);
            if (employee == null) return null;

            var previousStatus = employee.Status;
            employee.Status = dto.NewStatus;
            employee.UpdatedAt = DateTime.UtcNow;

            _context.Set<EmployeeStatusLog>().Add(new EmployeeStatusLog
            {
                EmployeeId = employee.Id,
                PreviousStatus = previousStatus,
                NewStatus = dto.NewStatus,
                Reason = dto.Reason,
                ChangedAt = DateTime.UtcNow,
                ChangedBy = changedBy
            });

            await _context.SaveChangesAsync();
            return MapToDto(employee);
        }

        public async Task<EmployeeDto?> UpdateRoleAsync(int id, UpdateEmployeeRoleDto dto)
        {
            var employee = await _context.Set<Employee>().FindAsync(id);
            if (employee == null) return null;

            employee.Role = dto.NewRole;
            employee.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return MapToDto(employee);
        }

        public async Task<List<object>> GetStatusLogsAsync(int employeeId)
        {
            return await _context.Set<EmployeeStatusLog>()
                .Where(l => l.EmployeeId == employeeId)
                .OrderByDescending(l => l.ChangedAt)
                .Select(l => new
                {
                    l.LogId,
                    l.EmployeeId,
                    l.PreviousStatus,
                    l.NewStatus,
                    l.Reason,
                    l.ChangedAt,
                    l.ChangedBy
                })
                .Cast<object>()
                .ToListAsync();
        }

        public async Task<List<EmployeeDto>> GetDeletedEmployeesAsync()
        {
            return await _context.Set<Employee>()
                .Where(e => e.Status == "Deleted")
                .OrderByDescending(e => e.UpdatedAt)
                .Select(e => MapToDto(e))
                .ToListAsync();
        }

        private static EmployeeDto MapToDto(Employee e) => new()
        {
            Id = e.Id,
            Name = e.Name,
            Email = e.Email,
            Position = e.Position,
            NIC = e.NIC,
            Phone = e.Phone,
            Address = e.Address,
            Department = e.Department,
            Role = e.Role,
            EPFNo = e.EPFNo,
            Age = e.Age,
            Birthday = e.Birthday,
            DateOfJoining = e.DateOfJoining,
            BasicSalary = e.BasicSalary,
            Status = e.Status,
            CreatedAt = e.CreatedAt,
            UpdatedAt = e.UpdatedAt
        };
    }
}