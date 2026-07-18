using System.ComponentModel.DataAnnotations;

namespace TalentSphere.Application.DTOs.Admin;

public class CreateUserRequest
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(8)]
    public string Password { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = string.Empty;

    public Guid? DepartmentId { get; set; }
}

public class UpdateUserRequest
{
    [MaxLength(100)]
    public string? FirstName { get; set; }

    [MaxLength(100)]
    public string? LastName { get; set; }

    public string? Role { get; set; }
    public string? Status { get; set; }
    public Guid? DepartmentId { get; set; }
}

public class CreateDepartmentRequest
{
    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    public Guid OrganizationId { get; set; }
}

public record DepartmentDto(Guid Id, string Name, string? Description, string OrganizationName, int UserCount, int JobCount);

public class CreateOrganizationRequest
{
    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    public string? Industry { get; set; }
    public string? Website { get; set; }
    public string? Description { get; set; }
}

public record OrganizationDto(Guid Id, string Name, string? Industry, string? Website, int DepartmentCount);

public record AnalyticsDashboardDto(
    int TotalUsers,
    int TotalCandidates,
    int TotalRecruiters,
    int TotalJobs,
    int ActiveJobs,
    int TotalApplications,
    int TotalHires,
    double HireRatePercent,
    double AverageMatchScore,
    IReadOnlyDictionary<string, int> ApplicationsByStatus,
    IReadOnlyDictionary<string, int> JobsByDepartment);

public record AuditLogDto(
    long Id,
    Guid? UserId,
    string? UserEmail,
    string Action,
    string EntityName,
    string? EntityId,
    string? Details,
    string? IpAddress,
    DateTime Timestamp);

public record SystemHealthDto(string ServiceName, string Status, DateTime CheckedAt, string? Details);
