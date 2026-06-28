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

    // DbContext එක inject කරන්න (ApparelHubERPContext වෙනුවට)
    public AuthService(DbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginDto loginDto)
    {
        // Users DbSet එකට access කරන්න
        var user = await _context.Set<User>()
            .FirstOrDefaultAsync(u => u.Username == loginDto.Username);

        if (user == null)
            return null;

        if (!VerifyPassword(loginDto.Password, user.PasswordHash))
            return null;

        // ✅ Email verified ද කියලා check කරන්න
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

    // ✅ Register method එක update කරන්න (OTP එක generate කරලා send කරන්න)
    public async Task<bool> RegisterAsync(RegisterDto registerDto)
    {
        // Username එක දැනටමත් තියෙනවද check කරන්න
        var existingUser = await _context.Set<User>()
            .FirstOrDefaultAsync(u => u.Username == registerDto.Username);

        if (existingUser != null)
            return false; // Username already exists

        // Email එක දැනටමත් තියෙනවද check කරන්න
        var existingEmail = await _context.Set<User>()
            .FirstOrDefaultAsync(u => u.Email == registerDto.Email);

        if (existingEmail != null)
            return false; // Email already exists

        // Role එක valid ද check කරන්න
        var validRoles = new[] { "StoreManager", "HR", "ManagerBoard", "Supplier", "Customer" };
        if (!validRoles.Contains(registerDto.Role))
            return false;

        // ✅ OTP එක generate කරන්න
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

        // ✅ OTP එක Email එකට send කරන්න
        try
        {
            var emailService = new EmailService(_configuration);
            await emailService.SendOtpEmailAsync(user.Email, otp);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"OTP email sending failed: {ex.Message}");
            // Email එව්වත් නැතත් user එක save වෙනවා
        }

        return true;
    }

    // ✅ Verify OTP method එක
    public async Task<bool> VerifyOtpAsync(VerifyOtpDto verifyOtpDto)
    {
        // Email එක අනුව user එක සොයන්න
        var user = await _context.Set<User>()
            .FirstOrDefaultAsync(u => u.Email == verifyOtpDto.Email);

        if (user == null)
            return false;

        // User එක දැනටමත් verified ද කියලා check කරන්න
        if (user.IsEmailVerified)
            return false;

        // OTP එක හරිද check කරන්න
        if (user.OtpCode != verifyOtpDto.OtpCode)
            return false;

        // OTP එක expire වෙලාද check කරන්න
        if (user.OtpExpiry == null || user.OtpExpiry < DateTime.UtcNow)
            return false;

        // OTP එක හරි නම් verified කරන්න
        user.IsEmailVerified = true;
        user.OtpCode = null; // OTP එක clear කරන්න
        user.OtpExpiry = null;
        user.VerifiedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    // ✅ Forgot Password - OTP එක Email එකට send කරන්න
    public async Task<bool> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto)
    {
        // Email එක අනුව user එක සොයන්න
        var user = await _context.Set<User>()
            .FirstOrDefaultAsync(u => u.Email == forgotPasswordDto.Email);

        if (user == null)
            return false; // User not found

        // OTP එක generate කරන්න
        var otp = GenerateOtp();
        var otpExpiry = DateTime.UtcNow.AddMinutes(5);

        // Reset OTP fields update කරන්න
        user.ResetOtpCode = otp;
        user.ResetOtpExpiry = otpExpiry;

        await _context.SaveChangesAsync();

        // ✅ OTP එක Email එකට send කරන්න
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

    // ✅ Verify Reset OTP
    public async Task<bool> VerifyResetOtpAsync(VerifyResetOtpDto verifyResetOtpDto)
    {
        // Email එක අනුව user එක සොයන්න
        var user = await _context.Set<User>()
            .FirstOrDefaultAsync(u => u.Email == verifyResetOtpDto.Email);

        if (user == null)
            return false;

        // Reset OTP එක හරිද check කරන්න
        if (user.ResetOtpCode != verifyResetOtpDto.OtpCode)
            return false;

        // OTP එක expire වෙලාද check කරන්න
        if (user.ResetOtpExpiry == null || user.ResetOtpExpiry < DateTime.UtcNow)
            return false;

        return true;
    }

    // ✅ Reset Password - New Password set කරන්න
    public async Task<bool> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
    {
        // Email එක අනුව user එක සොයන්න
        var user = await _context.Set<User>()
            .FirstOrDefaultAsync(u => u.Email == resetPasswordDto.Email);

        if (user == null)
            return false;

        // Password එක update කරන්න
        user.PasswordHash = HashPassword(resetPasswordDto.NewPassword);

        // Reset OTP fields clear කරන්න
        user.ResetOtpCode = null;
        user.ResetOtpExpiry = null;

        await _context.SaveChangesAsync();
        return true;
    }

    // ✅ OTP Generate කරන method එක
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
            "StoreManager" => "/dashboard/store-manager",
            "HR" => "/dashboard/hr",
            "ManagerBoard" => "/dashboard/manager-board",
            "Supplier" => "/dashboard/supplier",
            "Customer" => "/dashboard/customer",
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