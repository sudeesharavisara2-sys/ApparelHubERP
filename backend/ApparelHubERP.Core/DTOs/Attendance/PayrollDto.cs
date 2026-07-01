namespace ApparelHubERP.Core.DTOs.Attendance
{
    public class PayrollDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public int Month { get; set; }
        public int Year { get; set; }
        public int DaysWorked { get; set; }
        public double OvertimeHours { get; set; }
        public decimal GrossSalary { get; set; }
        public decimal EPFDeduction { get; set; }
        public decimal ETFDeduction { get; set; }
        public decimal NetSalary { get; set; }
    }
}