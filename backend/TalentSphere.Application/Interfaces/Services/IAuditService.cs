namespace TalentSphere.Application.Interfaces.Services;

public interface IAuditService
{
    Task LogAsync(string action, string entityName, string? entityId, string? details, CancellationToken ct = default);
}
