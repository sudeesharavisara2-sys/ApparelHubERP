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

    // Injecting generic DbContext instead of hardcoded ApparelHubERPContext for better abstraction
    public AuthService(DbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
        _emailService = emailService;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginDto loginDto)
    {
        // Accessing the generic User DbSet
        var user = await _context.Set<User>()
            .FirstOrDefaultAsync(u => u.Username == loginDto.Username);

        if (user == null)
            return null;

        if (!VerifyPassword(loginDto.Password, user.PasswordHash))
            return null;

        // ✅ Check if the user's email is verified before allowing login
        if (!user.IsEmailVerified)
            return null;

        var token = GenerateJwtToken(user);

        return new LoginResponseDto
        {
            Token = token,
            Username = user.Username,
            Role = user.Role,
            DashboardUrl = GetDashboardUrl(user.Role)
        };
    }

    // ✅ Register new user, generate OTP, and trigger verification email
    public async Task<bool> RegisterAsync(RegisterDto registerDto)
    {
        // Check if username already exists
        var existingUser = await _context.Set<User>()
            .FirstOrDefaultAsync(u => u.Username == registerDto.Username);

        if (existingUser != null)
            return false;

        // Check if email already exists
        var existingEmail = await _context.Set<User>()
            .FirstOrDefaultAsync(u => u.Email == registerDto.Email);

        if (existingEmail != null)
            return false;

        // Validate if the assigned role is valid
        var validRoles = new[] { "StoreManager", "HR", "ManagerBoard", "Supplier", "Customer" };

        if (!validRoles.Contains(registerDto.Role))
            return false;

        // ✅ Generate OTP and set 5-minute expiration
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

        // ✅ Send Registration OTP via Email
        try
        {
            await _emailService.SendOtpEmailAsync(user.Email, otp);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"OTP email sending failed: {ex.Message}");
            // User remains saved even if email delivery fails transiently
        }

        return true;
    }

    // ✅ Verify the registration OTP code
    public async Task<bool> VerifyOtpAsync(VerifyOtpDto verifyOtpDto)
    {
        // Find user by email
        var user = await _context.Set<User>()
            .FirstOrDefaultAsync(u => u.Email == verifyOtpDto.Email);

        if (user == null)
            return false;

        // Return false if user is already verified
        if (user.IsEmailVerified)
            return false;

        // Validate OTP code match
        if (user.OtpCode != verifyOtpDto.OtpCode)
            return false;

        // Check if OTP has expired
        if (user.OtpExpiry == null || user.OtpExpiry < DateTime.UtcNow)
            return false;

        // ✅ Mark user as verified and clear OTP fields
        user.IsEmailVerified = true;
        user.OtpCode = null;
        user.OtpExpiry = null;
        user.VerifiedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    // ✅ Forgot Password - Generate and send password reset OTP
    public async Task<bool> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto)
    {
        // Find user by email
        var user = await _context.Set<User>()
            .FirstOrDefaultAsync(u => u.Email == forgotPasswordDto.Email);

        if (user == null)
            return false;

        // Generate OTP and set 5-minute expiration for password reset
        var otp = GenerateOtp();

        user.ResetOtpCode = otp;
        user.ResetOtpExpiry = DateTime.UtcNow.AddMinutes(5);

        await _context.SaveChangesAsync();

        // ✅ Send Password Reset OTP via Email
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

    // ✅ Verify the password reset OTP code
    public async Task<bool> VerifyResetOtpAsync(VerifyResetOtpDto verifyResetOtpDto)
    {
        // Find user by email
        var user = await _context.Set<User>()
            .FirstOrDefaultAsync(u => u.Email == verifyResetOtpDto.Email);

        if (user == null)
            return false;

        // Validate Reset OTP code match
        if (user.ResetOtpCode != verifyResetOtpDto.OtpCode)
            return false;

        // Check if Reset OTP has expired
        if (user.ResetOtpExpiry == null || user.ResetOtpExpiry < DateTime.UtcNow)
            return false;

        return true;
    }

    // ✅ Reset Password - Update user credentials with new password
    public async Task<bool> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
    {
        // Find user by email
        var user = await _context.Set<User>()
            .FirstOrDefaultAsync(u => u.Email == resetPasswordDto.Email);

        if (user == null)
            return false;

        // Update with the newly hashed password
        user.PasswordHash = HashPassword(resetPasswordDto.NewPassword);

        // Clear password reset fields
        user.ResetOtpCode = null;
        user.ResetOtpExpiry = null;

        await _context.SaveChangesAsync();
        return true;
    }

    // ✅ Helper method to generate a secure 6-digit numeric OTP string
    private string GenerateOtp()
    {
        return RandomNumberGenerator.GetInt32(100000, 999999).ToString();
    }

    // ✅ Generates a JWT token containing user identity details and roles
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

    // ✅ Resolves the targeted dashboard relative path depending on the User Role
    private string GetDashboardUrl(string role)
    {
        return role switch
        {
            "StoreManager" => "/dashboard/store-manager",
            "HR" => "/dashboard/hr",
            "ManagerBoard" => "/dashboard/manager-board",
            "Supplier" => "/dashboard/supplier",
            "Customer" => "/dashboard/customer",
            _ => "/dashboard"
        };
    }

    // ✅ Helper method to verify the plain-text password match against the hashed variant
    private bool VerifyPassword(string password, string hashedPassword)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        var hash = Convert.ToBase64String(hashedBytes);
        return hash == hashedPassword;
    }

    // ✅ Computes a secure SHA256 hash representation of the password string
    public static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }
}