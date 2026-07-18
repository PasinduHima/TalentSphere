using TalentSphere.Application.Common.Models;
using TalentSphere.Application.DTOs.Recruiter;

namespace TalentSphere.Application.Interfaces.AppServices;

public class CandidateSearchFilter : PaginationParams
{
    public string? Keyword { get; set; }
    public string? Skill { get; set; }
}

public record DepartmentOptionDto(Guid Id, string Name);
public record InterviewerOptionDto(Guid Id, string FullName, string Role);

public interface IRecruiterService
{
    Task<IReadOnlyList<DepartmentOptionDto>> GetDepartmentOptionsAsync(CancellationToken ct = default);
    Task<IReadOnlyList<InterviewerOptionDto>> GetInterviewerOptionsAsync(CancellationToken ct = default);

    Task<JobPostingDto> CreateJobAsync(Guid recruiterId, CreateJobRequest request, CancellationToken ct = default);
    Task<JobPostingDto> UpdateJobAsync(Guid recruiterId, Guid jobId, UpdateJobRequest request, CancellationToken ct = default);
    Task<IReadOnlyList<JobPostingDto>> GetMyJobsAsync(Guid recruiterId, CancellationToken ct = default);
    Task DeleteJobAsync(Guid recruiterId, Guid jobId, CancellationToken ct = default);

    Task<PagedResult<CandidateSearchResultDto>> SearchCandidatesAsync(CandidateSearchFilter filter, CancellationToken ct = default);

    Task<IReadOnlyList<ApplicationReviewDto>> GetApplicationsForJobAsync(Guid recruiterId, Guid jobId, CancellationToken ct = default);
    Task<IReadOnlyList<ApplicationReviewDto>> RankApplicationsForJobAsync(Guid recruiterId, Guid jobId, CancellationToken ct = default);
    Task<ApplicationReviewDto> UpdateApplicationStatusAsync(Guid recruiterId, Guid applicationId, UpdateApplicationStatusRequest request, CancellationToken ct = default);

    Task<InterviewDto> ScheduleInterviewAsync(Guid recruiterId, ScheduleInterviewRequest request, CancellationToken ct = default);
    Task<IReadOnlyList<InterviewDto>> GetInterviewsAsync(Guid recruiterId, CancellationToken ct = default);
}
