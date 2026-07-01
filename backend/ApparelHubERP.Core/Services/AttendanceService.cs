using ApparelHubERP.Core.DTOs.Attendance;
using ApparelHubERP.Core.Entities;
using ApparelHubERP.Core.Interfaces.Services;
using Microsoft.EntityFrameworkCore;

namespace ApparelHubERP.Core.Services
{
    public class AttendanceService : IAttendanceService
    {
        private readonly DbContext _context;

        public AttendanceService(DbContext context)
        {
            _context = context;
        }

        public async Task<List<AttendanceDto>> GetAllAttendanceAsync()
        {
            var records = await _context.Set<AttendanceRecord>()
                .Include(a => a.Employee)
                .ToListAsync();

            return records.Select(a => new AttendanceDto
            {
                Id = a.Id,
                EmployeeId = a.EmployeeId,
                EmployeeName = a.Employee.Name,
                Date = a.Date,
                ClockIn = a.ClockIn,
                ClockOut = a.ClockOut,
                OvertimeHours = a.OvertimeHours,
                Status = a.Status
            }).ToList();
        }

        public async Task<List<AttendanceDto>> GetAttendanceByEmployeeAsync(int employeeId)
        {
            var records = await _context.Set<AttendanceRecord>()
                .Include(a => a.Employee)
                .Where(a => a.EmployeeId == employeeId)
                .ToListAsync();

            return records.Select(a => new AttendanceDto
            {
                Id = a.Id,
                EmployeeId = a.EmployeeId,
                EmployeeName = a.Employee.Name,
                Date = a.Date,
                ClockIn = a.ClockIn,
                ClockOut = a.ClockOut,
                OvertimeHours = a.OvertimeHours,
                Status = a.Status
            }).ToList();
        }

        public async Task<AttendanceDto> AddAttendanceAsync(AttendanceRequestDto request)
        {
            // Calculate overtime
            double overtimeHours = 0;
            if (request.ClockOut.HasValue)
            {
                double hoursWorked = (request.ClockOut.Value - request.ClockIn).TotalHours;
                overtimeHours = hoursWorked > 8 ? hoursWorked - 8 : 0;
            }

            var record = new AttendanceRecord
            {
                EmployeeId = request.EmployeeId,
                Date = request.Date,
                ClockIn = request.ClockIn,
                ClockOut = request.ClockOut,
                OvertimeHours = overtimeHours,
                Status = "Present"
            };

            _context.Set<AttendanceRecord>().Add(record);
            await _context.SaveChangesAsync();

            var employee = await _context.Set<Employee>()
                .FindAsync(request.EmployeeId);

            return new AttendanceDto
            {
                Id = record.Id,
                EmployeeId = record.EmployeeId,
                EmployeeName = employee?.Name ?? "",
                Date = record.Date,
                ClockIn = record.ClockIn,
                ClockOut = record.ClockOut,
                OvertimeHours = record.OvertimeHours,
                Status = record.Status
            };
        }

        public async Task<PayrollDto> CalculatePayrollAsync(int employeeId, int month, int year)
        {
            var records = await _context.Set<AttendanceRecord>()
                .Include(a => a.Employee)
                .Where(a => a.EmployeeId == employeeId
                    && a.Date.Month == month
                    && a.Date.Year == year
                    && a.Status == "Present")
                .ToListAsync();

            var employee = await _context.Set<Employee>().FindAsync(employeeId);

            int daysWorked = records.Count;
            double totalOT = records.Sum(r => r.OvertimeHours);

            decimal basicSalary = daysWorked * 2500;
            decimal otRate = 500; // LKR per OT hour
            decimal otPay = (decimal)totalOT * otRate;
            decimal grossSalary = basicSalary + otPay;

            decimal epf = grossSalary * 0.08m;  // 8% EPF
            decimal etf = grossSalary * 0.03m;  // 3% ETF
            decimal netSalary = grossSalary - epf - etf;

            return new PayrollDto
            {
                EmployeeId = employeeId,
                EmployeeName = employee?.Name ?? "",
                Month = month,
                Year = year,
                DaysWorked = daysWorked,
                OvertimeHours = totalOT,
                GrossSalary = grossSalary,
                EPFDeduction = epf,
                ETFDeduction = etf,
                NetSalary = netSalary
            };
        }

        public async Task<List<PayrollDto>> GetAllPayrollsAsync(int month, int year)
        {
            var employees = await _context.Set<Employee>().ToListAsync();
            var payrolls = new List<PayrollDto>();

            foreach (var emp in employees)
            {
                var payroll = await CalculatePayrollAsync(emp.Id, month, year);
                payrolls.Add(payroll);
            }

            return payrolls;
        }
    }
}