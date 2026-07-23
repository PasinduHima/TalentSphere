using TalentSphere.Domain.Common;

namespace TalentSphere.Domain.Entities;

public class Resume : BaseEntity
{
    public Guid CandidateProfileId { get; set; }
    public virtual CandidateProfile? CandidateProfile { get; set; }

    public string FileName { get; set; } = string.Empty;
    public string StoragePath { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public bool IsPrimary { get; set; }

    public string? ParsedText { get; set; }
    public string? ExtractedSkillsJson { get; set; }
    public DateTime? ParsedAt { get; set; }
}
