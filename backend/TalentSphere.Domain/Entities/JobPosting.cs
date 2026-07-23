using TalentSphere.Domain.Common;
using TalentSphere.Domain.Enums;

namespace TalentSphere.Domain.Entities;

public class JobPosting : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Requirements { get; set; }
    public string Location { get; set; } = string.Empty;
    public EmploymentType EmploymentType { get; set; } = EmploymentType.FullTime;
    public decimal? SalaryMin { get; set; }
    public decimal? SalaryMax { get; set; }
    public JobStatus Status { get; set; } = JobStatus.Draft;
    public DateTime? ClosingDate { get; set; }

    public Guid DepartmentId { get; set; }
    public virtual Department? Department { get; set; }

    public Guid RecruiterId { get; set; }
    public virtual ApplicationUser? Recruiter { get; set; }

    public virtual ICollection<JobSkill> JobSkills { get; set; } = new List<JobSkill>();
    public virtual ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
}
