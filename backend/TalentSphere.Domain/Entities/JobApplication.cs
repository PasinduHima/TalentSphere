using TalentSphere.Domain.Common;
using TalentSphere.Domain.Enums;

namespace TalentSphere.Domain.Entities;

public class JobApplication : BaseEntity
{
    public Guid JobPostingId { get; set; }
    public virtual JobPosting? JobPosting { get; set; }

    public Guid CandidateProfileId { get; set; }
    public virtual CandidateProfile? CandidateProfile { get; set; }

    public Guid? ResumeId { get; set; }
    public virtual Resume? Resume { get; set; }

    public ApplicationStatus Status { get; set; } = ApplicationStatus.Applied;
    public string? CoverLetter { get; set; }
    public double MatchScore { get; set; }
    public string? NextStep { get; set; }

    public virtual ICollection<ApplicationStatusHistory> StatusHistory { get; set; } = new List<ApplicationStatusHistory>();
    public virtual ICollection<Interview> Interviews { get; set; } = new List<Interview>();
    public virtual HiringDecisionRecord? HiringDecisionRecord { get; set; }
}

public class ApplicationStatusHistory
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid JobApplicationId { get; set; }
    public virtual JobApplication? JobApplication { get; set; }

    public ApplicationStatus Status { get; set; }
    public string? Notes { get; set; }
    public Guid? ChangedByUserId { get; set; }
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
}
