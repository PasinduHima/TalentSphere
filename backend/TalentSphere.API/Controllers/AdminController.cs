using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TalentSphere.Application.Common.Models;
using TalentSphere.Application.DTOs.Admin;
using TalentSphere.Application.DTOs.Auth;
using TalentSphere.Application.Interfaces.AppServices;
using TalentSphere.Domain.Enums;

namespace TalentSphere.API.Controllers;

[Authorize(Roles = nameof(UserRole.Admin))]
[Route("api/admin")]
public class AdminController : ApiControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpPost("users")]
    public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserRequest request, CancellationToken ct) =>
        Ok(await _adminService.CreateUserAsync(request, ct));

    [HttpPut("users/{userId:guid}")]
    public async Task<ActionResult<UserDto>> UpdateUser(Guid userId, [FromBody] UpdateUserRequest request, CancellationToken ct) =>
        Ok(await _adminService.UpdateUserAsync(userId, request, ct));

    [HttpDelete("users/{userId:guid}")]
    public async Task<IActionResult> DeleteUser(Guid userId, CancellationToken ct)
    {
        await _adminService.DeleteUserAsync(userId, ct);
        return NoContent();
    }

    [HttpGet("users")]
    public async Task<ActionResult<PagedResult<UserDto>>> GetUsers([FromQuery] PaginationParams pagination, [FromQuery] string? role, CancellationToken ct) =>
        Ok(await _adminService.GetUsersAsync(pagination, role, ct));

    [HttpPost("organizations")]
    public async Task<ActionResult<OrganizationDto>> CreateOrganization([FromBody] CreateOrganizationRequest request, CancellationToken ct) =>
        Ok(await _adminService.CreateOrganizationAsync(request, ct));

    [HttpGet("organizations")]
    public async Task<ActionResult<IReadOnlyList<OrganizationDto>>> GetOrganizations(CancellationToken ct) =>
        Ok(await _adminService.GetOrganizationsAsync(ct));

    [HttpPost("departments")]
    public async Task<ActionResult<DepartmentDto>> CreateDepartment([FromBody] CreateDepartmentRequest request, CancellationToken ct) =>
        Ok(await _adminService.CreateDepartmentAsync(request, ct));

    [HttpGet("departments")]
    public async Task<ActionResult<IReadOnlyList<DepartmentDto>>> GetDepartments(CancellationToken ct) =>
        Ok(await _adminService.GetDepartmentsAsync(ct));

    [HttpDelete("departments/{departmentId:guid}")]
    public async Task<IActionResult> DeleteDepartment(Guid departmentId, CancellationToken ct)
    {
        await _adminService.DeleteDepartmentAsync(departmentId, ct);
        return NoContent();
    }

    [HttpGet("analytics")]
    public async Task<ActionResult<AnalyticsDashboardDto>> GetAnalytics(CancellationToken ct) =>
        Ok(await _adminService.GetAnalyticsAsync(ct));

    [HttpGet("audit-logs")]
    public async Task<ActionResult<PagedResult<AuditLogDto>>> GetAuditLogs([FromQuery] PaginationParams pagination, CancellationToken ct) =>
        Ok(await _adminService.GetAuditLogsAsync(pagination, ct));

    [HttpGet("system-health")]
    public async Task<ActionResult<IReadOnlyList<SystemHealthDto>>> GetSystemHealth(CancellationToken ct) =>
        Ok(await _adminService.GetSystemHealthAsync(ct));
}
