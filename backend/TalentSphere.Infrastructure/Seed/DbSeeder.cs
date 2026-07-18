using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using TalentSphere.Domain.Entities;
using TalentSphere.Domain.Enums;
using TalentSphere.Infrastructure.Persistence;

namespace TalentSphere.Infrastructure.Seed;

/// <summary>
/// Seeds Identity roles plus a minimal demo dataset (organization, departments,
/// an account per role, sample skills and a job posting) so the API and the
/// existing TalentSphere React frontend have data to exercise on first run.
/// </summary>
public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        var logger = services.GetRequiredService<ILoggerFactory>().CreateLogger("DbSeeder");

        await context.Database.MigrateAsync();

        foreach (var role in Enum.GetNames<UserRole>())
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
        }

        if (await context.Organizations.AnyAsync()) return;

        var organization = new Organization { Name = "NSBM Talent Consulting", Industry = "Human Resources", Website = "https://talentsphere.example.com" };
        var engineering = new Department { Name = "Engineering", Organization = organization };
        var product = new Department { Name = "Product", Organization = organization };
        var hr = new Department { Name = "Human Resources", Organization = organization };
        await context.Organizations.AddAsync(organization);
        await context.Departments.AddRangeAsync(engineering, product, hr);
        await context.SaveChangesAsync();

        var admin = await CreateUserAsync(userManager, "admin@talentsphere.local", "Admin@12345", "Ava", "Admin", UserRole.Admin, hr.Id);
        var recruiter = await CreateUserAsync(userManager, "recruiter@talentsphere.local", "Recruiter@12345", "Riya", "Recruiter", UserRole.Recruiter, engineering.Id);
        var hiringManager = await CreateUserAsync(userManager, "manager@talentsphere.local", "Manager@12345", "Marcus", "Manager", UserRole.HiringManager, engineering.Id);
        var candidate = await CreateUserAsync(userManager, "candidate@talentsphere.local", "Candidate@12345", "Casey", "Candidate", UserRole.Candidate, null);

        if (candidate is not null)
        {
            await context.CandidateProfiles.AddAsync(new CandidateProfile
            {
                UserId = candidate.Id,
                Headline = "Full-Stack Developer",
                Summary = "Detail-oriented engineer with experience across the MERN and .NET stacks.",
                Location = "Colombo, Sri Lanka",
                ExperienceYears = 3,
                ProfileCompletionPercent = 60,
            });
        }

        var skillNames = new[] { "C#", "React", "SQL Server", "ASP.NET Core", "Docker", "Azure", "TypeScript" };
        var skills = skillNames.Select(n => new Skill { Name = n }).ToList();
        await context.Skills.AddRangeAsync(skills);
        await context.SaveChangesAsync();

        if (recruiter is not null)
        {
            var job = new JobPosting
            {
                Title = "Senior Full-Stack Engineer",
                Description = "Build and maintain the TalentSphere recruitment platform across the .NET backend and React frontend.",
                Requirements = "3+ years professional experience with C# and modern JavaScript frameworks.",
                DepartmentId = engineering.Id,
                RecruiterId = recruiter.Id,
                Location = "Remote",
                EmploymentType = EmploymentType.FullTime,
                SalaryMin = 120000,
                SalaryMax = 160000,
                Status = JobStatus.Active,
            };
            foreach (var skill in skills.Take(4))
                job.JobSkills.Add(new JobSkill { JobPostingId = job.Id, SkillId = skill.Id, IsRequired = true, Weight = 1.0 });

            await context.JobPostings.AddAsync(job);
            await context.SaveChangesAsync();
        }

        logger.LogInformation("Database seeded with demo accounts: admin@talentsphere.local / recruiter@talentsphere.local / manager@talentsphere.local / candidate@talentsphere.local (password pattern: Role@12345)");
    }

    private static async Task<ApplicationUser?> CreateUserAsync(
        UserManager<ApplicationUser> userManager, string email, string password, string firstName, string lastName, UserRole role, Guid? departmentId)
    {
        var existing = await userManager.FindByEmailAsync(email);
        if (existing is not null) return existing;

        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            FirstName = firstName,
            LastName = lastName,
            Role = role,
            DepartmentId = departmentId,
            EmailConfirmed = true,
        };

        var result = await userManager.CreateAsync(user, password);
        if (!result.Succeeded) return null;

        await userManager.AddToRoleAsync(user, role.ToString());
        return user;
    }
}
