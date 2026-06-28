using System.ComponentModel.DataAnnotations;

namespace ApparelHubERP.Core.Entities;

public class User
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = string.Empty; // "StoreManager", "HR", "ManagerBoard", "Supplier", "Customer"

    [Required]
    public string Email { get; set; } = string.Empty;

    public string? Phone { get; set; }
    public string? FullName { get; set; }

    public bool IsEmailVerified { get; set; } = false;
    public string? OtpCode { get; set; }
    public DateTime? OtpExpiry { get; set; }

    // ✅ Reset Password Fields
    public string? ResetOtpCode { get; set; }
    public DateTime? ResetOtpExpiry { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? VerifiedAt { get; set; }
}