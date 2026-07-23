using Microsoft.Extensions.Logging;
using TalentSphere.Application.Interfaces.Services;

namespace TalentSphere.Infrastructure.Services;

/// <summary>
/// Mock calendar provider modelling the Outlook/Google Calendar integration
/// contract. A production implementation would exchange the recruiter's
/// stored OAuth token for a Microsoft Graph or Google Calendar API call.
/// </summary>
public class CalendarService : ICalendarService
{
    private readonly ILogger<CalendarService> _logger;

    public CalendarService(ILogger<CalendarService> logger)
    {
        _logger = logger;
    }

    public Task<string?> CreateEventAsync(CalendarEventRequest request, CancellationToken ct = default)
    {
        var externalId = Guid.NewGuid().ToString();
        _logger.LogInformation(
            "[Calendar:Mock] Created event {ExternalId} '{Title}' {Start:u}-{End:u} attendees={Attendees}",
            externalId, request.Title, request.StartUtc, request.EndUtc, string.Join(",", request.AttendeeEmails));
        return Task.FromResult<string?>(externalId);
    }

    public Task<bool> CancelEventAsync(string externalEventId, CancellationToken ct = default)
    {
        _logger.LogInformation("[Calendar:Mock] Cancelled event {ExternalId}", externalEventId);
        return Task.FromResult(true);
    }
}
