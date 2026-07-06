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

public class AuthService : IAuthService
{
    private readonly DbContext _context;
    private readonly IConfiguration _configuration;
    private readonly IEmailService _emailService; // ✅ Injected for loose coupling

    public AuthService(DbContext context, IConfiguration configuration, IEmailService emailService)
    {
        _context = context;
        _configuration = configuration;
        _emailService = emailService;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginDto loginDto)
    {
        var user = await _context.Set<User>()
            .FirstOrDefaultAsync(u => u.Username == loginDto.Username || u.Email == loginDto.Username);

        if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash) || !user.IsEmailVerified)
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
        var isDuplicate = await _context.Set<User>()
            .AnyAsync(u => u.Username == registerDto.Username || u.Email == registerDto.Email);

        if (isDuplicate)
            return false;

        var validRoles = new HashSet<string> // ✅ O(1) Lookups instead of array iteration
        {
            "StoreManager", "Admin", "HROfficer", "PayrollOfficer", 
            "InventoryManager", "ProcurementOfficer", "SalesCashier", "ExecutiveBoard"
        };

        if (!validRoles.Contains(registerDto.Role))
            return false;

        var otp = GenerateSecureOtp();
        var user = new User
        {
            Username = registerDto.Username,
            PasswordHash = HashPassword(registerDto.Password), // ⚠️ Consider upgrading to BCrypt/PBKDF2
            Role = registerDto.Role,
            Email = registerDto.Email,
            Phone = registerDto.Phone,
            FullName = registerDto.FullName,
            IsEmailVerified = false,
            OtpCode = otp,
            OtpExpiry = DateTime.UtcNow.AddMinutes(5),
            CreatedAt = DateTime.UtcNow
        };

        _context.Set<User>().Add(user);
        await _context.SaveChangesAsync();

        try
        {
            await _emailService.SendOtpEmailAsync(user.Email, otp);
        }
        catch (Exception ex)
        {
            // Log exception using an actual ILogger instance here
            Console.WriteLine($"OTP email sending failed: {ex.Message}");
        }

        return true;
    }

    public async Task<bool> VerifyOtpAsync(VerifyOtpDto verifyOtpDto)
    {
        var user = await _context.Set<User>().FirstOrDefaultAsync(u => u.Email == verifyOtpDto.Email);

        if (user == null || user.IsEmailVerified || user.OtpCode != verifyOtpDto.OtpCode || user.OtpExpiry < DateTime.UtcNow)
            return false;

        user.IsEmailVerified = true;
        user.OtpCode = null;
        user.OtpExpiry = null;
        user.VerifiedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto)
    {
        var user = await _context.Set<User>().FirstOrDefaultAsync(u => u.Email == forgotPasswordDto.Email);
        if (user == null)
            return false; // Consider returning true to prevent user enumeration attacks

        var otp = GenerateSecureOtp();
        user.ResetOtpCode = otp;
        user.ResetOtpExpiry = DateTime.UtcNow.AddMinutes(5);

        await _context.SaveChangesAsync();

        try
        {
            await _emailService.SendResetPasswordOtpEmailAsync(user.Email, otp);
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
        var user = await _context.Set<User>().FirstOrDefaultAsync(u => u.Email == verifyResetOtpDto.Email);

        if (user == null || user.ResetOtpCode != verifyResetOtpDto.OtpCode || user.ResetOtpExpiry < DateTime.UtcNow)
            return false;

        return true;
    }

    public async Task<bool> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
    {
        var user = await _context.Set<User>().FirstOrDefaultAsync(u => u.Email == resetPasswordDto.Email);
        
        // 🚨 CRITICAL FIX: Ensure token matches and hasn't expired before resetting password!
        if (user == null || user.ResetOtpCode != resetPasswordDto.OtpCode || user.ResetOtpExpiry < DateTime.UtcNow)
            return false;

        user.PasswordHash = HashPassword(resetPasswordDto.NewPassword);
        user.ResetOtpCode = null;
        user.ResetOtpExpiry = null;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ResendOtpAsync(string email)
    {
        var user = await _context.Set<User>().FirstOrDefaultAsync(u => u.Email == email);
        if (user == null || user.IsEmailVerified)
            return false;

        var newOtp = GenerateSecureOtp();
        user.OtpCode = newOtp;
        user.OtpExpiry = DateTime.UtcNow.AddMinutes(5);

        await _context.SaveChangesAsync();

        try
        {
            await _emailService.SendOtpEmailAsync(user.Email, newOtp);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Resend OTP email failed: {ex.Message}");
            return false;
        }

        return true;
    }

    // ✅ CA1822 & Cryptographically Secure
    private static string GenerateSecureOtp()
    {
        return RandomNumberGenerator.GetInt32(100000, 1000000).ToString();
    }

    private string GenerateJwtToken(User user)
    {
        var jwtKey = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not found");
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["Jwt:ExpiryMinutes"] ?? "60")), // ✅ Changed to UtcNow
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

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
    }

    private static bool VerifyPassword(string password, string hashedPassword)
    {
        return HashPassword(password) == hashedPassword;
    }

    public static string HashPassword(string password)
    {
        var hashedBytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }
}