using System.Text;
using System.Text.RegularExpressions;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.Extensions.Logging;
using TalentSphere.Application.Interfaces.Services;

namespace TalentSphere.Infrastructure.AI;

/// <summary>
/// Rule-based resume parser: extracts raw text (plain text and DOCX natively;
/// PDF falls back to a best-effort printable-character scan since no external
/// OCR/NLP provider is wired up) then matches against <see cref="SkillLexicon"/>
/// and a simple "N years" regex to estimate experience. This satisfies the
/// "resume parsing / skill extraction" AI requirement with a deterministic,
/// dependency-light implementation that can be swapped for a real AI provider
/// (Azure Document Intelligence, OpenAI, etc.) by re-implementing
/// IResumeParsingService.
/// </summary>
public partial class ResumeParsingService : IResumeParsingService
{
    private readonly ILogger<ResumeParsingService> _logger;

    public ResumeParsingService(ILogger<ResumeParsingService> logger)
    {
        _logger = logger;
    }

    public async Task<ResumeParseResult> ParseAsync(Stream fileContent, string fileName, string contentType, CancellationToken ct = default)
    {
        string text;
        try
        {
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            text = extension switch
            {
                ".docx" => ExtractDocxText(fileContent),
                ".txt" => await ExtractPlainTextAsync(fileContent, ct),
                _ => await ExtractBestEffortTextAsync(fileContent, ct),
            };
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to parse resume {FileName}; continuing with empty text.", fileName);
            text = string.Empty;
        }

        var skills = ExtractSkills(text);
        var experienceYears = EstimateExperienceYears(text);

        return new ResumeParseResult(text, skills, experienceYears);
    }

    private static string ExtractDocxText(Stream stream)
    {
        stream.Position = 0;
        using var doc = WordprocessingDocument.Open(stream, false);
        var body = doc.MainDocumentPart?.Document?.Body;
        if (body is null) return string.Empty;

        var sb = new StringBuilder();
        foreach (var text in body.Descendants<Text>())
            sb.Append(text.Text).Append(' ');

        return sb.ToString();
    }

    private static async Task<string> ExtractPlainTextAsync(Stream stream, CancellationToken ct)
    {
        stream.Position = 0;
        using var reader = new StreamReader(stream, Encoding.UTF8, leaveOpen: true);
        return await reader.ReadToEndAsync(ct);
    }

    private static async Task<string> ExtractBestEffortTextAsync(Stream stream, CancellationToken ct)
    {
        stream.Position = 0;
        using var memory = new MemoryStream();
        await stream.CopyToAsync(memory, ct);
        var bytes = memory.ToArray();

        var sb = new StringBuilder();
        foreach (var b in bytes)
        {
            if (b is >= 32 and < 127 || b == '\n' || b == '\r' || b == '\t')
                sb.Append((char)b);
            else
                sb.Append(' ');
        }
        return sb.ToString();
    }

    private static IReadOnlyList<string> ExtractSkills(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return Array.Empty<string>();

        var matched = new List<string>();
        foreach (var skill in SkillLexicon.KnownSkills)
        {
            var pattern = $@"(?<![A-Za-z0-9]){Regex.Escape(skill)}(?![A-Za-z0-9])";
            if (Regex.IsMatch(text, pattern, RegexOptions.IgnoreCase))
                matched.Add(skill);
        }
        return matched;
    }

    private static int? EstimateExperienceYears(string text)
    {
        var match = ExperienceRegex().Match(text);
        if (match.Success && int.TryParse(match.Groups[1].Value, out var years))
            return years;
        return null;
    }

    [GeneratedRegex(@"(\d{1,2})\+?\s*(?:years|yrs)\s*(?:of)?\s*experience", RegexOptions.IgnoreCase)]
    private static partial Regex ExperienceRegex();
}
