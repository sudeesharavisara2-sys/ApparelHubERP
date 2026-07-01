using ApparelHubERP.Core.DTOs.Attendance;

namespace ApparelHubERP.Core.Interfaces.Services
{
    public interface IAttendanceService
    {
        Task<List<AttendanceDto>> GetAllAttendanceAsync();
        Task<List<AttendanceDto>> GetAttendanceByEmployeeAsync(int employeeId);
        Task<AttendanceDto> AddAttendanceAsync(AttendanceRequestDto request);
        Task<PayrollDto> CalculatePayrollAsync(int employeeId, int month, int year);
        Task<List<PayrollDto>> GetAllPayrollsAsync(int month, int year);
    }
}