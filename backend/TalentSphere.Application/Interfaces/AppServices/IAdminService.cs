using TalentSphere.Application.Common.Models;
using TalentSphere.Application.DTOs.Admin;
using TalentSphere.Application.DTOs.Auth;

namespace TalentSphere.Application.Interfaces.AppServices;

public interface IAdminService
{
    Task<UserDto> CreateUserAsync(CreateUserRequest request, CancellationToken ct = default);
    Task<UserDto> UpdateUserAsync(Guid userId, UpdateUserRequest request, CancellationToken ct = default);
    Task DeleteUserAsync(Guid userId, CancellationToken ct = default);
    Task<PagedResult<UserDto>> GetUsersAsync(PaginationParams pagination, string? role, CancellationToken ct = default);

    Task<OrganizationDto> CreateOrganizationAsync(CreateOrganizationRequest request, CancellationToken ct = default);
    Task<IReadOnlyList<OrganizationDto>> GetOrganizationsAsync(CancellationToken ct = default);

    Task<DepartmentDto> CreateDepartmentAsync(CreateDepartmentRequest request, CancellationToken ct = default);
    Task<IReadOnlyList<DepartmentDto>> GetDepartmentsAsync(CancellationToken ct = default);
    Task DeleteDepartmentAsync(Guid departmentId, CancellationToken ct = default);

    Task<AnalyticsDashboardDto> GetAnalyticsAsync(CancellationToken ct = default);
    Task<PagedResult<AuditLogDto>> GetAuditLogsAsync(PaginationParams pagination, CancellationToken ct = default);
    Task<IReadOnlyList<SystemHealthDto>> GetSystemHealthAsync(CancellationToken ct = default);
}
