namespace ApparelHubERP.Core.Interfaces.Services;

public interface IEmailService
{
    Task<bool> SendOtpEmailAsync(string toEmail, string otpCode);
    Task<bool> SendResetPasswordOtpEmailAsync(string toEmail, string otpCode); 
    Task<bool> SendEmailAsync(string toEmail, string subject, string body);
}