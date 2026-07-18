using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TalentSphere.Application.Interfaces.AppServices;
using TalentSphere.Application.Interfaces.Repositories;
using TalentSphere.Application.Interfaces.Services;
using TalentSphere.Application.Services;
using TalentSphere.Domain.Entities;
using TalentSphere.Infrastructure.AI;
using TalentSphere.Infrastructure.Notifications;
using TalentSphere.Infrastructure.Options;
using TalentSphere.Infrastructure.Persistence;
using TalentSphere.Infrastructure.Services;

namespace TalentSphere.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.SectionName));
        services.Configure<SmtpOptions>(configuration.GetSection(SmtpOptions.SectionName));
        services.Configure<FileStorageOptions>(configuration.GetSection(FileStorageOptions.SectionName));

        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' was not found.");

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(connectionString)
                   .UseLazyLoadingProxies());

        services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
            {
                options.Password.RequiredLength = 8;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.User.RequireUniqueEmail = true;
                options.SignIn.RequireConfirmedEmail = false;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        var jwtSection = configuration.GetSection(JwtOptions.SectionName);
        var jwtOptions = jwtSection.Get<JwtOptions>() ?? new JwtOptions();

        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtOptions.Issuer,
                    ValidAudience = jwtOptions.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Secret)),
                    ClockSkew = TimeSpan.FromMinutes(1),
                };
            });

        services.AddHttpContextAccessor();

        // Repository / Unit of Work pattern
        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Cross-cutting infrastructure services
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IAuditService, AuditService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<ISmsService, SmsService>();
        services.AddScoped<ICalendarService, CalendarService>();
        services.AddSingleton<IFileStorageService, FileStorageService>();

        // AI / analytics services
        services.AddScoped<IResumeParsingService, ResumeParsingService>();
        services.AddScoped<IMatchingStrategy, SkillOverlapMatchingStrategy>();
        services.AddScoped<IMatchingStrategy, WeightedExperienceMatchingStrategy>();
        services.AddScoped<ICandidateMatchingService, CandidateMatchingService>();

        // Notification factory pattern
        services.AddScoped<INotificationSender, EmailNotificationSender>();
        services.AddScoped<INotificationSender, SmsNotificationSender>();
        services.AddScoped<INotificationSender, InAppNotificationSender>();
        services.AddScoped<INotificationSenderFactory, NotificationSenderFactory>();
        services.AddScoped<INotificationService, NotificationService>();

        // Application-layer business services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ICandidateService, CandidateService>();
        services.AddScoped<IRecruiterService, RecruiterService>();
        services.AddScoped<IHiringManagerService, HiringManagerService>();
        services.AddScoped<IAdminService, AdminService>();

        return services;
    }
}
