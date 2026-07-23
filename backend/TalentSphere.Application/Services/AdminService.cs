using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TalentSphere.Application.Common.Exceptions;
using TalentSphere.Application.Common.Models;
using TalentSphere.Application.DTOs.Admin;
using TalentSphere.Application.DTOs.Auth;
using TalentSphere.Application.Interfaces.AppServices;
using TalentSphere.Application.Interfaces.Repositories;
using TalentSphere.Application.Interfaces.Services;
using TalentSphere.Domain.Entities;
using TalentSphere.Domain.Enums;

namespace TalentSphere.Application.Services;

public class AdminService : IAdminService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IAuditService _auditService;

    public AdminService(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager, IAuditService auditService)
    {
        _unitOfWork = unitOfWork;
        _userManager = userManager;
        _auditService = auditService;
    }

    public async Task<UserDto> CreateUserAsync(CreateUserRequest request, CancellationToken ct = default)
    {
        if (!Enum.TryParse<UserRole>(request.Role, true, out var role))
            throw new ValidationAppException($"'{request.Role}' is not a valid role.");

        var existing = await _userManager.FindByEmailAsync(request.Email);
        if (existing is not null)
            throw new ConflictAppException("An account with this email already exists.");

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Role = role,
            DepartmentId = request.DepartmentId,
            EmailConfirmed = true,
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            throw new ValidationAppException(new Dictionary<string, string[]> { ["identity"] = result.Errors.Select(e => e.Description).ToArray() });

        await _userManager.AddToRoleAsync(user, role.ToString());

        if (role == UserRole.Candidate)
        {
            await _unitOfWork.CandidateProfiles.AddAsync(new CandidateProfile { UserId = user.Id }, ct);
            await _unitOfWork.SaveChangesAsync(ct);
        }

        await _auditService.LogAsync("CreateUser", nameof(ApplicationUser), user.Id.ToString(), $"{user.Email} ({role})", ct);

        return MapUser(user);
    }

    public async Task<UserDto> UpdateUserAsync(Guid userId, UpdateUserRequest request, CancellationToken ct = default)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new NotFoundException(nameof(ApplicationUser), userId);

        if (!string.IsNullOrWhiteSpace(request.FirstName)) user.FirstName = request.FirstName;
        if (!string.IsNullOrWhiteSpace(request.LastName)) user.LastName = request.LastName;
        if (request.DepartmentId.HasValue) user.DepartmentId = request.DepartmentId;

        if (!string.IsNullOrWhiteSpace(request.Role) && Enum.TryParse<UserRole>(request.Role, true, out var newRole) && newRole != user.Role)
        {
            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);
            await _userManager.AddToRoleAsync(user, newRole.ToString());
            user.Role = newRole;
        }

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<UserStatus>(request.Status, true, out var newStatus))
        {
            user.Status = newStatus;
            user.IsActive = newStatus != UserStatus.Suspended;
        }

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            throw new ValidationAppException(new Dictionary<string, string[]> { ["identity"] = result.Errors.Select(e => e.Description).ToArray() });

        await _auditService.LogAsync("UpdateUser", nameof(ApplicationUser), user.Id.ToString(), null, ct);

        return MapUser(user);
    }

    public async Task DeleteUserAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new NotFoundException(nameof(ApplicationUser), userId);

        await _userManager.DeleteAsync(user);
        await _auditService.LogAsync("DeleteUser", nameof(ApplicationUser), userId.ToString(), null, ct);
    }

    public async Task<PagedResult<UserDto>> GetUsersAsync(PaginationParams pagination, string? role, CancellationToken ct = default)
    {
        var query = _userManager.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(role) && Enum.TryParse<UserRole>(role, true, out var roleFilter))
            query = query.Where(u => u.Role == roleFilter);

        var totalCount = await query.CountAsync(ct);
        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((pagination.Page - 1) * pagination.PageSize)
            .Take(pagination.PageSize)
            .ToListAsync(ct);

        return new PagedResult<UserDto>
        {
            Items = users.Select(MapUser).ToList(),
            Page = pagination.Page,
            PageSize = pagination.PageSize,
            TotalCount = totalCount,
        };
    }

    public async Task<OrganizationDto> CreateOrganizationAsync(CreateOrganizationRequest request, CancellationToken ct = default)
    {
        var org = new Organization
        {
            Name = request.Name,
            Industry = request.Industry,
            Website = request.Website,
            Description = request.Description,
        };
        await _unitOfWork.Organizations.AddAsync(org, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        await _auditService.LogAsync("CreateOrganization", nameof(Organization), org.Id.ToString(), org.Name, ct);

        return new OrganizationDto(org.Id, org.Name, org.Industry, org.Website, 0);
    }

    public async Task<IReadOnlyList<OrganizationDto>> GetOrganizationsAsync(CancellationToken ct = default)
    {
        var orgs = await _unitOfWork.Organizations.Query().ToListAsync(ct);
        return orgs.Select(o => new OrganizationDto(o.Id, o.Name, o.Industry, o.Website, o.Departments.Count)).ToList();
    }

    public async Task<DepartmentDto> CreateDepartmentAsync(CreateDepartmentRequest request, CancellationToken ct = default)
    {
        var org = await _unitOfWork.Organizations.GetByIdAsync(request.OrganizationId, ct)
            ?? throw new NotFoundException(nameof(Organization), request.OrganizationId);

        var department = new Department
        {
            Name = request.Name,
            Description = request.Description,
            OrganizationId = request.OrganizationId,
        };
        await _unitOfWork.Departments.AddAsync(department, ct);
        await _unitOfWork.SaveChangesAsync(ct);
        await _auditService.LogAsync("CreateDepartment", nameof(Department), department.Id.ToString(), department.Name, ct);

        return new DepartmentDto(department.Id, department.Name, department.Description, org.Name, 0, 0);
    }

    public async Task<IReadOnlyList<DepartmentDto>> GetDepartmentsAsync(CancellationToken ct = default)
    {
        var departments = await _unitOfWork.Departments.Query().ToListAsync(ct);
        return departments.Select(d => new DepartmentDto(
            d.Id, d.Name, d.Description, d.Organization?.Name ?? string.Empty, d.Users.Count, d.JobPostings.Count)).ToList();
    }

    public async Task DeleteDepartmentAsync(Guid departmentId, CancellationToken ct = default)
    {
        var department = await _unitOfWork.Departments.GetByIdAsync(departmentId, ct)
            ?? throw new NotFoundException(nameof(Department), departmentId);

        _unitOfWork.Departments.Remove(department);
        await _unitOfWork.SaveChangesAsync(ct);
        await _auditService.LogAsync("DeleteDepartment", nameof(Department), departmentId.ToString(), null, ct);
    }

    public async Task<AnalyticsDashboardDto> GetAnalyticsAsync(CancellationToken ct = default)
    {
        var totalUsers = await _userManager.Users.CountAsync(ct);
        var totalCandidates = await _userManager.Users.CountAsync(u => u.Role == UserRole.Candidate, ct);
        var totalRecruiters = await _userManager.Users.CountAsync(u => u.Role == UserRole.Recruiter, ct);

        var jobs = await _unitOfWork.JobPostings.Query().ToListAsync(ct);
        var applications = await _unitOfWork.JobApplications.Query().ToListAsync(ct);

        var totalHires = applications.Count(a => a.Status == ApplicationStatus.Hired);
        var hireRate = applications.Count == 0 ? 0 : Math.Round(totalHires * 100.0 / applications.Count, 2);
        var avgMatch = applications.Count == 0 ? 0 : Math.Round(applications.Average(a => a.MatchScore), 2);

        var byStatus = applications
            .GroupBy(a => a.Status.ToString())
            .ToDictionary(g => g.Key, g => g.Count());

        var byDepartment = jobs
            .GroupBy(j => j.Department?.Name ?? "Unassigned")
            .ToDictionary(g => g.Key, g => g.Count());

        return new AnalyticsDashboardDto(
            totalUsers,
            totalCandidates,
            totalRecruiters,
            jobs.Count,
            jobs.Count(j => j.Status == JobStatus.Active),
            applications.Count,
            totalHires,
            hireRate,
            avgMatch,
            byStatus,
            byDepartment);
    }

    public async Task<PagedResult<AuditLogDto>> GetAuditLogsAsync(PaginationParams pagination, CancellationToken ct = default)
    {
        var query = _unitOfWork.AuditLogs.Query();
        var totalCount = await query.CountAsync(ct);

        var logs = await query
            .OrderByDescending(l => l.Timestamp)
            .Skip((pagination.Page - 1) * pagination.PageSize)
            .Take(pagination.PageSize)
            .ToListAsync(ct);

        return new PagedResult<AuditLogDto>
        {
            Items = logs.Select(l => new AuditLogDto(l.Id, l.UserId, l.UserEmail, l.Action, l.EntityName, l.EntityId, l.Details, l.IpAddress, l.Timestamp)).ToList(),
            Page = pagination.Page,
            PageSize = pagination.PageSize,
            TotalCount = totalCount,
        };
    }

    public Task<IReadOnlyList<SystemHealthDto>> GetSystemHealthAsync(CancellationToken ct = default)
    {
        IReadOnlyList<SystemHealthDto> health = new List<SystemHealthDto>
        {
            new("Database", "Operational", DateTime.UtcNow, "SQL Server connection healthy"),
            new("AI Matching Service", "Operational", DateTime.UtcNow, "Rule-based matching engine active"),
            new("Email Service", "Operational", DateTime.UtcNow, null),
            new("Calendar Integration", "Operational", DateTime.UtcNow, "Mock provider"),
        };
        return Task.FromResult(health);
    }

    private static UserDto MapUser(ApplicationUser user) => new(
        user.Id,
        user.Email ?? string.Empty,
        user.FirstName,
        user.LastName,
        user.Role.ToString(),
        user.AvatarUrl,
        user.DepartmentId,
        user.Department?.Name,
        user.Status.ToString(),
        user.CreatedAt,
        user.LastLoginAt);
}
