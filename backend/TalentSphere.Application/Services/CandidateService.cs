using Microsoft.EntityFrameworkCore;
using TalentSphere.Application.Common.Exceptions;
using TalentSphere.Application.Common.Models;
using TalentSphere.Application.DTOs.Candidate;
using TalentSphere.Application.Interfaces.AppServices;
using TalentSphere.Application.Interfaces.Repositories;
using TalentSphere.Application.Interfaces.Services;
using TalentSphere.Domain.Entities;
using TalentSphere.Domain.Enums;

namespace TalentSphere.Application.Services;

public class CandidateService : ICandidateService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IFileStorageService _fileStorageService;
    private readonly IResumeParsingService _resumeParsingService;
    private readonly ICandidateMatchingService _matchingService;
    private readonly IAuditService _auditService;
    private readonly INotificationService _notificationService;

    public CandidateService(
        IUnitOfWork unitOfWork,
        IFileStorageService fileStorageService,
        IResumeParsingService resumeParsingService,
        ICandidateMatchingService matchingService,
        IAuditService auditService,
        INotificationService notificationService)
    {
        _unitOfWork = unitOfWork;
        _fileStorageService = fileStorageService;
        _resumeParsingService = resumeParsingService;
        _matchingService = matchingService;
        _auditService = auditService;
        _notificationService = notificationService;
    }

    private async Task<CandidateProfile> GetProfileEntityAsync(Guid userId, CancellationToken ct)
    {
        var profile = await _unitOfWork.CandidateProfiles.Query()
            .Where(p => p.UserId == userId)
            .Select(p => p)
            .FirstOrDefaultAsync(ct);

        return profile ?? throw new NotFoundException(nameof(CandidateProfile), userId);
    }

    public async Task<CandidateProfileDto> GetProfileAsync(Guid userId, CancellationToken ct = default)
    {
        var profile = await LoadFullProfileAsync(userId, ct);
        return MapProfile(profile);
    }

    public async Task<CandidateProfileDto> UpdateProfileAsync(Guid userId, UpdateCandidateProfileRequest request, CancellationToken ct = default)
    {
        var profile = await LoadFullProfileAsync(userId, ct);

        profile.Headline = request.Headline;
        profile.Summary = request.Summary;
        profile.Location = request.Location;
        profile.PhoneNumber = request.PhoneNumber;
        profile.ExperienceYears = request.ExperienceYears;
        profile.EducationSummary = request.EducationSummary;
        profile.LinkedInUrl = request.LinkedInUrl;
        profile.PortfolioUrl = request.PortfolioUrl;
        profile.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.CandidateSkills.RemoveRange(profile.CandidateSkills);
        profile.CandidateSkills.Clear();

        foreach (var skillRequest in request.Skills)
        {
            var skill = await GetOrCreateSkillAsync(skillRequest.Name, ct);
            profile.CandidateSkills.Add(new CandidateSkill
            {
                CandidateProfileId = profile.Id,
                SkillId = skill.Id,
                ProficiencyLevel = Enum.TryParse<ProficiencyLevel>(skillRequest.ProficiencyLevel, true, out var level) ? level : ProficiencyLevel.Intermediate,
                YearsOfExperience = skillRequest.YearsOfExperience,
            });
        }

        profile.ProfileCompletionPercent = CalculateProfileCompletion(profile);

        _unitOfWork.CandidateProfiles.Update(profile);
        await _unitOfWork.SaveChangesAsync(ct);
        await _auditService.LogAsync("UpdateProfile", nameof(CandidateProfile), profile.Id.ToString(), null, ct);

        return MapProfile(profile);
    }

    public async Task<ResumeDto> UploadResumeAsync(Guid userId, Stream fileContent, string fileName, string contentType, CancellationToken ct = default)
    {
        var profile = await GetProfileEntityAsync(userId, ct);

        using var memoryStream = new MemoryStream();
        await fileContent.CopyToAsync(memoryStream, ct);
        memoryStream.Position = 0;

        var storagePath = await _fileStorageService.SaveAsync(memoryStream, fileName, "resumes", ct);

        memoryStream.Position = 0;
        var parseResult = await _resumeParsingService.ParseAsync(memoryStream, fileName, contentType, ct);

        var hasExistingResumes = await _unitOfWork.Resumes.AnyAsync(r => r.CandidateProfileId == profile.Id, ct);

        var resume = new Resume
        {
            CandidateProfileId = profile.Id,
            FileName = fileName,
            StoragePath = storagePath,
            ContentType = contentType,
            FileSizeBytes = memoryStream.Length,
            IsPrimary = !hasExistingResumes,
            ParsedText = parseResult.ExtractedText,
            ExtractedSkillsJson = System.Text.Json.JsonSerializer.Serialize(parseResult.ExtractedSkills),
            ParsedAt = DateTime.UtcNow,
        };

        await _unitOfWork.Resumes.AddAsync(resume, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        await _auditService.LogAsync("UploadResume", nameof(Resume), resume.Id.ToString(), fileName, ct);

        return MapResume(resume, parseResult.ExtractedSkills);
    }

    public async Task<IReadOnlyList<ResumeDto>> GetResumesAsync(Guid userId, CancellationToken ct = default)
    {
        var profile = await GetProfileEntityAsync(userId, ct);
        var resumes = await _unitOfWork.Resumes.FindAsync(r => r.CandidateProfileId == profile.Id, ct);
        return resumes.OrderByDescending(r => r.CreatedAt).Select(r => MapResume(r, DeserializeSkills(r.ExtractedSkillsJson))).ToList();
    }

    public async Task SetPrimaryResumeAsync(Guid userId, Guid resumeId, CancellationToken ct = default)
    {
        var profile = await GetProfileEntityAsync(userId, ct);
        var resumes = await _unitOfWork.Resumes.FindAsync(r => r.CandidateProfileId == profile.Id, ct);
        var target = resumes.FirstOrDefault(r => r.Id == resumeId) ?? throw new NotFoundException(nameof(Resume), resumeId);

        foreach (var r in resumes)
        {
            r.IsPrimary = r.Id == resumeId;
            _unitOfWork.Resumes.Update(r);
        }
        await _unitOfWork.SaveChangesAsync(ct);
    }

    public async Task DeleteResumeAsync(Guid userId, Guid resumeId, CancellationToken ct = default)
    {
        var profile = await GetProfileEntityAsync(userId, ct);
        var resume = (await _unitOfWork.Resumes.FindAsync(r => r.CandidateProfileId == profile.Id && r.Id == resumeId, ct)).FirstOrDefault()
            ?? throw new NotFoundException(nameof(Resume), resumeId);

        await _fileStorageService.DeleteAsync(resume.StoragePath, ct);
        _unitOfWork.Resumes.Remove(resume);
        await _unitOfWork.SaveChangesAsync(ct);
    }

    public async Task<PagedResult<JobSearchResultDto>> SearchJobsAsync(Guid userId, JobSearchFilter filter, CancellationToken ct = default)
    {
        var profile = await LoadFullProfileAsync(userId, ct);
        var candidateSkills = BuildCandidateSkillMap(profile);

        var query = _unitOfWork.JobPostings.Query()
            .Where(j => j.Status == JobStatus.Active);

        if (!string.IsNullOrWhiteSpace(filter.Keyword))
            query = query.Where(j => j.Title.Contains(filter.Keyword) || j.Description.Contains(filter.Keyword));

        if (!string.IsNullOrWhiteSpace(filter.Location))
            query = query.Where(j => j.Location.Contains(filter.Location));

        if (!string.IsNullOrWhiteSpace(filter.EmploymentType) &&
            Enum.TryParse<EmploymentType>(filter.EmploymentType, true, out var employmentType))
            query = query.Where(j => j.EmploymentType == employmentType);

        var totalCount = await query.CountAsync(ct);

        var jobs = await query
            .OrderByDescending(j => j.CreatedAt)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync(ct);

        var items = jobs.Select(j => MapJobSearchResult(j, candidateSkills)).ToList();

        return new PagedResult<JobSearchResultDto>
        {
            Items = items,
            Page = filter.Page,
            PageSize = filter.PageSize,
            TotalCount = totalCount,
        };
    }

    public async Task<JobDetailDto> GetJobDetailAsync(Guid userId, Guid jobId, CancellationToken ct = default)
    {
        var profile = await LoadFullProfileAsync(userId, ct);
        var candidateSkills = BuildCandidateSkillMap(profile);

        var job = await _unitOfWork.JobPostings.Query()
            .FirstOrDefaultAsync(j => j.Id == jobId, ct) ?? throw new NotFoundException(nameof(JobPosting), jobId);

        var jobSkills = BuildJobSkillMap(job);
        var match = _matchingService.ScoreCandidate(candidateSkills, profile.ExperienceYears, jobSkills);

        return new JobDetailDto(
            job.Id,
            job.Title,
            job.Description,
            job.Requirements,
            job.Department?.Organization?.Name ?? job.Department?.Name ?? "N/A",
            job.Location,
            job.EmploymentType.ToString(),
            job.SalaryMin,
            job.SalaryMax,
            job.ClosingDate,
            job.JobSkills.Select(js => js.Skill?.Name ?? string.Empty).Where(s => s.Length > 0).ToList(),
            job.Status.ToString(),
            match.ScorePercent);
    }

    public async Task<IReadOnlyList<JobSearchResultDto>> GetRecommendedJobsAsync(Guid userId, int take = 10, CancellationToken ct = default)
    {
        var profile = await LoadFullProfileAsync(userId, ct);
        var candidateSkills = BuildCandidateSkillMap(profile);

        var jobs = await _unitOfWork.JobPostings.Query()
            .Where(j => j.Status == JobStatus.Active)
            .ToListAsync(ct);

        return jobs
            .Select(j => MapJobSearchResult(j, candidateSkills))
            .OrderByDescending(j => j.MatchScore)
            .Take(take)
            .ToList();
    }

    public async Task<ApplicationDto> ApplyToJobAsync(Guid userId, ApplyToJobRequest request, CancellationToken ct = default)
    {
        var profile = await LoadFullProfileAsync(userId, ct);

        var job = await _unitOfWork.JobPostings.Query()
            .FirstOrDefaultAsync(j => j.Id == request.JobPostingId, ct)
            ?? throw new NotFoundException(nameof(JobPosting), request.JobPostingId);

        if (job.Status != JobStatus.Active)
            throw new ValidationAppException("This job posting is not currently accepting applications.");

        var alreadyApplied = await _unitOfWork.JobApplications.AnyAsync(
            a => a.JobPostingId == job.Id && a.CandidateProfileId == profile.Id, ct);
        if (alreadyApplied)
            throw new ConflictAppException("You have already applied to this job.");

        Resume? resume = request.ResumeId.HasValue
            ? (await _unitOfWork.Resumes.FindAsync(r => r.Id == request.ResumeId.Value && r.CandidateProfileId == profile.Id, ct)).FirstOrDefault()
            : profile.Resumes.FirstOrDefault(r => r.IsPrimary) ?? profile.Resumes.FirstOrDefault();

        var candidateSkills = BuildCandidateSkillMap(profile);
        var jobSkills = BuildJobSkillMap(job);
        var match = _matchingService.ScoreCandidate(candidateSkills, profile.ExperienceYears, jobSkills);

        var application = new JobApplication
        {
            JobPostingId = job.Id,
            CandidateProfileId = profile.Id,
            ResumeId = resume?.Id,
            CoverLetter = request.CoverLetter,
            Status = ApplicationStatus.Applied,
            MatchScore = match.ScorePercent,
            NextStep = "Awaiting recruiter review",
        };
        application.StatusHistory.Add(new ApplicationStatusHistory
        {
            Status = ApplicationStatus.Applied,
            Notes = "Application submitted by candidate.",
        });

        await _unitOfWork.JobApplications.AddAsync(application, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        await _auditService.LogAsync("ApplyToJob", nameof(JobApplication), application.Id.ToString(), $"Applied to job {job.Title}", ct);

        if (job.Recruiter is not null)
        {
            await _notificationService.NotifyAsync(new NotificationRequest(
                job.RecruiterId,
                job.Recruiter.Email ?? string.Empty,
                job.Recruiter.PhoneNumber,
                NotificationType.ApplicationStatusChanged,
                NotificationChannel.InApp,
                "New Application Received",
                $"{profile.User?.FullName ?? "A candidate"} applied to {job.Title}."), ct);
        }

        return new ApplicationDto(application.Id, job.Id, job.Title, job.Department?.Name ?? "N/A", application.CreatedAt, application.Status.ToString(), application.NextStep, application.MatchScore);
    }

    public async Task<IReadOnlyList<ApplicationDto>> GetApplicationsAsync(Guid userId, CancellationToken ct = default)
    {
        var profile = await GetProfileEntityAsync(userId, ct);

        var applications = await _unitOfWork.JobApplications.Query()
            .Where(a => a.CandidateProfileId == profile.Id)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(ct);

        return applications.Select(a => new ApplicationDto(
            a.Id,
            a.JobPostingId,
            a.JobPosting?.Title ?? string.Empty,
            a.JobPosting?.Department?.Name ?? "N/A",
            a.CreatedAt,
            a.Status.ToString(),
            a.NextStep,
            a.MatchScore)).ToList();
    }

    private async Task<CandidateProfile> LoadFullProfileAsync(Guid userId, CancellationToken ct)
    {
        var profile = await _unitOfWork.CandidateProfiles.Query()
            .FirstOrDefaultAsync(p => p.UserId == userId, ct);

        return profile ?? throw new NotFoundException(nameof(CandidateProfile), userId);
    }

    private async Task<Skill> GetOrCreateSkillAsync(string name, CancellationToken ct)
    {
        var normalized = name.Trim();
        var existing = await _unitOfWork.Skills.FirstOrDefaultAsync(s => s.Name.ToLower() == normalized.ToLower(), ct);
        if (existing is not null) return existing;

        var skill = new Skill { Name = normalized };
        await _unitOfWork.Skills.AddAsync(skill, ct);
        return skill;
    }

    private static int CalculateProfileCompletion(CandidateProfile profile)
    {
        var fields = new object?[]
        {
            profile.Headline, profile.Summary, profile.Location, profile.PhoneNumber,
            profile.EducationSummary, profile.LinkedInUrl,
        };
        var filled = fields.Count(f => !string.IsNullOrWhiteSpace(f as string));
        var skillsScore = profile.CandidateSkills.Count > 0 ? 1 : 0;
        var resumeScore = profile.Resumes.Count > 0 ? 1 : 0;
        var total = fields.Length + 2;
        return (int)Math.Round((filled + skillsScore + resumeScore) * 100.0 / total);
    }

    private static Dictionary<string, int> BuildCandidateSkillMap(CandidateProfile profile) =>
        profile.CandidateSkills
            .Where(cs => cs.Skill is not null)
            .GroupBy(cs => cs.Skill!.Name, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(g => g.Key, g => g.Max(cs => cs.YearsOfExperience), StringComparer.OrdinalIgnoreCase);

    private static Dictionary<string, (bool IsRequired, double Weight)> BuildJobSkillMap(JobPosting job) =>
        job.JobSkills
            .Where(js => js.Skill is not null)
            .GroupBy(js => js.Skill!.Name, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(g => g.Key, g => (g.First().IsRequired, g.First().Weight), StringComparer.OrdinalIgnoreCase);

    private JobSearchResultDto MapJobSearchResult(JobPosting job, IReadOnlyDictionary<string, int> candidateSkills)
    {
        var jobSkills = BuildJobSkillMap(job);
        var match = _matchingService.ScoreCandidate(candidateSkills, 0, jobSkills);

        return new JobSearchResultDto(
            job.Id,
            job.Title,
            job.Department?.Name ?? "N/A",
            job.Location,
            job.EmploymentType.ToString(),
            job.SalaryMin,
            job.SalaryMax,
            match.ScorePercent,
            job.JobSkills.Select(js => js.Skill?.Name ?? string.Empty).Where(s => s.Length > 0).ToList(),
            job.CreatedAt,
            job.Status.ToString(),
            job.Applications.Count);
    }

    private static ResumeDto MapResume(Resume resume, IReadOnlyList<string> skills) => new(
        resume.Id, resume.FileName, resume.IsPrimary, resume.CreatedAt, resume.ParsedAt, skills);

    private static IReadOnlyList<string> DeserializeSkills(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return Array.Empty<string>();
        try
        {
            return System.Text.Json.JsonSerializer.Deserialize<List<string>>(json) ?? new List<string>();
        }
        catch
        {
            return Array.Empty<string>();
        }
    }

    private static CandidateProfileDto MapProfile(CandidateProfile profile) => new(
        profile.Id,
        profile.UserId,
        profile.User?.FullName ?? string.Empty,
        profile.User?.Email ?? string.Empty,
        profile.Headline,
        profile.Summary,
        profile.Location,
        profile.PhoneNumber,
        profile.ExperienceYears,
        profile.EducationSummary,
        profile.LinkedInUrl,
        profile.PortfolioUrl,
        profile.ProfileCompletionPercent,
        profile.CandidateSkills.Select(cs => new CandidateSkillDto(cs.SkillId, cs.Skill?.Name ?? string.Empty, cs.ProficiencyLevel.ToString(), cs.YearsOfExperience)).ToList(),
        profile.Resumes.Select(r => MapResume(r, DeserializeSkills(r.ExtractedSkillsJson))).ToList());
}
