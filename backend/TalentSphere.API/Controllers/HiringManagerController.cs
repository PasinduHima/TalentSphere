using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TalentSphere.Application.DTOs.HiringManager;
using TalentSphere.Application.Interfaces.AppServices;
using TalentSphere.Domain.Enums;

namespace TalentSphere.API.Controllers;

[Authorize(Roles = nameof(UserRole.HiringManager))]
[Route("api/hiring-manager")]
public class HiringManagerController : ApiControllerBase
{
    private readonly IHiringManagerService _hiringManagerService;

    public HiringManagerController(IHiringManagerService hiringManagerService)
    {
        _hiringManagerService = hiringManagerService;
    }

    [HttpGet("shortlisted")]
    public async Task<ActionResult<IReadOnlyList<ShortlistedCandidateDto>>> GetShortlisted(CancellationToken ct) =>
        Ok(await _hiringManagerService.GetShortlistedCandidatesAsync(ct));

    [HttpPost("feedback")]
    public async Task<ActionResult<InterviewFeedbackDto>> SubmitFeedback([FromBody] SubmitFeedbackRequest request, CancellationToken ct) =>
        Ok(await _hiringManagerService.SubmitFeedbackAsync(CurrentUserId, request, ct));

    [HttpGet("applications/{applicationId:guid}/feedback")]
    public async Task<ActionResult<IReadOnlyList<InterviewFeedbackDto>>> GetFeedback(Guid applicationId, CancellationToken ct) =>
        Ok(await _hiringManagerService.GetFeedbackForApplicationAsync(applicationId, ct));

    [HttpPost("decisions")]
    public async Task<ActionResult<HiringDecisionDto>> RecordDecision([FromBody] HiringDecisionRequest request, CancellationToken ct) =>
        Ok(await _hiringManagerService.RecordDecisionAsync(CurrentUserId, request, ct));

    [HttpGet("decisions")]
    public async Task<ActionResult<IReadOnlyList<HiringDecisionDto>>> GetDecisions(CancellationToken ct) =>
        Ok(await _hiringManagerService.GetDecisionsAsync(ct));
}
