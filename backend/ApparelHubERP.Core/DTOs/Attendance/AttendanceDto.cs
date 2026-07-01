namespace ApparelHubERP.Core.DTOs.Attendance
{
    public class AttendanceDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public TimeSpan ClockIn { get; set; }
        public TimeSpan? ClockOut { get; set; }
        public double OvertimeHours { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}