namespace ApparelHubERP.Core.Entities
{
    public class AttendanceRecord
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; } = null!;
        public DateTime Date { get; set; }
        public TimeSpan ClockIn { get; set; }
        public TimeSpan? ClockOut { get; set; }
        public double OvertimeHours { get; set; } = 0;
        public string Status { get; set; } = "Present"; // Present, Absent, Late
    }
}