using System.ComponentModel.DataAnnotations;

namespace ApparelHubERP.Core.DTOs.Employee
{
    public class UpdateEmployeeRoleDto
    {
        [Required, MaxLength(30)]
        public string NewRole { get; set; } = string.Empty;
    }
}