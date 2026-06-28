using System.ComponentModel.DataAnnotations;

namespace ApparelHubERP.Core.DTOs.Auth;

public class ForgotPasswordDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}