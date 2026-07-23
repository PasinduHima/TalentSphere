using TalentSphere.Application.Interfaces.Services;
using TalentSphere.Infrastructure.AI;
using Xunit;

namespace TalentSphere.Tests.Services;

public class MatchingStrategyTests
{
    private static Dictionary<string, (bool IsRequired, double Weight)> JobSkills(params (string Name, double Weight)[] skills) =>
        skills.ToDictionary(s => s.Name, s => (true, s.Weight), StringComparer.OrdinalIgnoreCase);

    [Fact]
    public void SkillOverlap_AllSkillsMatched_ReturnsFullScore()
    {
        var strategy = new SkillOverlapMatchingStrategy();
        var candidateSkills = new Dictionary<string, int> { ["C#"] = 3, ["React"] = 2 };
        var jobSkills = JobSkills(("C#", 1.0), ("React", 1.0));

        var result = strategy.Calculate(candidateSkills, 3, jobSkills);

        Assert.Equal(100.0, result.ScorePercent);
        Assert.Equal(2, result.MatchedSkills.Count);
        Assert.Empty(result.MissingSkills);
    }

    [Fact]
    public void SkillOverlap_NoSkillsMatched_ReturnsZero()
    {
        var strategy = new SkillOverlapMatchingStrategy();
        var candidateSkills = new Dictionary<string, int> { ["Java"] = 4 };
        var jobSkills = JobSkills(("C#", 1.0), ("React", 1.0));

        var result = strategy.Calculate(candidateSkills, 4, jobSkills);

        Assert.Equal(0, result.ScorePercent);
        Assert.Equal(2, result.MissingSkills.Count);
    }

    [Fact]
    public void SkillOverlap_PartialMatch_WeightsProportionally()
    {
        var strategy = new SkillOverlapMatchingStrategy();
        var candidateSkills = new Dictionary<string, int> { ["C#"] = 3 };
        var jobSkills = JobSkills(("C#", 1.0), ("React", 1.0));

        var result = strategy.Calculate(candidateSkills, 3, jobSkills);

        Assert.Equal(50.0, result.ScorePercent);
        Assert.Single(result.MatchedSkills);
        Assert.Single(result.MissingSkills);
    }

    [Fact]
    public void SkillOverlap_NoJobSkillsConfigured_ReturnsZeroWithoutDivideByZero()
    {
        var strategy = new SkillOverlapMatchingStrategy();
        var result = strategy.Calculate(new Dictionary<string, int>(), 0, new Dictionary<string, (bool, double)>());

        Assert.Equal(0, result.ScorePercent);
    }

    [Fact]
    public void WeightedExperience_HigherExperienceScoresAtLeastAsHighAsLowerExperience()
    {
        var strategy = new WeightedExperienceMatchingStrategy();
        var jobSkills = JobSkills(("C#", 1.0));

        var junior = strategy.Calculate(new Dictionary<string, int> { ["C#"] = 1 }, 1, jobSkills);
        var senior = strategy.Calculate(new Dictionary<string, int> { ["C#"] = 8 }, 8, jobSkills);

        Assert.True(senior.ScorePercent >= junior.ScorePercent);
    }

    [Fact]
    public void CandidateMatchingService_ResolvesStrategyByType()
    {
        var service = new CandidateMatchingService(new IMatchingStrategy[]
        {
            new SkillOverlapMatchingStrategy(),
            new WeightedExperienceMatchingStrategy(),
        });

        var jobSkills = JobSkills(("SQL", 1.0));
        var candidateSkills = new Dictionary<string, int> { ["SQL"] = 2 };

        var overlapResult = service.ScoreCandidate(candidateSkills, 2, jobSkills, MatchingStrategyType.SkillOverlap);
        var weightedResult = service.ScoreCandidate(candidateSkills, 2, jobSkills, MatchingStrategyType.WeightedExperience);

        Assert.Equal(100.0, overlapResult.ScorePercent);
        Assert.True(weightedResult.ScorePercent > 0);
    }
}
