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

    // Injecting generic DbContext instead of hardcoded ApparelHubERPContext for better abstraction
    public AuthService(DbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginDto loginDto)
    {
        // Accessing the generic User DbSet
        var user = await _context.Set<User>()
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

        // ✅ Validating the 8 new enterprise ERP roles
        var validRoles = new[]
        {
            "StoreManager",
            "Admin",
            "HROfficer",
            "PayrollOfficer",
            "InventoryManager",
            "ProcurementOfficer",
            "SalesCashier",
            "ExecutiveBoard"
        };

        if (!validRoles.Contains(registerDto.Role))
            return false;

        // ✅ Generate OTP and set 5-minute expiration
        var otp = GenerateOtp();
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

        _context.Set<User>().Add(user);
        await _context.SaveChangesAsync();

        // ✅ Send Registration OTP via Email
        try
        {
            var emailService = new EmailService(_configuration);
            await emailService.SendOtpEmailAsync(user.Email, otp);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"OTP email sending failed: {ex.Message}");
        }

        return true;
    }

    // ✅ Verify the registration OTP code
    public async Task<bool> VerifyOtpAsync(VerifyOtpDto verifyOtpDto)
    {
        var user = await _context.Set<User>()
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

        await _context.SaveChangesAsync();
        return true;
    }

    // ✅ Forgot Password - Generate and send password reset OTP
    public async Task<bool> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto)
    {
        var user = await _context.Set<User>()
            .FirstOrDefaultAsync(u => u.Email == forgotPasswordDto.Email);

        if (user == null)
            return false;

        var otp = GenerateOtp();
        var otpExpiry = DateTime.UtcNow.AddMinutes(5);

        user.ResetOtpCode = otp;
        user.ResetOtpExpiry = otpExpiry;

        await _context.SaveChangesAsync();

        try
        {
            var emailService = new EmailService(_configuration);
            await emailService.SendResetPasswordOtpEmailAsync(user.Email, otp);
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

    public async Task<bool> ResendOtpAsync(string email)
    {
        var user = await _context.Set<User>().FirstOrDefaultAsync(u => u.Email == email);

        if (user == null || user.IsEmailVerified)
            return false;

        // Generate a new OTP
        var newOtp = GenerateOtp();
        user.OtpCode = newOtp;
        user.OtpExpiry = DateTime.UtcNow.AddMinutes(5);

        await _context.SaveChangesAsync();

        // Send the new OTP via email
        try
        {
            var emailService = new EmailService(_configuration);
            await emailService.SendOtpEmailAsync(user.Email, newOtp);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Resend OTP email failed: {ex.Message}");
            return false;
        }

        return true;
    }

    // ✅ Reset Password - Update user credentials with new password
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

    private string GenerateOtp()
    {
        var random = new Random();
        return random.Next(100000, 999999).ToString();
    }

    private string GenerateJwtToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not found")));
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
            expires: DateTime.Now.AddMinutes(
                Convert.ToDouble(_configuration["Jwt:ExpiryMinutes"])),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string GetDashboardUrl(string role)
    {
        return role switch
        {
            "Admin" => "/dashboard/admin",
            "StoreManager" => "/dashboard/store-manager",
            "HROfficer" => "/dashboard/hr",
            "PayrollOfficer" => "/dashboard/payroll",
            "InventoryManager" => "/inventory",
            "ProcurementOfficer" => "/dashboard/procurement",
            "SalesCashier" => "/dashboard/pos",
            "ExecutiveBoard" => "/dashboard/executive",
            _ => "/dashboard"
        }; 
    }

    private bool VerifyPassword(string password, string hashedPassword)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        var hash = Convert.ToBase64String(hashedBytes);
        return hash == hashedPassword;
    }

    public static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }
}