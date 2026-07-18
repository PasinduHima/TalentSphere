using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TalentSphere.Application.Common.Exceptions;
using TalentSphere.Application.DTOs.HiringManager;
using TalentSphere.Application.Interfaces.AppServices;
using TalentSphere.Application.Interfaces.Repositories;
using TalentSphere.Application.Interfaces.Services;
using TalentSphere.Domain.Entities;
using TalentSphere.Domain.Enums;

namespace TalentSphere.Application.Services;

public class HiringManagerService : IHiringManagerService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IAuditService _auditService;
    private readonly INotificationService _notificationService;
    private readonly UserManager<ApplicationUser> _userManager;

    public HiringManagerService(IUnitOfWork unitOfWork, IAuditService auditService, INotificationService notificationService, UserManager<ApplicationUser> userManager)
    {
        _unitOfWork = unitOfWork;
        _auditService = auditService;
        _notificationService = notificationService;
        _userManager = userManager;
    }

    public async Task<IReadOnlyList<ShortlistedCandidateDto>> GetShortlistedCandidatesAsync(CancellationToken ct = default)
    {
        var applications = await _unitOfWork.JobApplications.Query()
            .Where(a => a.Status == ApplicationStatus.Interview || a.Status == ApplicationStatus.Offer)
            .OrderByDescending(a => a.MatchScore)
            .ToListAsync(ct);

        return applications.Select(a => new ShortlistedCandidateDto(
            a.Id,
            a.CandidateProfile?.User?.FullName ?? string.Empty,
            a.JobPosting?.Title ?? string.Empty,
            a.MatchScore,
            a.Status.ToString(),
            a.CreatedAt,
            a.Interviews.Select(i => new InterviewSummaryDto(i.Id, i.Type.ToString(), i.Status.ToString(), i.ScheduledAt)).ToList(),
            a.Interviews.SelectMany(i => i.Feedbacks).Select(f => new InterviewFeedbackSummaryDto(
                f.Id, f.Evaluator?.FullName ?? string.Empty, f.OverallScore, f.Recommendation, f.CreatedAt)).ToList())).ToList();
    }

    public async Task<InterviewFeedbackDto> SubmitFeedbackAsync(Guid evaluatorId, SubmitFeedbackRequest request, CancellationToken ct = default)
    {
        var interview = await _unitOfWork.Interviews.GetByIdAsync(request.InterviewId, ct)
            ?? throw new NotFoundException(nameof(Interview), request.InterviewId);

        var overall = (int)Math.Round((request.TechnicalScore + request.CommunicationScore + request.CultureFitScore) / 3.0);

        var feedback = new InterviewFeedback
        {
            InterviewId = interview.Id,
            EvaluatorId = evaluatorId,
            TechnicalScore = request.TechnicalScore,
            CommunicationScore = request.CommunicationScore,
            CultureFitScore = request.CultureFitScore,
            OverallScore = overall,
            Comments = request.Comments,
            Recommendation = request.Recommendation,
        };

        await _unitOfWork.InterviewFeedbacks.AddAsync(feedback, ct);

        interview.Status = InterviewStatus.Completed;
        _unitOfWork.Interviews.Update(interview);

        await _unitOfWork.SaveChangesAsync(ct);
        await _auditService.LogAsync("SubmitInterviewFeedback", nameof(InterviewFeedback), feedback.Id.ToString(), null, ct);

        // feedback was created via `new InterviewFeedback()`, not materialized by a
        // query, so it isn't a lazy-loading proxy and .Evaluator won't lazy-load.
        var evaluator = await _userManager.FindByIdAsync(evaluatorId.ToString());

        return new InterviewFeedbackDto(
            feedback.Id, feedback.InterviewId, evaluator?.FullName ?? string.Empty,
            feedback.TechnicalScore, feedback.CommunicationScore, feedback.CultureFitScore, feedback.OverallScore,
            feedback.Comments, feedback.Recommendation, feedback.CreatedAt);
    }

    public async Task<IReadOnlyList<InterviewFeedbackDto>> GetFeedbackForApplicationAsync(Guid applicationId, CancellationToken ct = default)
    {
        var application = await _unitOfWork.JobApplications.GetByIdAsync(applicationId, ct)
            ?? throw new NotFoundException(nameof(JobApplication), applicationId);

        return application.Interviews.SelectMany(i => i.Feedbacks).Select(f => new InterviewFeedbackDto(
            f.Id, f.InterviewId, f.Evaluator?.FullName ?? string.Empty,
            f.TechnicalScore, f.CommunicationScore, f.CultureFitScore, f.OverallScore,
            f.Comments, f.Recommendation, f.CreatedAt)).ToList();
    }

    public async Task<HiringDecisionDto> RecordDecisionAsync(Guid decidedByUserId, HiringDecisionRequest request, CancellationToken ct = default)
    {
        var application = await _unitOfWork.JobApplications.GetByIdAsync(request.JobApplicationId, ct)
            ?? throw new NotFoundException(nameof(JobApplication), request.JobApplicationId);

        if (!Enum.TryParse<HiringDecisionType>(request.Decision, true, out var decisionType))
            throw new ValidationAppException($"'{request.Decision}' is not a valid hiring decision.");

        var record = new HiringDecisionRecord
        {
            JobApplicationId = application.Id,
            DecidedByUserId = decidedByUserId,
            Decision = decisionType,
            Notes = request.Notes,
        };
        await _unitOfWork.HiringDecisionRecords.AddAsync(record, ct);

        application.Status = decisionType switch
        {
            HiringDecisionType.ExtendOffer => ApplicationStatus.Offer,
            HiringDecisionType.Reject => ApplicationStatus.Rejected,
            _ => application.Status,
        };
        await _unitOfWork.ApplicationStatusHistories.AddAsync(new ApplicationStatusHistory
        {
            JobApplicationId = application.Id,
            Status = application.Status,
            Notes = $"Hiring decision recorded: {decisionType}",
            ChangedByUserId = decidedByUserId,
        }, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        await _auditService.LogAsync("RecordHiringDecision", nameof(HiringDecisionRecord), record.Id.ToString(), decisionType.ToString(), ct);

        if (application.CandidateProfile?.User is not null)
        {
            await _notificationService.NotifyAsync(new NotificationRequest(
                application.CandidateProfile.UserId,
                application.CandidateProfile.User.Email ?? string.Empty,
                application.CandidateProfile.User.PhoneNumber,
                NotificationType.ApplicationStatusChanged,
                NotificationChannel.Email,
                "Hiring Decision Update",
                $"A decision has been made regarding your application for {application.JobPosting?.Title}: {decisionType}."), ct);
        }

        // record was created via `new HiringDecisionRecord()`, not materialized by
        // a query, so it isn't a lazy-loading proxy and .DecidedBy won't lazy-load.
        var decidedByUser = await _userManager.FindByIdAsync(decidedByUserId.ToString());

        return new HiringDecisionDto(
            record.Id, application.Id,
            application.CandidateProfile?.User?.FullName ?? string.Empty,
            application.JobPosting?.Title ?? string.Empty,
            decisionType.ToString(), record.Notes,
            decidedByUser?.FullName ?? string.Empty,
            record.DecidedAt);
    }

    public async Task<IReadOnlyList<HiringDecisionDto>> GetDecisionsAsync(CancellationToken ct = default)
    {
        var records = await _unitOfWork.HiringDecisionRecords.Query()
            .OrderByDescending(r => r.DecidedAt)
            .ToListAsync(ct);

        return records.Select(record => new HiringDecisionDto(
            record.Id, record.JobApplicationId,
            record.JobApplication?.CandidateProfile?.User?.FullName ?? string.Empty,
            record.JobApplication?.JobPosting?.Title ?? string.Empty,
            record.Decision.ToString(), record.Notes,
            record.DecidedBy?.FullName ?? string.Empty,
            record.DecidedAt)).ToList();
    }
}
