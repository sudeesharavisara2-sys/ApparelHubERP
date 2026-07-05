using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApparelHubERP.Core.Entities
{
    public class EmployeeStatusLog
    {
        [Key]
        public int LogId { get; set; }

        [Required]
        public int EmployeeId { get; set; }

        [ForeignKey(nameof(EmployeeId))]
        public Employee? Employee { get; set; }

        [Required]
        [MaxLength(20)]
        public string PreviousStatus { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string NewStatus { get; set; } = string.Empty;

        [MaxLength(250)]
        public string? Reason { get; set; }

        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(50)]
        public string? ChangedBy { get; set; }
    }
}