using TalentSphere.Domain.Common;
using TalentSphere.Domain.Enums;

namespace TalentSphere.Domain.Entities;

public class Interview : BaseEntity
{
    public Guid JobApplicationId { get; set; }
    public virtual JobApplication? JobApplication { get; set; }

    public InterviewType Type { get; set; }
    public InterviewStatus Status { get; set; } = InterviewStatus.Scheduled;
    public DateTime ScheduledAt { get; set; }
    public int DurationMinutes { get; set; } = 30;
    public string? Location { get; set; }
    public string? MeetingLink { get; set; }
    public string? Notes { get; set; }

    public Guid InterviewerId { get; set; }
    public virtual ApplicationUser? Interviewer { get; set; }

    public virtual ICollection<InterviewFeedback> Feedbacks { get; set; } = new List<InterviewFeedback>();
}

public class InterviewFeedback : BaseEntity
{
    public Guid InterviewId { get; set; }
    public virtual Interview? Interview { get; set; }

    public Guid EvaluatorId { get; set; }
    public virtual ApplicationUser? Evaluator { get; set; }

    public int TechnicalScore { get; set; }
    public int CommunicationScore { get; set; }
    public int CultureFitScore { get; set; }
    public int OverallScore { get; set; }
    public string? Comments { get; set; }
    public string? Recommendation { get; set; }
}
