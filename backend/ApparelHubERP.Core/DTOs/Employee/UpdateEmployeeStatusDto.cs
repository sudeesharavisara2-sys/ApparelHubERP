using System.ComponentModel.DataAnnotations;

namespace ApparelHubERP.Core.DTOs.Employee
{
    public class UpdateEmployeeStatusDto
    {
        [Required, MaxLength(20)]
        public string NewStatus { get; set; } = string.Empty;

        [MaxLength(250)]
        public string? Reason { get; set; }
    }
}