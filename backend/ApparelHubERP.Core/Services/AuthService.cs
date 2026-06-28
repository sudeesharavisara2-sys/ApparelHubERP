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
        // Users DbSet එකට access කරන්න Reflection හෝ dynamic way එකකින්
        var user = await _context.Set<User>()
            .FirstOrDefaultAsync(u => u.Username == loginDto.Username);

        if (user == null)
            return null;

        if (!VerifyPassword(loginDto.Password, user.PasswordHash))
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
            "Admin" => "/dashboard/admin",
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