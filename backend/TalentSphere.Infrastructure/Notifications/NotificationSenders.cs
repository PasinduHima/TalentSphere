using TalentSphere.Application.Interfaces.Services;
using TalentSphere.Domain.Enums;

namespace TalentSphere.Infrastructure.Notifications;

public class EmailNotificationSender : INotificationSender
{
    private readonly IEmailService _emailService;
    public EmailNotificationSender(IEmailService emailService) => _emailService = emailService;

    public NotificationChannel Channel => NotificationChannel.Email;

    public Task DispatchAsync(NotificationRequest request, CancellationToken ct = default) =>
        string.IsNullOrWhiteSpace(request.RecipientEmail)
            ? Task.CompletedTask
            : _emailService.SendAsync(request.RecipientEmail, request.Title, $"<p>{request.Message}</p>", ct);
}

public class SmsNotificationSender : INotificationSender
{
    private readonly ISmsService _smsService;
    public SmsNotificationSender(ISmsService smsService) => _smsService = smsService;

    public NotificationChannel Channel => NotificationChannel.Sms;

    public Task DispatchAsync(NotificationRequest request, CancellationToken ct = default) =>
        string.IsNullOrWhiteSpace(request.RecipientPhoneNumber)
            ? Task.CompletedTask
            : _smsService.SendAsync(request.RecipientPhoneNumber, request.Message, ct);
}

/// <summary>
/// In-app notifications are persisted by NotificationService itself, so the
/// sender for this channel is a no-op dispatch (nothing further to push).
/// </summary>
public class InAppNotificationSender : INotificationSender
{
    public NotificationChannel Channel => NotificationChannel.InApp;
    public Task DispatchAsync(NotificationRequest request, CancellationToken ct = default) => Task.CompletedTask;
}

/// <summary>
/// Factory Pattern: resolves the correct <see cref="INotificationSender"/> for
/// a given channel without callers needing to know the concrete types.
/// </summary>
public class NotificationSenderFactory : INotificationSenderFactory
{
    private readonly IReadOnlyDictionary<NotificationChannel, INotificationSender> _senders;

    public NotificationSenderFactory(IEnumerable<INotificationSender> senders)
    {
        _senders = senders.ToDictionary(s => s.Channel);
    }

    public INotificationSender Create(NotificationChannel channel) =>
        _senders.TryGetValue(channel, out var sender)
            ? sender
            : throw new InvalidOperationException($"No notification sender registered for channel '{channel}'.");
}
