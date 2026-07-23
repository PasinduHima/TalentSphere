using TalentSphere.Domain.Common;

namespace TalentSphere.Domain.Entities;

public class Organization : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Industry { get; set; }
    public string? Website { get; set; }
    public string? Description { get; set; }

    public virtual ICollection<Department> Departments { get; set; } = new List<Department>();
}
