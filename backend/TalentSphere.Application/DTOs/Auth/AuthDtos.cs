using System.ComponentModel.DataAnnotations;

namespace TalentSphere.Application.DTOs.Auth;

public class RegisterCandidateRequest
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(8)]
    public string Password { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string LastName { get; set; } = string.Empty;
}

public class LoginRequest
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public class RefreshTokenRequest
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}

public class ChangePasswordRequest
{
    [Required]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required, MinLength(8)]
    public string NewPassword { get; set; } = string.Empty;
}

public record UserDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string Role,
    string? AvatarUrl,
    Guid? DepartmentId,
    string? DepartmentName,
    string Status,
    DateTime CreatedAt,
    DateTime? LastLoginAt);

public record AuthResponseDto(
    string AccessToken,
    DateTime AccessTokenExpiresAt,
    string RefreshToken,
    DateTime RefreshTokenExpiresAt,
    UserDto User);
