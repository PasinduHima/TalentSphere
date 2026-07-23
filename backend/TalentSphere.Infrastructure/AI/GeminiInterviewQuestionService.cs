using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TalentSphere.Application.Interfaces.Services;
using TalentSphere.Infrastructure.Options;

namespace TalentSphere.Infrastructure.AI;

/// <summary>
/// Calls Google's Gemini API (generativelanguage.googleapis.com) to generate
/// role-specific interview questions with structured JSON output. Falls back
/// to a deterministic template generator when no API key is configured, the
/// request fails, or the response can't be parsed — the hiring manager UI
/// stays usable either way, and callers can't tell which path served the
/// request except via the (unsurfaced) log entry.
/// </summary>
public class GeminiInterviewQuestionService : IInterviewQuestionGenerationService
{
    private readonly HttpClient _httpClient;
    private readonly GeminiOptions _options;
    private readonly ILogger<GeminiInterviewQuestionService> _logger;

    public GeminiInterviewQuestionService(HttpClient httpClient, IOptions<GeminiOptions> options, ILogger<GeminiInterviewQuestionService> logger)
    {
        _httpClient = httpClient;
        _options = options.Value;
        _logger = logger;
    }

    public async Task<IReadOnlyList<GeneratedInterviewQuestion>> GenerateAsync(InterviewQuestionRequest request, CancellationToken ct = default)
    {
        if (!_options.IsConfigured)
        {
            _logger.LogInformation("Gemini API key not configured; using template-based interview question fallback.");
            return BuildFallbackQuestions(request);
        }

        try
        {
            var questions = await CallGeminiAsync(request, ct);
            if (questions.Count > 0) return questions;

            _logger.LogWarning("Gemini returned zero questions for {Role}; using fallback.", request.RoleTitle);
            return BuildFallbackQuestions(request);
        }
        catch (Exception ex) when (ex is HttpRequestException or JsonException or TaskCanceledException)
        {
            _logger.LogWarning(ex, "Gemini interview question generation failed for {Role}; using fallback.", request.RoleTitle);
            return BuildFallbackQuestions(request);
        }
    }

    private async Task<IReadOnlyList<GeneratedInterviewQuestion>> CallGeminiAsync(InterviewQuestionRequest request, CancellationToken ct)
    {
        var prompt =
            $"""
             You are an expert technical interviewer helping a hiring manager prepare for an interview.

             Generate exactly 4 interview questions for this role:
             - Role: {request.RoleTitle}
             - Focus area: {request.FocusArea}
             - Difficulty level: {request.DifficultyLevel}
             {(string.IsNullOrWhiteSpace(request.JobDescription) ? "" : $"- Job description: {request.JobDescription}")}

             For each question, provide a rationale for why it's a good question to ask, and what a strong answer should cover.
             Keep each field concise (2-4 sentences).
             """;

        var requestBody = new GeminiGenerateRequest(
            Contents: [new GeminiContent("user", [new GeminiPart(prompt)])],
            GenerationConfig: new GeminiGenerationConfig(
                ResponseMimeType: "application/json",
                ResponseSchema: QuestionResponseSchema));

        var url = $"v1beta/models/{_options.Model}:generateContent?key={_options.ApiKey}";
        using var response = await _httpClient.PostAsJsonAsync(url, requestBody, JsonOptions, ct);
        response.EnsureSuccessStatusCode();

        var payload = await response.Content.ReadFromJsonAsync<GeminiGenerateResponse>(JsonOptions, ct);
        var text = payload?.Candidates?.FirstOrDefault()?.Content?.Parts?.FirstOrDefault()?.Text;
        if (string.IsNullOrWhiteSpace(text)) return [];

        var parsed = JsonSerializer.Deserialize<QuestionSetResponse>(text, JsonOptions);
        return parsed?.Questions?.Select(q => new GeneratedInterviewQuestion(q.Question, q.Rationale, q.WhatToLookFor)).ToList()
            ?? [];
    }

    private static IReadOnlyList<GeneratedInterviewQuestion> BuildFallbackQuestions(InterviewQuestionRequest request)
    {
        var role = request.RoleTitle;
        var focus = request.FocusArea;

        return
        [
            new GeneratedInterviewQuestion(
                $"Walk me through a challenging {focus.ToLowerInvariant()} problem you solved as a {role}, and how you approached it.",
                $"Assesses hands-on {focus} experience and problem-solving process at the {request.DifficultyLevel.ToLowerInvariant()} level.",
                "Look for a structured approach: how they defined the problem, evaluated trade-offs, and measured the outcome."),
            new GeneratedInterviewQuestion(
                $"What would you consider the most important factors when evaluating decisions related to {focus.ToLowerInvariant()} in a {role} role?",
                "Reveals depth of domain knowledge and whether the candidate can prioritize competing concerns.",
                "Strong answers reference concrete trade-offs (e.g. cost, maintainability, team impact) rather than generic best practices."),
            new GeneratedInterviewQuestion(
                $"Describe a time you disagreed with a technical or process decision related to {focus.ToLowerInvariant()}. How did you handle it?",
                "Evaluates communication style and collaborative problem-solving under disagreement.",
                "Look for constructive escalation, evidence-based arguments, and willingness to align once a decision is made."),
            new GeneratedInterviewQuestion(
                $"How do you stay current with best practices in {focus.ToLowerInvariant()}, and how have you applied something new recently?",
                "Tests continuous-learning mindset, relevant for a fast-moving discipline.",
                "Look for specific examples of applied learning, not just passive consumption of content."),
        ];
    }

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private static readonly GeminiSchema QuestionResponseSchema = new(
        Type: "OBJECT",
        Properties: new Dictionary<string, GeminiSchema>
        {
            ["questions"] = new GeminiSchema(
                Type: "ARRAY",
                Items: new GeminiSchema(
                    Type: "OBJECT",
                    Properties: new Dictionary<string, GeminiSchema>
                    {
                        ["question"] = new GeminiSchema(Type: "STRING"),
                        ["rationale"] = new GeminiSchema(Type: "STRING"),
                        ["whatToLookFor"] = new GeminiSchema(Type: "STRING"),
                    },
                    Required: ["question", "rationale", "whatToLookFor"])),
        },
        Required: ["questions"]);

    // --- Gemini REST API wire types (generativelanguage.googleapis.com v1beta) ---

    private record GeminiGenerateRequest(
        [property: JsonPropertyName("contents")] GeminiContent[] Contents,
        [property: JsonPropertyName("generationConfig")] GeminiGenerationConfig GenerationConfig);

    private record GeminiContent(
        [property: JsonPropertyName("role")] string Role,
        [property: JsonPropertyName("parts")] GeminiPart[] Parts);

    private record GeminiPart([property: JsonPropertyName("text")] string Text);

    private record GeminiGenerationConfig(
        [property: JsonPropertyName("responseMimeType")] string ResponseMimeType,
        [property: JsonPropertyName("responseSchema")] GeminiSchema ResponseSchema);

    private record GeminiSchema(
        [property: JsonPropertyName("type")] string Type,
        [property: JsonPropertyName("properties")] Dictionary<string, GeminiSchema>? Properties = null,
        [property: JsonPropertyName("items")] GeminiSchema? Items = null,
        [property: JsonPropertyName("required")] string[]? Required = null);

    private record GeminiGenerateResponse([property: JsonPropertyName("candidates")] GeminiCandidate[]? Candidates);
    private record GeminiCandidate([property: JsonPropertyName("content")] GeminiContent? Content);

    private record QuestionSetResponse([property: JsonPropertyName("questions")] List<QuestionItem>? Questions);
    private record QuestionItem(
        [property: JsonPropertyName("question")] string Question,
        [property: JsonPropertyName("rationale")] string Rationale,
        [property: JsonPropertyName("whatToLookFor")] string WhatToLookFor);
}
