using TalentSphere.Domain.Entities;

namespace TalentSphere.Application.Interfaces.Services;

public record TokenResult(string AccessToken, DateTime AccessTokenExpiresAt, string RefreshToken, DateTime RefreshTokenExpiresAt);

public interface ITokenService
{
    TokenResult GenerateTokens(ApplicationUser user, IList<string> roles);
    string GenerateRefreshTokenValue();
}
