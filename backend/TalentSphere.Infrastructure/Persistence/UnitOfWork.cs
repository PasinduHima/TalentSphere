using Microsoft.EntityFrameworkCore.Storage;
using TalentSphere.Application.Interfaces.Repositories;
using TalentSphere.Domain.Entities;

namespace TalentSphere.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
        Organizations = new GenericRepository<Organization>(context);
        Departments = new GenericRepository<Department>(context);
        CandidateProfiles = new GenericRepository<CandidateProfile>(context);
        Skills = new GenericRepository<Skill>(context);
        CandidateSkills = new GenericRepository<CandidateSkill>(context);
        Resumes = new GenericRepository<Resume>(context);
        JobPostings = new GenericRepository<JobPosting>(context);
        JobSkills = new GenericRepository<JobSkill>(context);
        JobApplications = new GenericRepository<JobApplication>(context);
        ApplicationStatusHistories = new GenericRepository<ApplicationStatusHistory>(context);
        Interviews = new GenericRepository<Interview>(context);
        InterviewFeedbacks = new GenericRepository<InterviewFeedback>(context);
        HiringDecisionRecords = new GenericRepository<HiringDecisionRecord>(context);
        AuditLogs = new GenericRepository<AuditLog>(context);
        Notifications = new GenericRepository<Notification>(context);
        RefreshTokens = new GenericRepository<RefreshToken>(context);
    }

    public IGenericRepository<Organization> Organizations { get; }
    public IGenericRepository<Department> Departments { get; }
    public IGenericRepository<CandidateProfile> CandidateProfiles { get; }
    public IGenericRepository<Skill> Skills { get; }
    public IGenericRepository<CandidateSkill> CandidateSkills { get; }
    public IGenericRepository<Resume> Resumes { get; }
    public IGenericRepository<JobPosting> JobPostings { get; }
    public IGenericRepository<JobSkill> JobSkills { get; }
    public IGenericRepository<JobApplication> JobApplications { get; }
    public IGenericRepository<ApplicationStatusHistory> ApplicationStatusHistories { get; }
    public IGenericRepository<Interview> Interviews { get; }
    public IGenericRepository<InterviewFeedback> InterviewFeedbacks { get; }
    public IGenericRepository<HiringDecisionRecord> HiringDecisionRecords { get; }
    public IGenericRepository<AuditLog> AuditLogs { get; }
    public IGenericRepository<Notification> Notifications { get; }
    public IGenericRepository<RefreshToken> RefreshTokens { get; }

    public Task<int> SaveChangesAsync(CancellationToken ct = default) => _context.SaveChangesAsync(ct);

    public async Task<IDisposable> BeginTransactionAsync(CancellationToken ct = default)
    {
        IDbContextTransaction transaction = await _context.Database.BeginTransactionAsync(ct);
        return transaction;
    }
}
