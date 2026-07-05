using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApparelHubERP.Core.Entities
{
    public class Employee
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Position { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? NIC { get; set; }

        [MaxLength(20)]
        public string? Phone { get; set; }

        [MaxLength(250)]
        public string? Address { get; set; }

        [MaxLength(50)]
        public string? Department { get; set; }

        [Required]
        [MaxLength(30)]
        public string Role { get; set; } = "Staff"; // system role used for RBAC e.g. HROfficer, PayrollOfficer

        public DateTime? DateOfJoining { get; set; }

        public decimal BasicSalary { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Active"; // Active, Suspended, Resigned, OnLeave

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation
        public ICollection<EmployeeStatusLog> StatusLogs { get; set; } = new List<EmployeeStatusLog>();

        [MaxLength(20)]
        public string? EPFNo { get; set; }

        public int? Age { get; set; }

        public DateTime? Birthday { get; set; }



    }
}