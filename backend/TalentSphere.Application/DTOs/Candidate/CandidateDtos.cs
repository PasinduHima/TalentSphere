using System.ComponentModel.DataAnnotations;

namespace TalentSphere.Application.DTOs.Candidate;

public record CandidateSkillDto(Guid SkillId, string Name, string ProficiencyLevel, int YearsOfExperience);

public record CandidateProfileDto(
    Guid Id,
    Guid UserId,
    string FullName,
    string Email,
    string? Headline,
    string? Summary,
    string? Location,
    string? PhoneNumber,
    int ExperienceYears,
    string? EducationSummary,
    string? LinkedInUrl,
    string? PortfolioUrl,
    int ProfileCompletionPercent,
    IReadOnlyList<CandidateSkillDto> Skills,
    IReadOnlyList<ResumeDto> Resumes);

public class UpdateCandidateProfileRequest
{
    [MaxLength(150)]
    public string? Headline { get; set; }

    [MaxLength(2000)]
    public string? Summary { get; set; }

    [MaxLength(150)]
    public string? Location { get; set; }

    [Phone]
    public string? PhoneNumber { get; set; }

    [Range(0, 60)]
    public int ExperienceYears { get; set; }

    [MaxLength(1000)]
    public string? EducationSummary { get; set; }

    [Url]
    public string? LinkedInUrl { get; set; }

    [Url]
    public string? PortfolioUrl { get; set; }

    public List<CandidateSkillUpsertRequest> Skills { get; set; } = new();
}

public class CandidateSkillUpsertRequest
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public string ProficiencyLevel { get; set; } = "Intermediate";

    [Range(0, 50)]
    public int YearsOfExperience { get; set; }
}

public record ResumeDto(
    Guid Id,
    string FileName,
    bool IsPrimary,
    DateTime CreatedAt,
    DateTime? ParsedAt,
    IReadOnlyList<string> ExtractedSkills);

public record JobSearchResultDto(
    Guid Id,
    string Title,
    string Company,
    string Location,
    string EmploymentType,
    decimal? SalaryMin,
    decimal? SalaryMax,
    double? MatchScore,
    IReadOnlyList<string> Skills,
    DateTime CreatedAt,
    string Status,
    int ApplicantsCount);

public record JobDetailDto(
    Guid Id,
    string Title,
    string Description,
    string? Requirements,
    string Company,
    string Location,
    string EmploymentType,
    decimal? SalaryMin,
    decimal? SalaryMax,
    DateTime? ClosingDate,
    IReadOnlyList<string> Skills,
    string Status,
    double? MatchScore);

public class ApplyToJobRequest
{
    [Required]
    public Guid JobPostingId { get; set; }

    public Guid? ResumeId { get; set; }

    [MaxLength(3000)]
    public string? CoverLetter { get; set; }
}

public record ApplicationDto(
    Guid Id,
    Guid JobPostingId,
    string JobTitle,
    string Company,
    DateTime CreatedAt,
    string Status,
    string? NextStep,
    double MatchScore);
