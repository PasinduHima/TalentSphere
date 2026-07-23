using TalentSphere.Application.Interfaces.Repositories;
using TalentSphere.Application.Interfaces.Services;
using TalentSphere.Domain.Entities;

namespace TalentSphere.Infrastructure.Notifications;

public class NotificationService : INotificationService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly INotificationSenderFactory _senderFactory;

    public NotificationService(IUnitOfWork unitOfWork, INotificationSenderFactory senderFactory)
    {
        _unitOfWork = unitOfWork;
        _senderFactory = senderFactory;
    }

    public async Task NotifyAsync(NotificationRequest request, CancellationToken ct = default)
    {
        var notification = new Notification
        {
            UserId = request.UserId,
            Type = request.Type,
            Channel = request.Channel,
            Title = request.Title,
            Message = request.Message,
        };
        await _unitOfWork.Notifications.AddAsync(notification, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var sender = _senderFactory.Create(request.Channel);
        await sender.DispatchAsync(request, ct);
    }
}
