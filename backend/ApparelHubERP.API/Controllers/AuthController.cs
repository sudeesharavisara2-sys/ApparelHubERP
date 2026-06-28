using Microsoft.AspNetCore.Mvc;
using ApparelHubERP.Core.DTOs.Auth;
using ApparelHubERP.Core.Interfaces.Services;

namespace ApparelHubERP.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        var result = await _authService.LoginAsync(loginDto);

        if (result == null)
            return Unauthorized(new { message = "Invalid username, password, or email not verified" });

        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        var result = await _authService.RegisterAsync(registerDto);

        if (!result)
            return BadRequest(new { message = "Username or Email already exists, or invalid role" });

        return Ok(new { message = "Registration successful! Please verify your email to login." });
    }

    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDto verifyOtpDto)
    {
        var result = await _authService.VerifyOtpAsync(verifyOtpDto);

        if (!result)
            return BadRequest(new { message = "Invalid OTP code or OTP expired" });

        return Ok(new { message = "Email verified successfully! You can now login." });
    }

    // ✅ Forgot Password - Send OTP to Email
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
    {
        var result = await _authService.ForgotPasswordAsync(forgotPasswordDto);

        if (!result)
            return BadRequest(new { message = "Email not found or OTP sending failed" });

        return Ok(new { message = "Password reset OTP sent to your email. Please check your inbox." });
    }

    // ✅ Verify Reset OTP
    [HttpPost("verify-reset-otp")]
    public async Task<IActionResult> VerifyResetOtp([FromBody] VerifyResetOtpDto verifyResetOtpDto)
    {
        var result = await _authService.VerifyResetOtpAsync(verifyResetOtpDto);

        if (!result)
            return BadRequest(new { message = "Invalid OTP code or OTP expired" });

        return Ok(new { message = "OTP verified successfully. You can now reset your password." });
    }

    // ✅ Reset Password - Set New Password
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
    {
        var result = await _authService.ResetPasswordAsync(resetPasswordDto);

        if (!result)
            return BadRequest(new { message = "Email not found or password reset failed" });

        return Ok(new { message = "Password reset successfully! You can now login with your new password." });
    }
}
