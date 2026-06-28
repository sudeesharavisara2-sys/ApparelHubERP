using System.ComponentModel.DataAnnotations;

namespace ApparelHubERP.Core.DTOs.Auth;

public class RegisterDto
{
    [Required]
    [MinLength(3)]
    [MaxLength(100)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = string.Empty; // "StoreManager", "HR", "ManagerBoard", "Supplier", "Customer"

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string? Phone { get; set; }
    public string? FullName { get; set; }
}