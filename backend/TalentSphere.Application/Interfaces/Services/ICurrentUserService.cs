namespace TalentSphere.Application.Interfaces.Services;

public interface ICurrentUserService
{
    Guid? UserId { get; }
    string? Email { get; }
    string? Role { get; }
    bool IsInRole(string role);
    string? IpAddress { get; }
}
