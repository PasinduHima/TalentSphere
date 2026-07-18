using System.ComponentModel.DataAnnotations;

namespace TalentSphere.Application.DTOs.HiringManager;

public record ShortlistedCandidateDto(
    Guid JobApplicationId,
    string CandidateName,
    string JobTitle,
    double MatchScore,
    string Status,
    DateTime CreatedAt,
    IReadOnlyList<InterviewFeedbackSummaryDto> Feedbacks);

public record InterviewFeedbackSummaryDto(
    Guid Id,
    string EvaluatorName,
    int OverallScore,
    string? Recommendation,
    DateTime CreatedAt);

public class SubmitFeedbackRequest
{
    [Required]
    public Guid InterviewId { get; set; }

    [Range(0, 10)]
    public int TechnicalScore { get; set; }

    [Range(0, 10)]
    public int CommunicationScore { get; set; }

    [Range(0, 10)]
    public int CultureFitScore { get; set; }

    [MaxLength(2000)]
    public string? Comments { get; set; }

    public string? Recommendation { get; set; }
}

public record InterviewFeedbackDto(
    Guid Id,
    Guid InterviewId,
    string EvaluatorName,
    int TechnicalScore,
    int CommunicationScore,
    int CultureFitScore,
    int OverallScore,
    string? Comments,
    string? Recommendation,
    DateTime CreatedAt);

public class HiringDecisionRequest
{
    [Required]
    public Guid JobApplicationId { get; set; }

    [Required]
    public string Decision { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Notes { get; set; }
}

public record HiringDecisionDto(
    Guid Id,
    Guid JobApplicationId,
    string CandidateName,
    string JobTitle,
    string Decision,
    string? Notes,
    string DecidedByName,
    DateTime DecidedAt);
