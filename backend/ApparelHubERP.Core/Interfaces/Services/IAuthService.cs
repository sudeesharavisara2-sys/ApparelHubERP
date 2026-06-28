using ApparelHubERP.Core.DTOs.Auth;

namespace ApparelHubERP.Core.Interfaces.Services;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginDto loginDto);
    Task<bool> RegisterAsync(RegisterDto registerDto);
    Task<bool> VerifyOtpAsync(VerifyOtpDto verifyOtpDto);

    // ✅ Forget Password Methods
    Task<bool> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto);
    Task<bool> VerifyResetOtpAsync(VerifyResetOtpDto verifyResetOtpDto);
    Task<bool> ResetPasswordAsync(ResetPasswordDto resetPasswordDto);
}