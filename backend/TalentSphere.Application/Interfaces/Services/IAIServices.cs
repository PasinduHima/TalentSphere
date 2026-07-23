namespace TalentSphere.Application.Interfaces.Services;

public record ResumeParseResult(string ExtractedText, IReadOnlyList<string> ExtractedSkills, int? EstimatedExperienceYears);

/// <summary>
/// Extracts raw text and candidate skills from an uploaded resume file.
/// The default implementation is a rule-based (regex/dictionary) parser that
/// can be swapped for a real NLP/AI provider without touching callers.
/// </summary>
public interface IResumeParsingService
{
    Task<ResumeParseResult> ParseAsync(Stream fileContent, string fileName, string contentType, CancellationToken ct = default);
}

public record MatchResult(double ScorePercent, IReadOnlyList<string> MatchedSkills, IReadOnlyList<string> MissingSkills);

public enum MatchingStrategyType
{
    SkillOverlap = 0,
    WeightedExperience = 1,
}

/// <summary>
/// Strategy Pattern: each candidate-to-job matching algorithm implements this
/// contract; <see cref="ICandidateMatchingService"/> selects one at runtime.
/// </summary>
public interface IMatchingStrategy
{
    MatchingStrategyType Type { get; }

    MatchResult Calculate(
        IReadOnlyDictionary<string, int> candidateSkillYears,
        int candidateExperienceYears,
        IReadOnlyDictionary<string, (bool IsRequired, double Weight)> jobSkills);
}

/// <summary>
/// AI/analytics facade used by application services to score a candidate
/// against a job posting and to rank a candidate pool for a job.
/// </summary>
public interface ICandidateMatchingService
{
    MatchResult ScoreCandidate(
        IReadOnlyDictionary<string, int> candidateSkillYears,
        int candidateExperienceYears,
        IReadOnlyDictionary<string, (bool IsRequired, double Weight)> jobSkills,
        MatchingStrategyType strategy = MatchingStrategyType.SkillOverlap);
}

public record InterviewQuestionRequest(
    string RoleTitle,
    string FocusArea,
    string DifficultyLevel,
    string? JobDescription);

public record GeneratedInterviewQuestion(
    string Question,
    string Rationale,
    string WhatToLookFor);

/// <summary>
/// Generates tailored interview questions for a role. The primary
/// implementation calls Google's Gemini API (generative AI); if no API key
/// is configured or the call fails, it degrades to a deterministic
/// template-based generator so the feature stays usable offline/in tests.
/// </summary>
public interface IInterviewQuestionGenerationService
{
    Task<IReadOnlyList<GeneratedInterviewQuestion>> GenerateAsync(InterviewQuestionRequest request, CancellationToken ct = default);
}
