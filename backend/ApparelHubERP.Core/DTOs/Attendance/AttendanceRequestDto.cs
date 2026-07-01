namespace ApparelHubERP.Core.DTOs.Attendance
{
    public class AttendanceRequestDto
    {
        public int EmployeeId { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan ClockIn { get; set; }
        public TimeSpan? ClockOut { get; set; }
    }
}