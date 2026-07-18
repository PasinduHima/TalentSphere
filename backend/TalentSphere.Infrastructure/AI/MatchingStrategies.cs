using TalentSphere.Application.Interfaces.Services;

namespace TalentSphere.Infrastructure.AI;

/// <summary>
/// Strategy Pattern implementation #1: scores a candidate purely on the
/// proportion of required/desired job skills they possess, weighted by the
/// weight configured on the job posting.
/// </summary>
public class SkillOverlapMatchingStrategy : IMatchingStrategy
{
    public MatchingStrategyType Type => MatchingStrategyType.SkillOverlap;

    public MatchResult Calculate(
        IReadOnlyDictionary<string, int> candidateSkillYears,
        int candidateExperienceYears,
        IReadOnlyDictionary<string, (bool IsRequired, double Weight)> jobSkills)
    {
        if (jobSkills.Count == 0)
            return new MatchResult(0, Array.Empty<string>(), Array.Empty<string>());

        var totalWeight = jobSkills.Sum(s => s.Value.Weight);
        double earnedWeight = 0;
        var matched = new List<string>();
        var missing = new List<string>();

        foreach (var (skillName, meta) in jobSkills)
        {
            if (candidateSkillYears.ContainsKey(skillName))
            {
                earnedWeight += meta.Weight;
                matched.Add(skillName);
            }
            else
            {
                missing.Add(skillName);
            }
        }

        var score = totalWeight == 0 ? 0 : Math.Round(earnedWeight / totalWeight * 100.0, 1);
        return new MatchResult(score, matched, missing);
    }
}

/// <summary>
/// Strategy Pattern implementation #2: like skill overlap, but also rewards
/// candidates whose years-of-experience on each matched skill (and overall
/// experience) exceed the baseline, up to a bonus cap. Used for recruiter-side
/// ranking where deeper expertise should be preferred over a bare match.
/// </summary>
public class WeightedExperienceMatchingStrategy : IMatchingStrategy
{
    public MatchingStrategyType Type => MatchingStrategyType.WeightedExperience;

    public MatchResult Calculate(
        IReadOnlyDictionary<string, int> candidateSkillYears,
        int candidateExperienceYears,
        IReadOnlyDictionary<string, (bool IsRequired, double Weight)> jobSkills)
    {
        if (jobSkills.Count == 0)
            return new MatchResult(0, Array.Empty<string>(), Array.Empty<string>());

        var totalWeight = jobSkills.Sum(s => s.Value.Weight);
        double earnedWeight = 0;
        var matched = new List<string>();
        var missing = new List<string>();

        foreach (var (skillName, meta) in jobSkills)
        {
            if (candidateSkillYears.TryGetValue(skillName, out var years))
            {
                var experienceBonus = Math.Min(years / 5.0, 1.0) * 0.2;
                earnedWeight += meta.Weight * (0.8 + experienceBonus);
                matched.Add(skillName);
            }
            else
            {
                missing.Add(skillName);
            }
        }

        var baseScore = totalWeight == 0 ? 0 : earnedWeight / totalWeight * 100.0;
        var overallBonus = Math.Min(candidateExperienceYears / 10.0, 1.0) * 5.0;
        var score = Math.Round(Math.Min(baseScore + overallBonus, 100.0), 1);

        return new MatchResult(score, matched, missing);
    }
}

/// <summary>
/// Resolves the configured <see cref="IMatchingStrategy"/> at runtime
/// (Strategy Pattern context/selector).
/// </summary>
public class CandidateMatchingService : ICandidateMatchingService
{
    private readonly IReadOnlyDictionary<MatchingStrategyType, IMatchingStrategy> _strategies;

    public CandidateMatchingService(IEnumerable<IMatchingStrategy> strategies)
    {
        _strategies = strategies.ToDictionary(s => s.Type);
    }

    public MatchResult ScoreCandidate(
        IReadOnlyDictionary<string, int> candidateSkillYears,
        int candidateExperienceYears,
        IReadOnlyDictionary<string, (bool IsRequired, double Weight)> jobSkills,
        MatchingStrategyType strategy = MatchingStrategyType.SkillOverlap)
    {
        var selected = _strategies.TryGetValue(strategy, out var s) ? s : _strategies.Values.First();
        return selected.Calculate(candidateSkillYears, candidateExperienceYears, jobSkills);
    }
}
