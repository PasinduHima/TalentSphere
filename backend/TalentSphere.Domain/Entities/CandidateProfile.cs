using TalentSphere.Domain.Common;

namespace TalentSphere.Domain.Entities;

public class CandidateProfile : BaseEntity
{
    public Guid UserId { get; set; }
    public virtual ApplicationUser? User { get; set; }

    public string? Headline { get; set; }
    public string? Summary { get; set; }
    public string? Location { get; set; }
    public string? PhoneNumber { get; set; }
    public int ExperienceYears { get; set; }
    public string? EducationSummary { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? PortfolioUrl { get; set; }
    public int ProfileCompletionPercent { get; set; }

    public virtual ICollection<CandidateSkill> CandidateSkills { get; set; } = new List<CandidateSkill>();
    public virtual ICollection<Resume> Resumes { get; set; } = new List<Resume>();
    public virtual ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
}
