using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TalentSphere.Application.Interfaces.Services;
using TalentSphere.Infrastructure.Options;

namespace TalentSphere.Infrastructure.Services;

/// <summary>
/// SMTP-backed email sender. When SMTP is not configured (Smtp:Enabled = false,
/// the default for local development), messages are written to the log instead
/// of being sent, so the rest of the recruitment workflow can be exercised
/// without a real mail server.
/// </summary>
public class EmailService : IEmailService
{
    private readonly SmtpOptions _options;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IOptions<SmtpOptions> options, ILogger<EmailService> logger)
    {
        _options = options.Value;
        _logger = logger;
    }

    public async Task SendAsync(string toEmail, string subject, string htmlBody, CancellationToken ct = default)
    {
        if (!_options.Enabled || string.IsNullOrWhiteSpace(_options.Host))
        {
            _logger.LogInformation("[Email:Mock] To={ToEmail} Subject={Subject}", toEmail, subject);
            return;
        }

        using var client = new SmtpClient(_options.Host, _options.Port)
        {
            EnableSsl = _options.EnableSsl,
            Credentials = string.IsNullOrWhiteSpace(_options.Username)
                ? CredentialCache.DefaultNetworkCredentials
                : new NetworkCredential(_options.Username, _options.Password),
        };

        using var message = new MailMessage
        {
            From = new MailAddress(_options.FromAddress, _options.FromName),
            Subject = subject,
            Body = htmlBody,
            IsBodyHtml = true,
        };
        message.To.Add(toEmail);

        await client.SendMailAsync(message, ct);
    }
}
