using TalentSphere.Domain.Enums;

namespace TalentSphere.Application.Interfaces.Services;

public record NotificationRequest(
    Guid UserId,
    string RecipientEmail,
    string? RecipientPhoneNumber,
    NotificationType Type,
    NotificationChannel Channel,
    string Title,
    string Message);

/// <summary>
/// A single channel-specific sender. Concrete implementations (Email/Sms/InApp)
/// are produced by <see cref="INotificationSenderFactory"/> (Factory Pattern) so
/// callers never new() up a concrete sender directly.
/// </summary>
public interface INotificationSender
{
    NotificationChannel Channel { get; }
    Task DispatchAsync(NotificationRequest request, CancellationToken ct = default);
}

public interface INotificationSenderFactory
{
    INotificationSender Create(NotificationChannel channel);
}

/// <summary>
/// Orchestrates persistence of the in-app notification record plus dispatch
/// through the appropriate channel via the factory.
/// </summary>
public interface INotificationService
{
    Task NotifyAsync(NotificationRequest request, CancellationToken ct = default);
}
