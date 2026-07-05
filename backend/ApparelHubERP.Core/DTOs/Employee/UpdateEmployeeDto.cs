using System.ComponentModel.DataAnnotations;

namespace ApparelHubERP.Core.DTOs.Employee
{
    public class UpdateEmployeeDto
    {
        [Required, MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required, EmailAddress, MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string Position { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? NIC { get; set; }

        [MaxLength(20)]
        public string? Phone { get; set; }

        [MaxLength(250)]
        public string? Address { get; set; }

        [MaxLength(50)]
        public string? Department { get; set; }

        [MaxLength(20)]
        public string? EPFNo { get; set; }

        public int? Age { get; set; }

        public DateTime? Birthday { get; set; }

        public DateTime? DateOfJoining { get; set; }

        public decimal BasicSalary { get; set; }
    }
}