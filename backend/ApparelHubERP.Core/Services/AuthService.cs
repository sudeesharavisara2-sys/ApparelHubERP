using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ApparelHubERP.Core.DTOs.Auth;
using ApparelHubERP.Core.Entities;
using ApparelHubERP.Core.Interfaces.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace ApparelHubERP.Core.Services;

// ✅ IDE0290: Primary constructor optimized (no redundant private fields assigned)
public class AuthService(DbContext context, IConfiguration configuration, IEmailService emailService) : IAuthService
{
    public async Task<LoginResponseDto?> LoginAsync(LoginDto loginDto)
    {
        var user = await context.Set<User>()
            .FirstOrDefaultAsync(u => u.Username == loginDto.Username || u.Email == loginDto.Username);

        if (user == null)
            return null;

        if (!VerifyPassword(loginDto.Password, user.PasswordHash))
            return null;

        // ✅ Check if the user's email is verified before allowing login
        if (!user.IsEmailVerified)
            return null;

        var token = GenerateJwtToken(user);
        string dashboardUrl = GetDashboardUrl(user.Role);

        return new LoginResponseDto
        {
            Token = token,
            Username = user.Username,
            Role = user.Role,
            DashboardUrl = dashboardUrl
        };
    }

    public async Task<bool> RegisterAsync(RegisterDto registerDto)
    {
        var existingUser = await context.Set<User>()
            .FirstOrDefaultAsync(u => u.Username == registerDto.Username);

        if (existingUser != null)
            return false;

        var existingEmail = await context.Set<User>()
            .FirstOrDefaultAsync(u => u.Email == registerDto.Email);

        if (existingEmail != null)
            return false;

        var validRoles = new HashSet<string>
        {
            "StoreManager", "Admin", "HROfficer", "PayrollOfficer",
            "InventoryManager", "ProcurementOfficer", "SalesCashier", "ExecutiveBoard"
        };

        if (!validRoles.Contains(registerDto.Role))
            return false;

        var otp = GenerateSecureOtp();
        var otpExpiry = DateTime.UtcNow.AddMinutes(5);

        var user = new User
        {
            Username = registerDto.Username,
            PasswordHash = HashPassword(registerDto.Password),
            Role = registerDto.Role,
            Email = registerDto.Email,
            Phone = registerDto.Phone,
            FullName = registerDto.FullName,
            IsEmailVerified = false,
            OtpCode = otp,
            OtpExpiry = otpExpiry,
            CreatedAt = DateTime.UtcNow
        };

        context.Set<User>().Add(user);
        await context.SaveChangesAsync();

        try
        {
            // ✅ Decoupled: Using injected IEmailService interface
            await emailService.SendOtpEmailAsync(user.Email, otp);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"OTP email sending failed: {ex.Message}");
        }

        return true;
    }

    public async Task<bool> VerifyOtpAsync(VerifyOtpDto verifyOtpDto)
    {
        var user = await context.Set<User>()
            .FirstOrDefaultAsync(u => u.Email == verifyOtpDto.Email);

        if (user == null)
            return false;

        if (user.IsEmailVerified)
            return false;

        if (user.OtpCode != verifyOtpDto.OtpCode)
            return false;

        if (user.OtpExpiry == null || user.OtpExpiry < DateTime.UtcNow)
            return false;

        user.IsEmailVerified = true;
        user.OtpCode = null;
        user.OtpExpiry = null;
        user.VerifiedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto)
    {
        var user = await context.Set<User>()
            .FirstOrDefaultAsync(u => u.Email == forgotPasswordDto.Email);

        if (user == null)
            return false;

        var otp = GenerateSecureOtp();
        var otpExpiry = DateTime.UtcNow.AddMinutes(5);

        user.ResetOtpCode = otp;
        user.ResetOtpExpiry = otpExpiry;

        await context.SaveChangesAsync();

        try
        {
            await emailService.SendResetPasswordOtpEmailAsync(user.Email, otp);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Reset password OTP email sending failed: {ex.Message}");
            return false;
        }

        return true;
    }

    public async Task<bool> VerifyResetOtpAsync(VerifyResetOtpDto verifyResetOtpDto)
    {
        var user = await context.Set<User>()
            .FirstOrDefaultAsync(u => u.Email == verifyResetOtpDto.Email);

        if (user == null || user.ResetOtpCode != verifyResetOtpDto.OtpCode)
            return false;

        if (user.ResetOtpExpiry == null || user.ResetOtpExpiry < DateTime.UtcNow)
            return false;

        return true;
    }

    public async Task<bool> ResendOtpAsync(string email)
    {
        var user = await context.Set<User>().FirstOrDefaultAsync(u => u.Email == email);

        if (user == null || user.IsEmailVerified)
            return false;

        var newOtp = GenerateSecureOtp();
        user.OtpCode = newOtp;
        user.OtpExpiry = DateTime.UtcNow.AddMinutes(5);

        await context.SaveChangesAsync();

        try
        {
            await emailService.SendOtpEmailAsync(user.Email, newOtp);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Resend OTP email failed: {ex.Message}");
            return false;
        }

        return true;
    }

    // ✅ Reset Password - Update user credentials with token validation protection
    public async Task<bool> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
    {
        var user = await context.Set<User>()
            .FirstOrDefaultAsync(u => u.Email == resetPasswordDto.Email);

        // 🚨 Security Fix: Added direct token verification here to verify identity before allowing rewrite
        if (user == null || user.ResetOtpCode != resetPasswordDto.OtpCode || user.ResetOtpExpiry < DateTime.UtcNow)
            return false;

        user.PasswordHash = HashPassword(resetPasswordDto.NewPassword);
        user.ResetOtpCode = null;
        user.ResetOtpExpiry = null;

        await context.SaveChangesAsync();
        return true;
    }

    // ✅ CA1822: Marked as static & Cryptographically Secure
    private static string GenerateSecureOtp()
    {
        return RandomNumberGenerator.GetInt32(100000, 1000000).ToString();
    }

    private string GenerateJwtToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not found")));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(configuration["Jwt:ExpiryMinutes"] ?? "60")), // ✅ Use UtcNow for JWT standards
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    // ✅ CA1822: Marked as static
    private static string GetDashboardUrl(string role)
    {
        return role switch
        {
            "Admin" => "/dashboard/admin",
            "StoreManager" => "/dashboard/store-manager",
            "HROfficer" => "/dashboard/hr",
            "PayrollOfficer" => "/dashboard/payroll",
            "InventoryManager" => "/dashboard/inventory",
            "ProcurementOfficer" => "/dashboard/procurement",
            "SalesCashier" => "/dashboard/pos",
            "ExecutiveBoard" => "/dashboard/executive",
            _ => "/dashboard"
        };

    private static bool VerifyPassword(string password, string hashedPassword)
    {
        var hashedBytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
        var hash = Convert.ToBase64String(hashedBytes);
        return hash == hashedPassword;
    }

    public static string HashPassword(string password)
    {
        var hashedBytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }
}