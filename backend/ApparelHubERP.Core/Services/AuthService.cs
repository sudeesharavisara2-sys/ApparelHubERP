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
    private readonly IEmailService _emailService;

    public AuthService(DbContext context, IConfiguration configuration, IEmailService emailService)
    {
        _context = context;
        _configuration = configuration;
        _emailService = emailService;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginDto loginDto)
    {
        var user = await _context.Set<User>()
            .FirstOrDefaultAsync(u => u.Username == loginDto.Username);

        if (user == null)
            return null;

        if (!VerifyPassword(loginDto.Password, user.PasswordHash))
            return null;

        if (!user.IsEmailVerified)
            return null;

        return new LoginResponseDto
        {
            Token = GenerateJwtToken(user),
            Username = user.Username,
            Role = user.Role,
            DashboardUrl = GetDashboardUrl(user.Role)
        };
    }

    public async Task<bool> RegisterAsync(RegisterDto registerDto)
    {
        var existingUser = await _context.Set<User>()
            .FirstOrDefaultAsync(u =>
                u.Username == registerDto.Username ||
                u.Email == registerDto.Email);

        if (existingUser != null)
            return false;

        var validRoles = new[]
        {
            "StoreManager",
            "HR",
            "ManagerBoard",
            "Supplier",
            "Customer",
            "Admin"
        };

        if (!validRoles.Contains(registerDto.Role))
            return false;

        var otp = GenerateOtp();

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
            OtpExpiry = DateTime.UtcNow.AddMinutes(5),
            CreatedAt = DateTime.UtcNow
        };

        _context.Set<User>().Add(user);
        await _context.SaveChangesAsync();

        await _emailService.SendOtpEmailAsync(user.Email, otp);

        return true;
    }

    public async Task<bool> VerifyOtpAsync(VerifyOtpDto verifyOtpDto)
    {
        var user = await _context.Set<User>()
            .FirstOrDefaultAsync(u => u.Email == verifyOtpDto.Email);

        if (user == null || user.IsEmailVerified)
            return false;

        if (user.OtpCode != verifyOtpDto.OtpCode)
            return false;

        if (user.OtpExpiry == null || user.OtpExpiry < DateTime.UtcNow)
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
        var user = await _context.Set<User>()
            .FirstOrDefaultAsync(u => u.Email == forgotPasswordDto.Email);

        if (user == null)
            return false;

        var otp = GenerateOtp();

        user.ResetOtpCode = otp;
        user.ResetOtpExpiry = DateTime.UtcNow.AddMinutes(5);

        await _context.SaveChangesAsync();

        return await _emailService.SendResetPasswordOtpEmailAsync(user.Email, otp);
    }

    public async Task<bool> VerifyResetOtpAsync(VerifyResetOtpDto verifyResetOtpDto)
    {
        var user = await _context.Set<User>()
            .FirstOrDefaultAsync(u => u.Email == verifyResetOtpDto.Email);

        if (user == null)
            return false;

        if (user.ResetOtpCode != verifyResetOtpDto.OtpCode)
            return false;

        if (user.ResetOtpExpiry == null || user.ResetOtpExpiry < DateTime.UtcNow)
            return false;

        return true;
    }

    public async Task<bool> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
    {
        var user = await _context.Set<User>()
            .FirstOrDefaultAsync(u => u.Email == resetPasswordDto.Email);

        if (user == null)
            return false;

        user.PasswordHash = HashPassword(resetPasswordDto.NewPassword);
        user.ResetOtpCode = null;
        user.ResetOtpExpiry = null;

        await _context.SaveChangesAsync();
        return true;
    }

    private static string GenerateOtp()
    {
        return RandomNumberGenerator.GetInt32(100000, 999999).ToString();
    }

    private string GenerateJwtToken(User user)
    {
        var jwtKey = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("JWT Key not found");

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var expiryMinutes = Convert.ToDouble(_configuration["Jwt:ExpiryMinutes"] ?? "60");

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
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GetDashboardUrl(string role)
    {
        return role switch
        {
            "StoreManager" => "/dashboard/store-manager",
            "HR" => "/dashboard/hr",
            "ManagerBoard" => "/dashboard/manager-board",
            "Supplier" => "/dashboard/supplier",
            "Customer" => "/dashboard/customer",
            "Admin" => "/dashboard/admin",
            _ => "/dashboard"
        };
    }

    private static bool VerifyPassword(string password, string hashedPassword)
    {
        return HashPassword(password) == hashedPassword;
    }

    public static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }
}