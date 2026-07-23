using System.ComponentModel.DataAnnotations;

namespace TalentSphere.Application.DTOs.Recruiter;

public class SkillRequirementRequest
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    public bool IsRequired { get; set; } = true;
    public double Weight { get; set; } = 1.0;
}

public class CreateJobRequest
{
    [Required, MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(5000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(3000)]
    public string? Requirements { get; set; }

    [Required]
    public Guid DepartmentId { get; set; }

    [Required, MaxLength(150)]
    public string Location { get; set; } = string.Empty;

    public string EmploymentType { get; set; } = "FullTime";

    public decimal? SalaryMin { get; set; }
    public decimal? SalaryMax { get; set; }
    public DateTime? ClosingDate { get; set; }

    public List<SkillRequirementRequest> Skills { get; set; } = new();
}

public class UpdateJobRequest : CreateJobRequest
{
    public string Status { get; set; } = "Draft";
}

public record JobPostingDto(
    Guid Id,
    string Title,
    string Description,
    string? Requirements,
    string DepartmentName,
    string Location,
    string EmploymentType,
    decimal? SalaryMin,
    decimal? SalaryMax,
    string Status,
    DateTime? ClosingDate,
    DateTime CreatedAt,
    IReadOnlyList<string> Skills,
    int ApplicantsCount);

public record CandidateSearchResultDto(
    Guid CandidateProfileId,
    string FullName,
    string Email,
    string? Headline,
    string? Location,
    int ExperienceYears,
    IReadOnlyList<string> Skills);

public record ApplicationReviewDto(
    Guid Id,
    Guid JobPostingId,
    string JobTitle,
    Guid CandidateProfileId,
    string CandidateName,
    string CandidateEmail,
    string Status,
    double MatchScore,
    IReadOnlyList<string> MatchedSkills,
    IReadOnlyList<string> MissingSkills,
    string? CoverLetter,
    Guid? ResumeId,
    DateTime CreatedAt);

public class UpdateApplicationStatusRequest
{
    [Required]
    public string Status { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Notes { get; set; }
}

public class ScheduleInterviewRequest
{
    [Required]
    public Guid JobApplicationId { get; set; }

    public string Type { get; set; } = "InitialScreen";

    [Required]
    public DateTime ScheduledAt { get; set; }

    [Range(10, 480)]
    public int DurationMinutes { get; set; } = 30;

    [Required]
    public Guid InterviewerId { get; set; }

    public string? Location { get; set; }
    public string? MeetingLink { get; set; }
}

public record InterviewDto(
    Guid Id,
    Guid JobApplicationId,
    string CandidateName,
    string JobTitle,
    string Type,
    string Status,
    DateTime ScheduledAt,
    int DurationMinutes,
    string? Location,
    string? MeetingLink,
    string InterviewerName);
