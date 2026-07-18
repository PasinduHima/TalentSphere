using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TalentSphere.Application.Common.Models;
using TalentSphere.Application.DTOs.Recruiter;
using TalentSphere.Application.Interfaces.AppServices;
using TalentSphere.Domain.Enums;

namespace TalentSphere.API.Controllers;

[Authorize(Roles = nameof(UserRole.Recruiter))]
[Route("api/recruiter")]
public class RecruiterController : ApiControllerBase
{
    private readonly IRecruiterService _recruiterService;

    public RecruiterController(IRecruiterService recruiterService)
    {
        _recruiterService = recruiterService;
    }

    [HttpGet("departments")]
    public async Task<ActionResult<IReadOnlyList<DepartmentOptionDto>>> GetDepartments(CancellationToken ct) =>
        Ok(await _recruiterService.GetDepartmentOptionsAsync(ct));

    [HttpGet("interviewers")]
    public async Task<ActionResult<IReadOnlyList<InterviewerOptionDto>>> GetInterviewers(CancellationToken ct) =>
        Ok(await _recruiterService.GetInterviewerOptionsAsync(ct));

    [HttpPost("jobs")]
    public async Task<ActionResult<JobPostingDto>> CreateJob([FromBody] CreateJobRequest request, CancellationToken ct) =>
        Ok(await _recruiterService.CreateJobAsync(CurrentUserId, request, ct));

    [HttpPut("jobs/{jobId:guid}")]
    public async Task<ActionResult<JobPostingDto>> UpdateJob(Guid jobId, [FromBody] UpdateJobRequest request, CancellationToken ct) =>
        Ok(await _recruiterService.UpdateJobAsync(CurrentUserId, jobId, request, ct));

    [HttpGet("jobs")]
    public async Task<ActionResult<IReadOnlyList<JobPostingDto>>> GetMyJobs(CancellationToken ct) =>
        Ok(await _recruiterService.GetMyJobsAsync(CurrentUserId, ct));

    [HttpDelete("jobs/{jobId:guid}")]
    public async Task<IActionResult> DeleteJob(Guid jobId, CancellationToken ct)
    {
        await _recruiterService.DeleteJobAsync(CurrentUserId, jobId, ct);
        return NoContent();
    }

    [HttpGet("candidates")]
    public async Task<ActionResult<PagedResult<CandidateSearchResultDto>>> SearchCandidates([FromQuery] CandidateSearchFilter filter, CancellationToken ct) =>
        Ok(await _recruiterService.SearchCandidatesAsync(filter, ct));

    [HttpGet("jobs/{jobId:guid}/applications")]
    public async Task<ActionResult<IReadOnlyList<ApplicationReviewDto>>> GetApplications(Guid jobId, CancellationToken ct) =>
        Ok(await _recruiterService.GetApplicationsForJobAsync(CurrentUserId, jobId, ct));

    [HttpPost("jobs/{jobId:guid}/applications/rank")]
    public async Task<ActionResult<IReadOnlyList<ApplicationReviewDto>>> RankApplications(Guid jobId, CancellationToken ct) =>
        Ok(await _recruiterService.RankApplicationsForJobAsync(CurrentUserId, jobId, ct));

    [HttpPut("applications/{applicationId:guid}/status")]
    public async Task<ActionResult<ApplicationReviewDto>> UpdateApplicationStatus(Guid applicationId, [FromBody] UpdateApplicationStatusRequest request, CancellationToken ct) =>
        Ok(await _recruiterService.UpdateApplicationStatusAsync(CurrentUserId, applicationId, request, ct));

    [HttpPost("interviews")]
    public async Task<ActionResult<InterviewDto>> ScheduleInterview([FromBody] ScheduleInterviewRequest request, CancellationToken ct) =>
        Ok(await _recruiterService.ScheduleInterviewAsync(CurrentUserId, request, ct));

    [HttpGet("interviews")]
    public async Task<ActionResult<IReadOnlyList<InterviewDto>>> GetInterviews(CancellationToken ct) =>
        Ok(await _recruiterService.GetInterviewsAsync(CurrentUserId, ct));
}
