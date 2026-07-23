using TalentSphere.Domain.Common;

namespace TalentSphere.Domain.Entities;

public class Department : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public Guid OrganizationId { get; set; }
    public virtual Organization? Organization { get; set; }

    public virtual ICollection<ApplicationUser> Users { get; set; } = new List<ApplicationUser>();
    public virtual ICollection<JobPosting> JobPostings { get; set; } = new List<JobPosting>();
}
