using TalentSphere.Domain.Entities;

namespace TalentSphere.Application.Interfaces.Repositories;

/// <summary>
/// Unit of Work Pattern: coordinates repositories that share a single EF Core
/// DbContext/transaction so a request either commits or rolls back as one unit.
/// </summary>
public interface IUnitOfWork
{
    IGenericRepository<Organization> Organizations { get; }
    IGenericRepository<Department> Departments { get; }
    IGenericRepository<CandidateProfile> CandidateProfiles { get; }
    IGenericRepository<Skill> Skills { get; }
    IGenericRepository<CandidateSkill> CandidateSkills { get; }
    IGenericRepository<Resume> Resumes { get; }
    IGenericRepository<JobPosting> JobPostings { get; }
    IGenericRepository<JobSkill> JobSkills { get; }
    IGenericRepository<JobApplication> JobApplications { get; }
    IGenericRepository<ApplicationStatusHistory> ApplicationStatusHistories { get; }
    IGenericRepository<Interview> Interviews { get; }
    IGenericRepository<InterviewFeedback> InterviewFeedbacks { get; }
    IGenericRepository<HiringDecisionRecord> HiringDecisionRecords { get; }
    IGenericRepository<AuditLog> AuditLogs { get; }
    IGenericRepository<Notification> Notifications { get; }
    IGenericRepository<RefreshToken> RefreshTokens { get; }

    Task<int> SaveChangesAsync(CancellationToken ct = default);
    Task<IDisposable> BeginTransactionAsync(CancellationToken ct = default);
}
