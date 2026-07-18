using Microsoft.EntityFrameworkCore;
using TalentSphere.Application.Common.Exceptions;
using TalentSphere.Application.Common.Models;
using TalentSphere.Application.DTOs.Recruiter;
using TalentSphere.Application.Interfaces.AppServices;
using TalentSphere.Application.Interfaces.Repositories;
using TalentSphere.Application.Interfaces.Services;
using TalentSphere.Domain.Entities;
using TalentSphere.Domain.Enums;

namespace TalentSphere.Application.Services;

public class RecruiterService : IRecruiterService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICandidateMatchingService _matchingService;
    private readonly ICalendarService _calendarService;
    private readonly INotificationService _notificationService;
    private readonly IAuditService _auditService;

    public RecruiterService(
        IUnitOfWork unitOfWork,
        ICandidateMatchingService matchingService,
        ICalendarService calendarService,
        INotificationService notificationService,
        IAuditService auditService)
    {
        _unitOfWork = unitOfWork;
        _matchingService = matchingService;
        _calendarService = calendarService;
        _notificationService = notificationService;
        _auditService = auditService;
    }

    public async Task<JobPostingDto> CreateJobAsync(Guid recruiterId, CreateJobRequest request, CancellationToken ct = default)
    {
        var department = await _unitOfWork.Departments.GetByIdAsync(request.DepartmentId, ct)
            ?? throw new NotFoundException(nameof(Department), request.DepartmentId);

        var job = new JobPosting
        {
            Title = request.Title,
            Description = request.Description,
            Requirements = request.Requirements,
            DepartmentId = request.DepartmentId,
            RecruiterId = recruiterId,
            Location = request.Location,
            EmploymentType = Enum.TryParse<EmploymentType>(request.EmploymentType, true, out var et) ? et : EmploymentType.FullTime,
            SalaryMin = request.SalaryMin,
            SalaryMax = request.SalaryMax,
            ClosingDate = request.ClosingDate,
            Status = JobStatus.Draft,
        };

        foreach (var skillReq in request.Skills)
        {
            var skill = await GetOrCreateSkillAsync(skillReq.Name, ct);
            job.JobSkills.Add(new JobSkill { JobPostingId = job.Id, SkillId = skill.Id, IsRequired = skillReq.IsRequired, Weight = skillReq.Weight });
        }

        await _unitOfWork.JobPostings.AddAsync(job, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        await _auditService.LogAsync("CreateJob", nameof(JobPosting), job.Id.ToString(), job.Title, ct);

        job.Department = department;
        return MapJob(job);
    }

    public async Task<JobPostingDto> UpdateJobAsync(Guid recruiterId, Guid jobId, UpdateJobRequest request, CancellationToken ct = default)
    {
        var job = await _unitOfWork.JobPostings.GetByIdAsync(jobId, ct)
            ?? throw new NotFoundException(nameof(JobPosting), jobId);

        if (job.RecruiterId != recruiterId)
            throw new ForbiddenAppException("You can only manage jobs you have posted.");

        job.Title = request.Title;
        job.Description = request.Description;
        job.Requirements = request.Requirements;
        job.DepartmentId = request.DepartmentId;
        job.Location = request.Location;
        job.EmploymentType = Enum.TryParse<EmploymentType>(request.EmploymentType, true, out var et) ? et : job.EmploymentType;
        job.SalaryMin = request.SalaryMin;
        job.SalaryMax = request.SalaryMax;
        job.ClosingDate = request.ClosingDate;
        job.Status = Enum.TryParse<JobStatus>(request.Status, true, out var status) ? status : job.Status;
        job.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.JobSkills.RemoveRange(job.JobSkills);
        job.JobSkills.Clear();
        foreach (var skillReq in request.Skills)
        {
            var skill = await GetOrCreateSkillAsync(skillReq.Name, ct);
            job.JobSkills.Add(new JobSkill { JobPostingId = job.Id, SkillId = skill.Id, IsRequired = skillReq.IsRequired, Weight = skillReq.Weight });
        }

        _unitOfWork.JobPostings.Update(job);
        await _unitOfWork.SaveChangesAsync(ct);
        await _auditService.LogAsync("UpdateJob", nameof(JobPosting), job.Id.ToString(), job.Title, ct);

        return MapJob(job);
    }

    public async Task<IReadOnlyList<JobPostingDto>> GetMyJobsAsync(Guid recruiterId, CancellationToken ct = default)
    {
        var jobs = await _unitOfWork.JobPostings.Query()
            .Where(j => j.RecruiterId == recruiterId)
            .OrderByDescending(j => j.CreatedAt)
            .ToListAsync(ct);

        return jobs.Select(MapJob).ToList();
    }

    public async Task DeleteJobAsync(Guid recruiterId, Guid jobId, CancellationToken ct = default)
    {
        var job = await _unitOfWork.JobPostings.GetByIdAsync(jobId, ct)
            ?? throw new NotFoundException(nameof(JobPosting), jobId);

        if (job.RecruiterId != recruiterId)
            throw new ForbiddenAppException("You can only manage jobs you have posted.");

        _unitOfWork.JobPostings.Remove(job);
        await _unitOfWork.SaveChangesAsync(ct);
        await _auditService.LogAsync("DeleteJob", nameof(JobPosting), job.Id.ToString(), job.Title, ct);
    }

    public async Task<PagedResult<CandidateSearchResultDto>> SearchCandidatesAsync(CandidateSearchFilter filter, CancellationToken ct = default)
    {
        var query = _unitOfWork.CandidateProfiles.Query();

        if (!string.IsNullOrWhiteSpace(filter.Keyword))
            query = query.Where(p =>
                (p.Headline != null && p.Headline.Contains(filter.Keyword)) ||
                (p.User != null && (p.User.FirstName.Contains(filter.Keyword) || p.User.LastName.Contains(filter.Keyword))));

        if (!string.IsNullOrWhiteSpace(filter.Skill))
            query = query.Where(p => p.CandidateSkills.Any(cs => cs.Skill != null && cs.Skill.Name.Contains(filter.Skill)));

        var totalCount = await query.CountAsync(ct);
        var profiles = await query
            .OrderByDescending(p => p.UpdatedAt ?? p.CreatedAt)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync(ct);

        var items = profiles.Select(p => new CandidateSearchResultDto(
            p.Id,
            p.User?.FullName ?? string.Empty,
            p.User?.Email ?? string.Empty,
            p.Headline,
            p.Location,
            p.ExperienceYears,
            p.CandidateSkills.Select(cs => cs.Skill?.Name ?? string.Empty).Where(s => s.Length > 0).ToList())).ToList();

        return new PagedResult<CandidateSearchResultDto>
        {
            Items = items,
            Page = filter.Page,
            PageSize = filter.PageSize,
            TotalCount = totalCount,
        };
    }

    public async Task<IReadOnlyList<ApplicationReviewDto>> GetApplicationsForJobAsync(Guid recruiterId, Guid jobId, CancellationToken ct = default)
    {
        await EnsureOwnsJobAsync(recruiterId, jobId, ct);

        var applications = await _unitOfWork.JobApplications.Query()
            .Where(a => a.JobPostingId == jobId)
            .OrderByDescending(a => a.MatchScore)
            .ToListAsync(ct);

        return applications.Select(MapApplicationReview).ToList();
    }

    public async Task<IReadOnlyList<ApplicationReviewDto>> RankApplicationsForJobAsync(Guid recruiterId, Guid jobId, CancellationToken ct = default)
    {
        var job = await EnsureOwnsJobAsync(recruiterId, jobId, ct);
        var jobSkills = job.JobSkills
            .Where(js => js.Skill is not null)
            .GroupBy(js => js.Skill!.Name, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(g => g.Key, g => (g.First().IsRequired, g.First().Weight), StringComparer.OrdinalIgnoreCase);

        var applications = await _unitOfWork.JobApplications.Query()
            .Where(a => a.JobPostingId == jobId)
            .ToListAsync(ct);

        foreach (var app in applications)
        {
            var candidateSkills = app.CandidateProfile?.CandidateSkills
                .Where(cs => cs.Skill is not null)
                .GroupBy(cs => cs.Skill!.Name, StringComparer.OrdinalIgnoreCase)
                .ToDictionary(g => g.Key, g => g.Max(cs => cs.YearsOfExperience), StringComparer.OrdinalIgnoreCase)
                ?? new Dictionary<string, int>();

            var match = _matchingService.ScoreCandidate(candidateSkills, app.CandidateProfile?.ExperienceYears ?? 0, jobSkills, MatchingStrategyType.WeightedExperience);
            app.MatchScore = match.ScorePercent;
            _unitOfWork.JobApplications.Update(app);
        }

        await _unitOfWork.SaveChangesAsync(ct);

        return applications.OrderByDescending(a => a.MatchScore).Select(MapApplicationReview).ToList();
    }

    public async Task<ApplicationReviewDto> UpdateApplicationStatusAsync(Guid recruiterId, Guid applicationId, UpdateApplicationStatusRequest request, CancellationToken ct = default)
    {
        var application = await _unitOfWork.JobApplications.GetByIdAsync(applicationId, ct)
            ?? throw new NotFoundException(nameof(JobApplication), applicationId);

        if (application.JobPosting?.RecruiterId != recruiterId)
            throw new ForbiddenAppException("You can only manage applications for your own job postings.");

        if (!Enum.TryParse<ApplicationStatus>(request.Status, true, out var newStatus))
            throw new ValidationAppException($"'{request.Status}' is not a valid application status.");

        application.Status = newStatus;
        application.NextStep = request.Notes;
        application.StatusHistory.Add(new ApplicationStatusHistory
        {
            JobApplicationId = application.Id,
            Status = newStatus,
            Notes = request.Notes,
            ChangedByUserId = recruiterId,
        });

        _unitOfWork.JobApplications.Update(application);
        await _unitOfWork.SaveChangesAsync(ct);
        await _auditService.LogAsync("UpdateApplicationStatus", nameof(JobApplication), application.Id.ToString(), newStatus.ToString(), ct);

        if (application.CandidateProfile?.User is not null)
        {
            await _notificationService.NotifyAsync(new NotificationRequest(
                application.CandidateProfile.UserId,
                application.CandidateProfile.User.Email ?? string.Empty,
                application.CandidateProfile.User.PhoneNumber,
                NotificationType.ApplicationStatusChanged,
                NotificationChannel.Email,
                "Application Status Updated",
                $"Your application for {application.JobPosting?.Title} is now '{newStatus}'."), ct);
        }

        return MapApplicationReview(application);
    }

    public async Task<InterviewDto> ScheduleInterviewAsync(Guid recruiterId, ScheduleInterviewRequest request, CancellationToken ct = default)
    {
        var application = await _unitOfWork.JobApplications.GetByIdAsync(request.JobApplicationId, ct)
            ?? throw new NotFoundException(nameof(JobApplication), request.JobApplicationId);

        if (application.JobPosting?.RecruiterId != recruiterId)
            throw new ForbiddenAppException("You can only schedule interviews for your own job postings.");

        var interview = new Interview
        {
            JobApplicationId = application.Id,
            Type = Enum.TryParse<InterviewType>(request.Type, true, out var type) ? type : InterviewType.InitialScreen,
            ScheduledAt = request.ScheduledAt,
            DurationMinutes = request.DurationMinutes,
            InterviewerId = request.InterviewerId,
            Location = request.Location,
            MeetingLink = request.MeetingLink,
            Status = InterviewStatus.Scheduled,
        };

        await _unitOfWork.Interviews.AddAsync(interview, ct);

        application.Status = ApplicationStatus.Interview;
        application.NextStep = $"Interview scheduled for {request.ScheduledAt:yyyy-MM-dd HH:mm}";
        application.StatusHistory.Add(new ApplicationStatusHistory
        {
            JobApplicationId = application.Id,
            Status = ApplicationStatus.Interview,
            Notes = "Interview scheduled.",
            ChangedByUserId = recruiterId,
        });
        _unitOfWork.JobApplications.Update(application);

        await _unitOfWork.SaveChangesAsync(ct);
        await _auditService.LogAsync("ScheduleInterview", nameof(Interview), interview.Id.ToString(), null, ct);

        var attendees = new List<string>();
        if (application.CandidateProfile?.User?.Email is { } candidateEmail) attendees.Add(candidateEmail);

        await _calendarService.CreateEventAsync(new CalendarEventRequest(
            $"Interview: {application.JobPosting?.Title}",
            request.Location ?? request.MeetingLink,
            request.ScheduledAt,
            request.ScheduledAt.AddMinutes(request.DurationMinutes),
            attendees,
            request.Location), ct);

        if (application.CandidateProfile?.User is not null)
        {
            await _notificationService.NotifyAsync(new NotificationRequest(
                application.CandidateProfile.UserId,
                application.CandidateProfile.User.Email ?? string.Empty,
                application.CandidateProfile.User.PhoneNumber,
                NotificationType.InterviewScheduled,
                NotificationChannel.Email,
                "Interview Scheduled",
                $"An interview for {application.JobPosting?.Title} has been scheduled on {request.ScheduledAt:f}."), ct);
        }

        return await MapInterviewAsync(interview, ct);
    }

    public async Task<IReadOnlyList<InterviewDto>> GetInterviewsAsync(Guid recruiterId, CancellationToken ct = default)
    {
        var interviews = await _unitOfWork.Interviews.Query()
            .Where(i => i.JobApplication != null && i.JobApplication.JobPosting != null && i.JobApplication.JobPosting.RecruiterId == recruiterId)
            .OrderBy(i => i.ScheduledAt)
            .ToListAsync(ct);

        var results = new List<InterviewDto>();
        foreach (var interview in interviews)
            results.Add(await MapInterviewAsync(interview, ct));

        return results;
    }

    private async Task<JobPosting> EnsureOwnsJobAsync(Guid recruiterId, Guid jobId, CancellationToken ct)
    {
        var job = await _unitOfWork.JobPostings.GetByIdAsync(jobId, ct)
            ?? throw new NotFoundException(nameof(JobPosting), jobId);

        if (job.RecruiterId != recruiterId)
            throw new ForbiddenAppException("You can only manage jobs you have posted.");

        return job;
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

    private static Task<InterviewDto> MapInterviewAsync(Interview interview, CancellationToken ct)
    {
        return Task.FromResult(new InterviewDto(
            interview.Id,
            interview.JobApplicationId,
            interview.JobApplication?.CandidateProfile?.User?.FullName ?? string.Empty,
            interview.JobApplication?.JobPosting?.Title ?? string.Empty,
            interview.Type.ToString(),
            interview.Status.ToString(),
            interview.ScheduledAt,
            interview.DurationMinutes,
            interview.Location,
            interview.MeetingLink,
            interview.Interviewer?.FullName ?? string.Empty));
    }

    private static JobPostingDto MapJob(JobPosting job) => new(
        job.Id,
        job.Title,
        job.Description,
        job.Requirements,
        job.Department?.Name ?? string.Empty,
        job.Location,
        job.EmploymentType.ToString(),
        job.SalaryMin,
        job.SalaryMax,
        job.Status.ToString(),
        job.ClosingDate,
        job.CreatedAt,
        job.JobSkills.Select(js => js.Skill?.Name ?? string.Empty).Where(s => s.Length > 0).ToList(),
        job.Applications.Count);

    private static ApplicationReviewDto MapApplicationReview(JobApplication application) => new(
        application.Id,
        application.JobPostingId,
        application.JobPosting?.Title ?? string.Empty,
        application.CandidateProfileId,
        application.CandidateProfile?.User?.FullName ?? string.Empty,
        application.CandidateProfile?.User?.Email ?? string.Empty,
        application.Status.ToString(),
        application.MatchScore,
        Array.Empty<string>(),
        Array.Empty<string>(),
        application.CoverLetter,
        application.ResumeId,
        application.CreatedAt);
}
