using TalentSphere.Domain.Common;
using TalentSphere.Domain.Enums;

namespace TalentSphere.Domain.Entities;

public class Skill : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Category { get; set; }

    public virtual ICollection<CandidateSkill> CandidateSkills { get; set; } = new List<CandidateSkill>();
    public virtual ICollection<JobSkill> JobSkills { get; set; } = new List<JobSkill>();
}

public class CandidateSkill
{
    public Guid CandidateProfileId { get; set; }
    public virtual CandidateProfile? CandidateProfile { get; set; }

    public Guid SkillId { get; set; }
    public virtual Skill? Skill { get; set; }

    public ProficiencyLevel ProficiencyLevel { get; set; } = ProficiencyLevel.Intermediate;
    public int YearsOfExperience { get; set; }
}

public class JobSkill
{
    public Guid JobPostingId { get; set; }
    public virtual JobPosting? JobPosting { get; set; }

    public Guid SkillId { get; set; }
    public virtual Skill? Skill { get; set; }

    public bool IsRequired { get; set; } = true;
    public double Weight { get; set; } = 1.0;
}
