namespace TalentSphere.Domain.Enums;

public enum UserRole
{
    Candidate = 0,
    Recruiter = 1,
    HiringManager = 2,
    Admin = 3,
}

public enum UserStatus
{
    Active = 0,
    Offline = 1,
    Suspended = 2,
}

public enum JobStatus
{
    Draft = 0,
    Active = 1,
    Paused = 2,
    Closed = 3,
}

public enum EmploymentType
{
    FullTime = 0,
    PartTime = 1,
    Contract = 2,
    Internship = 3,
}

public enum ApplicationStatus
{
    Applied = 0,
    Screening = 1,
    Interview = 2,
    Offer = 3,
    Hired = 4,
    Rejected = 5,
}

public enum InterviewType
{
    InitialScreen = 0,
    Technical = 1,
    CulturalFit = 2,
    Final = 3,
}

public enum InterviewStatus
{
    Scheduled = 0,
    Completed = 1,
    Cancelled = 2,
    NoShow = 3,
}

public enum HiringDecisionType
{
    ExtendOffer = 0,
    PutOnHold = 1,
    Reject = 2,
}

public enum ProficiencyLevel
{
    Beginner = 0,
    Intermediate = 1,
    Advanced = 2,
    Expert = 3,
}

public enum NotificationType
{
    ApplicationStatusChanged = 0,
    InterviewScheduled = 1,
    InterviewReminder = 2,
    JobRecommendation = 3,
    Message = 4,
    System = 5,
}

public enum NotificationChannel
{
    Email = 0,
    Sms = 1,
    InApp = 2,
}
