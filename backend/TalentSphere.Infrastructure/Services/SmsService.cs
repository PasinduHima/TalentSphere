using Microsoft.Extensions.Logging;
using TalentSphere.Application.Interfaces.Services;

namespace TalentSphere.Infrastructure.Services;

/// <summary>
/// Stub SMS provider. Swap for a real gateway (Twilio, Vonage, etc.) by
/// implementing ISmsService and registering it in DependencyInjection.cs -
/// no other code changes needed since callers depend on the abstraction.
/// </summary>
public class SmsService : ISmsService
{
    private readonly ILogger<SmsService> _logger;

    public SmsService(ILogger<SmsService> logger)
    {
        _logger = logger;
    }

    public Task SendAsync(string toPhoneNumber, string message, CancellationToken ct = default)
    {
        _logger.LogInformation("[Sms:Mock] To={PhoneNumber} Message={Message}", toPhoneNumber, message);
        return Task.CompletedTask;
    }
}
