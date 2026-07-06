using System.Net;
using System.Net.Mail;
using ApparelHubERP.Core.Interfaces.Services;
using Microsoft.Extensions.Configuration;

namespace ApparelHubERP.Core.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<bool> SendOtpEmailAsync(string toEmail, string otpCode)
    {
        string subject = "ApparelHubERP - Email Verification OTP";

        string body = $@"
        <html>
        <body style='font-family:Arial;background:#f4f4f4;padding:20px;'>
            <div style='max-width:500px;margin:auto;background:white;padding:30px;border-radius:8px;'>
                <h2 style='text-align:center;color:#1e293b;'>ApparelHubERP</h2>
                <p>Hello,</p>
                <p>Please use the following OTP code to verify your email address:</p>
                <div style='font-size:32px;font-weight:bold;color:#2563eb;text-align:center;padding:20px;background:#f0f7ff;border-radius:8px;letter-spacing:5px;'>
                    {otpCode}
                </div>
                <p>This OTP is valid for <strong>5 minutes</strong>.</p>
                <p>If you did not request this, please ignore this email.</p>
            </div>
        </body>
        </html>";

        return await SendEmailAsync(toEmail, subject, body);
    }

    public async Task<bool> SendResetPasswordOtpEmailAsync(string toEmail, string otpCode)
    {
        string subject = "ApparelHubERP - Password Reset OTP";

        string body = $@"
        <html>
        <body style='font-family:Arial;background:#f4f4f4;padding:20px;'>
            <div style='max-width:500px;margin:auto;background:white;padding:30px;border-radius:8px;'>
                <h2 style='text-align:center;color:#1e293b;'>ApparelHubERP</h2>
                <p>Hello,</p>
                <p>Please use the following OTP code to reset your password:</p>
                <div style='font-size:32px;font-weight:bold;color:#dc2626;text-align:center;padding:20px;background:#fef2f2;border-radius:8px;letter-spacing:5px;'>
                    {otpCode}
                </div>
                <p>This OTP is valid for <strong>5 minutes</strong>.</p>
                <p>If you did not request this, please ignore this email.</p>
            </div>
        </body>
        </html>";

        return await SendEmailAsync(toEmail, subject, body);
    }

    public async Task<bool> SendEmailAsync(string toEmail, string subject, string body)
    {
        try
        {
            var smtpServer = _configuration["EmailSettings:SmtpServer"];
            var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");
            var senderEmail = _configuration["EmailSettings:SenderEmail"];
            var senderPassword = _configuration["EmailSettings:SenderPassword"];
            var useStartTls = bool.Parse(_configuration["EmailSettings:UseStartTls"] ?? "true");

            if (string.IsNullOrWhiteSpace(smtpServer))
                throw new InvalidOperationException("SMTP server not configured.");

            if (string.IsNullOrWhiteSpace(senderEmail))
                throw new InvalidOperationException("Sender email not configured.");

            if (string.IsNullOrWhiteSpace(senderPassword))
                throw new InvalidOperationException("Sender password not configured.");

            using var client = new SmtpClient(smtpServer, smtpPort)
            {
                Credentials = new NetworkCredential(senderEmail, senderPassword),
                EnableSsl = useStartTls,
                UseDefaultCredentials = false
            };

            using var mailMessage = new MailMessage
            {
                From = new MailAddress(senderEmail),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            mailMessage.To.Add(toEmail);

            await client.SendMailAsync(mailMessage);
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Email sending failed: {ex.Message}");
            return false;
        }
    }
}