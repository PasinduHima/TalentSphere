using Microsoft.AspNetCore.Identity;
using TalentSphere.Domain.Enums;

namespace TalentSphere.Domain.Entities;

public class ApplicationUser : IdentityUser<Guid>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public UserStatus Status { get; set; } = UserStatus.Active;
    public string? AvatarUrl { get; set; }
    public Guid? DepartmentId { get; set; }
    public virtual Department? Department { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }
    public bool IsActive { get; set; } = true;

    public string FullName => $"{FirstName} {LastName}".Trim();

    public virtual CandidateProfile? CandidateProfile { get; set; }
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}
