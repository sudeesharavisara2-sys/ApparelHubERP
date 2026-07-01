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

    // ✅ Sends an verification OTP code during user registration
    public async Task<bool> SendOtpEmailAsync(string toEmail, string otpCode)
    {
        string subject = "ApparelHubERP - Email Verification OTP";
        string body = $@"
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }}
                    .container {{ max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
                    .otp-code {{ font-size: 32px; font-weight: bold; color: #2563eb; text-align: center; padding: 20px; background-color: #f0f7ff; border-radius: 8px; letter-spacing: 5px; }}
                    .footer {{ margin-top: 20px; font-size: 12px; color: #888; text-align: center; }}
                    .title {{ color: #1e293b; text-align: center; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <h2 class='title'>🔐 ApparelHubERP</h2>
                    <p>Hello,</p>
                    <p>Thank you for registering with ApparelHubERP. Please use the following OTP code to verify your email address:</p>
                    <div class='otp-code'>{otpCode}</div>
                    <p>This OTP is valid for <strong>5 minutes</strong>.</p>
                    <p>If you did not request this, please ignore this email.</p>
                    <div class='footer'>ApparelHubERP - Your Apparel Management Solution</div>
                </div>
            </body>
            </html>
        ";

        return await SendEmailAsync(toEmail, subject, body);
    }

    // ✅ Sends an OTP code specifically for the password reset workflow
    public async Task<bool> SendResetPasswordOtpEmailAsync(string toEmail, string otpCode)
    {
        string subject = "ApparelHubERP - Password Reset OTP";
        string body = $@"
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }}
                    .container {{ max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
                    .otp-code {{ font-size: 32px; font-weight: bold; color: #dc2626; text-align: center; padding: 20px; background-color: #fef2f2; border-radius: 8px; letter-spacing: 5px; }}
                    .footer {{ margin-top: 20px; font-size: 12px; color: #888; text-align: center; }}
                    .title {{ color: #1e293b; text-align: center; }}
                    .warning {{ color: #dc2626; font-weight: bold; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <h2 class='title'>🔐 ApparelHubERP</h2>
                    <p>Hello,</p>
                    <p>We received a request to reset your password. Please use the following OTP code to reset your password:</p>
                    <div class='otp-code'>{otpCode}</div>
                    <p>This OTP is valid for <strong>5 minutes</strong>.</p>
                    <p class='warning'>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                    <div class='footer'>ApparelHubERP - Your Apparel Management Solution</div>
                </div>
            </body>
            </html>
        ";

        return await SendEmailAsync(toEmail, subject, body);
    }

    // ✅ Core helper method to handle the SMTP client connection and delivery logic
    public async Task<bool> SendEmailAsync(string toEmail, string subject, string body)
    {
        try
        {
            var smtpServer = _configuration["EmailSettings:SmtpServer"];
            var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");
            var senderEmail = _configuration["EmailSettings:SenderEmail"];
            var senderPassword = _configuration["EmailSettings:SenderPassword"];
            var useStartTls = bool.Parse(_configuration["EmailSettings:UseStartTls"] ?? "true");

            using var client = new SmtpClient(smtpServer, smtpPort)
            {
                Credentials = new NetworkCredential(senderEmail, senderPassword),
                EnableSsl = useStartTls,
                UseDefaultCredentials = false
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(senderEmail ?? throw new InvalidOperationException("Sender email not configured")),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            mailMessage.To.Add(toEmail);

            // ✅ Add priority headers to ensure rapid notification delivery
            mailMessage.Headers.Add("X-Priority", "1");
            mailMessage.Headers.Add("X-MSMail-Priority", "High");
            mailMessage.Headers.Add("Importance", "High");

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