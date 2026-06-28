using ApparelHubERP.Core.DTOs.Auth;

namespace ApparelHubERP.Core.Interfaces.Services;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginDto loginDto);
}