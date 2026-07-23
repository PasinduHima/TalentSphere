using System.ComponentModel.DataAnnotations;

namespace TalentSphere.Application.DTOs.HiringManager;

public record ShortlistedCandidateDto(
    Guid JobApplicationId,
    string CandidateName,
    string JobTitle,
    double MatchScore,
    string Status,
    DateTime CreatedAt,
    IReadOnlyList<InterviewSummaryDto> Interviews,
    IReadOnlyList<InterviewFeedbackSummaryDto> Feedbacks);

public record InterviewSummaryDto(
    Guid Id,
    string Type,
    string Status,
    DateTime ScheduledAt);

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

public class GenerateInterviewQuestionsRequest
{
    [Required, MaxLength(150)]
    public string RoleTitle { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string FocusArea { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string DifficultyLevel { get; set; } = string.Empty;

    [MaxLength(3000)]
    public string? JobDescription { get; set; }
}

public record GeneratedInterviewQuestionDto(string Question, string Rationale, string WhatToLookFor);

public record HiringDecisionDto(
    Guid Id,
    Guid JobApplicationId,
    string CandidateName,
    string JobTitle,
    string Decision,
    string? Notes,
    string DecidedByName,
    DateTime DecidedAt);
