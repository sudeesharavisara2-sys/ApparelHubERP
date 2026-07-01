using ApparelHubERP.Core.DTOs.Attendance;
using ApparelHubERP.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApparelHubERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;

        public AttendanceController(IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        // GET: api/Attendance
        [HttpGet]
        public async Task<IActionResult> GetAllAttendance()
        {
            var records = await _attendanceService.GetAllAttendanceAsync();
            return Ok(records);
        }

        // GET: api/Attendance/employee/5
        [HttpGet("employee/{employeeId}")]
        public async Task<IActionResult> GetAttendanceByEmployee(int employeeId)
        {
            var records = await _attendanceService.GetAttendanceByEmployeeAsync(employeeId);
            return Ok(records);
        }

        // POST: api/Attendance
        [HttpPost]
        public async Task<IActionResult> AddAttendance([FromBody] AttendanceRequestDto request)
        {
            var result = await _attendanceService.AddAttendanceAsync(request);
            return Ok(result);
        }

        // GET: api/Attendance/payroll/5?month=6&year=2026
        [HttpGet("payroll/{employeeId}")]
        public async Task<IActionResult> GetPayroll(int employeeId, [FromQuery] int month, [FromQuery] int year)
        {
            var result = await _attendanceService.CalculatePayrollAsync(employeeId, month, year);
            return Ok(result);
        }

        // GET: api/Attendance/payroll/all?month=6&year=2026
        [HttpGet("payroll/all")]
        public async Task<IActionResult> GetAllPayrolls([FromQuery] int month, [FromQuery] int year)
        {
            var result = await _attendanceService.GetAllPayrollsAsync(month, year);
            return Ok(result);
        }
    }
}