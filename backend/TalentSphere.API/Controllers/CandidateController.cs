using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TalentSphere.Application.Common.Models;
using TalentSphere.Application.DTOs.Candidate;
using TalentSphere.Application.Interfaces.AppServices;
using TalentSphere.Domain.Enums;

namespace TalentSphere.API.Controllers;

[Authorize(Roles = nameof(UserRole.Candidate))]
[Route("api/candidate")]
public class CandidateController : ApiControllerBase
{
    private readonly ICandidateService _candidateService;

    public CandidateController(ICandidateService candidateService)
    {
        _candidateService = candidateService;
    }

    [HttpGet("profile")]
    public async Task<ActionResult<CandidateProfileDto>> GetProfile(CancellationToken ct) =>
        Ok(await _candidateService.GetProfileAsync(CurrentUserId, ct));

    [HttpPut("profile")]
    public async Task<ActionResult<CandidateProfileDto>> UpdateProfile([FromBody] UpdateCandidateProfileRequest request, CancellationToken ct) =>
        Ok(await _candidateService.UpdateProfileAsync(CurrentUserId, request, ct));

    [HttpPost("resumes")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<ActionResult<ResumeDto>> UploadResume(IFormFile file, CancellationToken ct)
    {
        if (file.Length == 0)
            return BadRequest("A non-empty resume file must be provided.");

        await using var stream = file.OpenReadStream();
        var result = await _candidateService.UploadResumeAsync(CurrentUserId, stream, file.FileName, file.ContentType, ct);
        return Ok(result);
    }

    [HttpGet("resumes")]
    public async Task<ActionResult<IReadOnlyList<ResumeDto>>> GetResumes(CancellationToken ct) =>
        Ok(await _candidateService.GetResumesAsync(CurrentUserId, ct));

    [HttpPut("resumes/{resumeId:guid}/primary")]
    public async Task<IActionResult> SetPrimaryResume(Guid resumeId, CancellationToken ct)
    {
        await _candidateService.SetPrimaryResumeAsync(CurrentUserId, resumeId, ct);
        return NoContent();
    }

    [HttpDelete("resumes/{resumeId:guid}")]
    public async Task<IActionResult> DeleteResume(Guid resumeId, CancellationToken ct)
    {
        await _candidateService.DeleteResumeAsync(CurrentUserId, resumeId, ct);
        return NoContent();
    }

    [HttpGet("jobs")]
    public async Task<ActionResult<PagedResult<JobSearchResultDto>>> SearchJobs([FromQuery] JobSearchFilter filter, CancellationToken ct) =>
        Ok(await _candidateService.SearchJobsAsync(CurrentUserId, filter, ct));

    [HttpGet("jobs/{jobId:guid}")]
    public async Task<ActionResult<JobDetailDto>> GetJob(Guid jobId, CancellationToken ct) =>
        Ok(await _candidateService.GetJobDetailAsync(CurrentUserId, jobId, ct));

    [HttpGet("jobs/recommended")]
    public async Task<ActionResult<IReadOnlyList<JobSearchResultDto>>> GetRecommendedJobs([FromQuery] int take = 10, CancellationToken ct = default) =>
        Ok(await _candidateService.GetRecommendedJobsAsync(CurrentUserId, take, ct));

    [HttpPost("applications")]
    public async Task<ActionResult<ApplicationDto>> Apply([FromBody] ApplyToJobRequest request, CancellationToken ct) =>
        Ok(await _candidateService.ApplyToJobAsync(CurrentUserId, request, ct));

    [HttpGet("applications")]
    public async Task<ActionResult<IReadOnlyList<ApplicationDto>>> GetApplications(CancellationToken ct) =>
        Ok(await _candidateService.GetApplicationsAsync(CurrentUserId, ct));
}
