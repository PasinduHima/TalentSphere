namespace TalentSphere.Application.Interfaces.Services;

public interface IEmailService
{
    Task SendAsync(string toEmail, string subject, string htmlBody, CancellationToken ct = default);
}

public interface ISmsService
{
    Task SendAsync(string toPhoneNumber, string message, CancellationToken ct = default);
}

/// <summary>
/// Abstraction over the calendar provider (Microsoft Outlook / Google Calendar).
/// The default implementation is a mock that models the contract; a real
/// integration would implement this against the Graph or Google Calendar API
/// using OAuth credentials supplied per-user.
/// </summary>
public interface ICalendarService
{
    Task<string?> CreateEventAsync(CalendarEventRequest request, CancellationToken ct = default);
    Task<bool> CancelEventAsync(string externalEventId, CancellationToken ct = default);
}

public record CalendarEventRequest(
    string Title,
    string? Description,
    DateTime StartUtc,
    DateTime EndUtc,
    IEnumerable<string> AttendeeEmails,
    string? Location);

public interface IFileStorageService
{
    Task<string> SaveAsync(Stream content, string fileName, string containerName, CancellationToken ct = default);
    Task<Stream?> GetAsync(string storagePath, CancellationToken ct = default);
    Task DeleteAsync(string storagePath, CancellationToken ct = default);
}
