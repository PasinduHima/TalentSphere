using TalentSphere.Domain.Common;
using TalentSphere.Domain.Enums;

namespace TalentSphere.Domain.Entities;

public class HiringDecisionRecord : BaseEntity
{
    public Guid JobApplicationId { get; set; }
    public virtual JobApplication? JobApplication { get; set; }

    public Guid DecidedByUserId { get; set; }
    public virtual ApplicationUser? DecidedBy { get; set; }

    public HiringDecisionType Decision { get; set; }
    public string? Notes { get; set; }
    public DateTime DecidedAt { get; set; } = DateTime.UtcNow;
}
