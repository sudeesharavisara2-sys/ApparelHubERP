using System.ComponentModel.DataAnnotations;

namespace ApparelHubERP.Core.DTOs.Auth
{
    public class ResendOtpDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}