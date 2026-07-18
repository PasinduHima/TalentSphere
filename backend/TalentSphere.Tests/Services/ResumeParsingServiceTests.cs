using System.Text;
using Microsoft.Extensions.Logging.Abstractions;
using TalentSphere.Infrastructure.AI;
using Xunit;

namespace TalentSphere.Tests.Services;

public class ResumeParsingServiceTests
{
    private readonly ResumeParsingService _sut = new(NullLogger<ResumeParsingService>.Instance);

    [Fact]
    public async Task ParseAsync_PlainTextResume_ExtractsKnownSkills()
    {
        const string resumeText = "Experienced engineer skilled in C#, React and SQL Server with 5 years of experience.";
        await using var stream = new MemoryStream(Encoding.UTF8.GetBytes(resumeText));

        var result = await _sut.ParseAsync(stream, "resume.txt", "text/plain");

        Assert.Contains("C#", result.ExtractedSkills);
        Assert.Contains("React", result.ExtractedSkills);
        Assert.Contains("SQL Server", result.ExtractedSkills);
        Assert.Equal(5, result.EstimatedExperienceYears);
    }

    [Fact]
    public async Task ParseAsync_NoRecognizableSkills_ReturnsEmptyList()
    {
        const string resumeText = "Enjoys hiking and painting on weekends.";
        await using var stream = new MemoryStream(Encoding.UTF8.GetBytes(resumeText));

        var result = await _sut.ParseAsync(stream, "resume.txt", "text/plain");

        Assert.Empty(result.ExtractedSkills);
        Assert.Null(result.EstimatedExperienceYears);
    }

    [Fact]
    public async Task ParseAsync_DoesNotMatchSkillAsSubstringOfAnotherWord()
    {
        const string resumeText = "Worked extensively with Golang tooling."; // should not match "Go"
        await using var stream = new MemoryStream(Encoding.UTF8.GetBytes(resumeText));

        var result = await _sut.ParseAsync(stream, "resume.txt", "text/plain");

        Assert.DoesNotContain("Go", result.ExtractedSkills);
        Assert.Contains("Golang", result.ExtractedSkills);
    }
}
