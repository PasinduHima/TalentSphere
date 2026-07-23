using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TalentSphere.Application.Common.Exceptions;
using TalentSphere.Application.DTOs.Auth;
using TalentSphere.Application.Interfaces.AppServices;
using TalentSphere.Application.Interfaces.Repositories;
using TalentSphere.Application.Interfaces.Services;
using TalentSphere.Domain.Entities;
using TalentSphere.Domain.Enums;

namespace TalentSphere.Application.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IAuditService _auditService;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        ITokenService tokenService,
        IUnitOfWork unitOfWork,
        IAuditService auditService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _unitOfWork = unitOfWork;
        _auditService = auditService;
    }

    public async Task<AuthResponseDto> RegisterCandidateAsync(RegisterCandidateRequest request, CancellationToken ct = default)
    {
        var existing = await _userManager.FindByEmailAsync(request.Email);
        if (existing is not null)
            throw new ConflictAppException("An account with this email already exists.");

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Role = UserRole.Candidate,
            EmailConfirmed = true,
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            throw new ValidationAppException(ToErrorDictionary(result));

        await _userManager.AddToRoleAsync(user, nameof(UserRole.Candidate));

        var profile = new CandidateProfile
        {
            UserId = user.Id,
            ProfileCompletionPercent = 20,
        };
        await _unitOfWork.CandidateProfiles.AddAsync(profile, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        await _auditService.LogAsync("Register", nameof(ApplicationUser), user.Id.ToString(), $"Candidate self-registered: {user.Email}", ct);

        return await BuildAuthResponseAsync(user, ct);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null || !user.IsActive)
            throw new ValidationAppException("Invalid email or password.");

        var passwordValid = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!passwordValid)
            throw new ValidationAppException("Invalid email or password.");

        user.LastLoginAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        await _auditService.LogAsync("Login", nameof(ApplicationUser), user.Id.ToString(), $"User logged in: {user.Email}", ct);

        return await BuildAuthResponseAsync(user, ct);
    }

    public async Task<AuthResponseDto> RefreshAsync(RefreshTokenRequest request, CancellationToken ct = default)
    {
        var existingToken = await _unitOfWork.RefreshTokens.FirstOrDefaultAsync(t => t.Token == request.RefreshToken, ct);
        if (existingToken is null || !existingToken.IsActive)
            throw new ValidationAppException("Invalid or expired refresh token.");

        var user = await _userManager.FindByIdAsync(existingToken.UserId.ToString());
        if (user is null || !user.IsActive)
            throw new ValidationAppException("Invalid or expired refresh token.");

        existingToken.RevokedAt = DateTime.UtcNow;
        _unitOfWork.RefreshTokens.Update(existingToken);

        var response = await BuildAuthResponseAsync(user, ct);
        existingToken.ReplacedByToken = response.RefreshToken;
        _unitOfWork.RefreshTokens.Update(existingToken);
        await _unitOfWork.SaveChangesAsync(ct);

        return response;
    }

    public async Task LogoutAsync(string refreshToken, CancellationToken ct = default)
    {
        var existingToken = await _unitOfWork.RefreshTokens.FirstOrDefaultAsync(t => t.Token == refreshToken, ct);
        if (existingToken is not null && existingToken.IsActive)
        {
            existingToken.RevokedAt = DateTime.UtcNow;
            _unitOfWork.RefreshTokens.Update(existingToken);
            await _unitOfWork.SaveChangesAsync(ct);
        }
    }

    public async Task ChangePasswordAsync(Guid userId, ChangePasswordRequest request, CancellationToken ct = default)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new NotFoundException(nameof(ApplicationUser), userId);

        var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
        if (!result.Succeeded)
            throw new ValidationAppException(ToErrorDictionary(result));

        await _auditService.LogAsync("ChangePassword", nameof(ApplicationUser), user.Id.ToString(), null, ct);
    }

    public async Task<UserDto> GetCurrentUserAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await _userManager.Users
            .Include(u => u.Department)
            .FirstOrDefaultAsync(u => u.Id == userId, ct)
            ?? throw new NotFoundException(nameof(ApplicationUser), userId);

        return MapUser(user);
    }

    private async Task<AuthResponseDto> BuildAuthResponseAsync(ApplicationUser user, CancellationToken ct)
    {
        var roles = await _userManager.GetRolesAsync(user);
        var tokens = _tokenService.GenerateTokens(user, roles);

        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            Token = tokens.RefreshToken,
            ExpiresAt = tokens.RefreshTokenExpiresAt,
        };
        await _unitOfWork.RefreshTokens.AddAsync(refreshToken, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return new AuthResponseDto(
            tokens.AccessToken,
            tokens.AccessTokenExpiresAt,
            tokens.RefreshToken,
            tokens.RefreshTokenExpiresAt,
            MapUser(user));
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

    private static Dictionary<string, string[]> ToErrorDictionary(IdentityResult result) =>
        new()
        {
            ["identity"] = result.Errors.Select(e => e.Description).ToArray(),
        };
}
