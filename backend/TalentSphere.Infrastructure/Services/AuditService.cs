using TalentSphere.Application.Interfaces.Repositories;
using TalentSphere.Application.Interfaces.Services;
using TalentSphere.Domain.Entities;

namespace TalentSphere.Infrastructure.Services;

public class AuditService : IAuditService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public AuditService(IUnitOfWork unitOfWork, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task LogAsync(string action, string entityName, string? entityId, string? details, CancellationToken ct = default)
    {
        var log = new AuditLog
        {
            UserId = _currentUserService.UserId,
            UserEmail = _currentUserService.Email,
            Action = action,
            EntityName = entityName,
            EntityId = entityId,
            Details = details,
            IpAddress = _currentUserService.IpAddress,
        };

        await _unitOfWork.AuditLogs.AddAsync(log, ct);
        await _unitOfWork.SaveChangesAsync(ct);
    }
}
