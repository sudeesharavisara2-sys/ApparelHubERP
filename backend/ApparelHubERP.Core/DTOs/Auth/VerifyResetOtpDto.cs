using System.ComponentModel.DataAnnotations;

namespace ApparelHubERP.Core.DTOs.Auth;

public class VerifyResetOtpDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    [MaxLength(6)]
    public string OtpCode { get; set; } = string.Empty;
}