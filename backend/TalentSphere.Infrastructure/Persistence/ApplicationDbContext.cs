using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TalentSphere.Domain.Entities;

namespace TalentSphere.Infrastructure.Persistence;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Organization> Organizations => Set<Organization>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<CandidateProfile> CandidateProfiles => Set<CandidateProfile>();
    public DbSet<Skill> Skills => Set<Skill>();
    public DbSet<CandidateSkill> CandidateSkills => Set<CandidateSkill>();
    public DbSet<Resume> Resumes => Set<Resume>();
    public DbSet<JobPosting> JobPostings => Set<JobPosting>();
    public DbSet<JobSkill> JobSkills => Set<JobSkill>();
    public DbSet<JobApplication> JobApplications => Set<JobApplication>();
    public DbSet<ApplicationStatusHistory> ApplicationStatusHistories => Set<ApplicationStatusHistory>();
    public DbSet<Interview> Interviews => Set<Interview>();
    public DbSet<InterviewFeedback> InterviewFeedbacks => Set<InterviewFeedback>();
    public DbSet<HiringDecisionRecord> HiringDecisionRecords => Set<HiringDecisionRecord>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ApplicationUser>(entity =>
        {
            entity.HasOne(u => u.Department)
                .WithMany(d => d.Users)
                .HasForeignKey(u => u.DepartmentId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(u => u.CandidateProfile)
                .WithOne(p => p.User)
                .HasForeignKey<CandidateProfile>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Department>()
            .HasOne(d => d.Organization)
            .WithMany(o => o.Departments)
            .HasForeignKey(d => d.OrganizationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<CandidateSkill>(entity =>
        {
            entity.HasKey(cs => new { cs.CandidateProfileId, cs.SkillId });
            entity.HasOne(cs => cs.CandidateProfile)
                .WithMany(p => p.CandidateSkills)
                .HasForeignKey(cs => cs.CandidateProfileId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(cs => cs.Skill)
                .WithMany(s => s.CandidateSkills)
                .HasForeignKey(cs => cs.SkillId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<JobSkill>(entity =>
        {
            entity.HasKey(js => new { js.JobPostingId, js.SkillId });
            entity.HasOne(js => js.JobPosting)
                .WithMany(j => j.JobSkills)
                .HasForeignKey(js => js.JobPostingId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(js => js.Skill)
                .WithMany(s => s.JobSkills)
                .HasForeignKey(js => js.SkillId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<JobPosting>(entity =>
        {
            entity.Property(j => j.SalaryMin).HasColumnType("decimal(18,2)");
            entity.Property(j => j.SalaryMax).HasColumnType("decimal(18,2)");

            entity.HasOne(j => j.Department)
                .WithMany(d => d.JobPostings)
                .HasForeignKey(j => j.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(j => j.Recruiter)
                .WithMany()
                .HasForeignKey(j => j.RecruiterId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<JobApplication>(entity =>
        {
            entity.HasOne(a => a.JobPosting)
                .WithMany(j => j.Applications)
                .HasForeignKey(a => a.JobPostingId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(a => a.CandidateProfile)
                .WithMany(p => p.Applications)
                .HasForeignKey(a => a.CandidateProfileId)
                .OnDelete(DeleteBehavior.Cascade);

            // ClientSetNull (not SetNull): a candidate profile cascades to both its
            // JobApplications and its Resumes, so a DB-level cascading SetNull here
            // would create a second cascade path into JobApplications and SQL
            // Server rejects that. ClientSetNull keeps the same in-memory behavior
            // for tracked entities while generating NO ACTION at the DB level.
            entity.HasOne(a => a.Resume)
                .WithMany()
                .HasForeignKey(a => a.ResumeId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasIndex(a => new { a.JobPostingId, a.CandidateProfileId }).IsUnique();
        });

        builder.Entity<ApplicationStatusHistory>()
            .HasOne(h => h.JobApplication)
            .WithMany(a => a.StatusHistory)
            .HasForeignKey(h => h.JobApplicationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Interview>(entity =>
        {
            entity.HasOne(i => i.JobApplication)
                .WithMany(a => a.Interviews)
                .HasForeignKey(i => i.JobApplicationId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(i => i.Interviewer)
                .WithMany()
                .HasForeignKey(i => i.InterviewerId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<InterviewFeedback>(entity =>
        {
            entity.HasOne(f => f.Interview)
                .WithMany(i => i.Feedbacks)
                .HasForeignKey(f => f.InterviewId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(f => f.Evaluator)
                .WithMany()
                .HasForeignKey(f => f.EvaluatorId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<HiringDecisionRecord>(entity =>
        {
            entity.HasOne(r => r.JobApplication)
                .WithOne(a => a.HiringDecisionRecord)
                .HasForeignKey<HiringDecisionRecord>(r => r.JobApplicationId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(r => r.DecidedBy)
                .WithMany()
                .HasForeignKey(r => r.DecidedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<RefreshToken>()
            .HasOne(t => t.User)
            .WithMany(u => u.RefreshTokens)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Notification>()
            .HasOne(n => n.User)
            .WithMany()
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Skill>().HasIndex(s => s.Name).IsUnique();
        builder.Entity<AuditLog>().HasIndex(a => a.Timestamp);
    }
}
