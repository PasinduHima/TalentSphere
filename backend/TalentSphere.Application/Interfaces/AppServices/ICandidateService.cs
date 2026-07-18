using TalentSphere.Application.Common.Models;
using TalentSphere.Application.DTOs.Candidate;

namespace TalentSphere.Application.Interfaces.AppServices;

public class JobSearchFilter : PaginationParams
{
    public string? Keyword { get; set; }
    public string? Location { get; set; }
    public string? EmploymentType { get; set; }
}

public interface ICandidateService
{
    Task<CandidateProfileDto> GetProfileAsync(Guid userId, CancellationToken ct = default);
    Task<CandidateProfileDto> UpdateProfileAsync(Guid userId, UpdateCandidateProfileRequest request, CancellationToken ct = default);

    Task<ResumeDto> UploadResumeAsync(Guid userId, Stream fileContent, string fileName, string contentType, CancellationToken ct = default);
    Task<IReadOnlyList<ResumeDto>> GetResumesAsync(Guid userId, CancellationToken ct = default);
    Task SetPrimaryResumeAsync(Guid userId, Guid resumeId, CancellationToken ct = default);
    Task DeleteResumeAsync(Guid userId, Guid resumeId, CancellationToken ct = default);

    Task<PagedResult<JobSearchResultDto>> SearchJobsAsync(Guid userId, JobSearchFilter filter, CancellationToken ct = default);
    Task<JobDetailDto> GetJobDetailAsync(Guid userId, Guid jobId, CancellationToken ct = default);
    Task<IReadOnlyList<JobSearchResultDto>> GetRecommendedJobsAsync(Guid userId, int take = 10, CancellationToken ct = default);

    Task<ApplicationDto> ApplyToJobAsync(Guid userId, ApplyToJobRequest request, CancellationToken ct = default);
    Task<IReadOnlyList<ApplicationDto>> GetApplicationsAsync(Guid userId, CancellationToken ct = default);
}
