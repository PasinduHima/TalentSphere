using TalentSphere.Application.DTOs.HiringManager;

namespace TalentSphere.Application.Interfaces.AppServices;

public interface IHiringManagerService
{
    Task<IReadOnlyList<ShortlistedCandidateDto>> GetShortlistedCandidatesAsync(CancellationToken ct = default);
    Task<InterviewFeedbackDto> SubmitFeedbackAsync(Guid evaluatorId, SubmitFeedbackRequest request, CancellationToken ct = default);
    Task<IReadOnlyList<InterviewFeedbackDto>> GetFeedbackForApplicationAsync(Guid applicationId, CancellationToken ct = default);
    Task<HiringDecisionDto> RecordDecisionAsync(Guid decidedByUserId, HiringDecisionRequest request, CancellationToken ct = default);
    Task<IReadOnlyList<HiringDecisionDto>> GetDecisionsAsync(CancellationToken ct = default);

    Task<IReadOnlyList<GeneratedInterviewQuestionDto>> GenerateInterviewQuestionsAsync(GenerateInterviewQuestionsRequest request, CancellationToken ct = default);
}
