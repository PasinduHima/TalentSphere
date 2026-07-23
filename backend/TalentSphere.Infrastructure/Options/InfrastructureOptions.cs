namespace TalentSphere.Infrastructure.Options;

public class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public string Secret { get; set; } = string.Empty;
    public int AccessTokenMinutes { get; set; } = 30;
    public int RefreshTokenDays { get; set; } = 7;
}

public class SmtpOptions
{
    public const string SectionName = "Smtp";

    public string Host { get; set; } = string.Empty;
    public int Port { get; set; } = 587;
    public string? Username { get; set; }
    public string? Password { get; set; }
    public string FromAddress { get; set; } = "no-reply@talentsphere.local";
    public string FromName { get; set; } = "TalentSphere AI";
    public bool EnableSsl { get; set; } = true;
    public bool Enabled { get; set; } = false;
}

public class FileStorageOptions
{
    public const string SectionName = "FileStorage";

    public string RootPath { get; set; } = "App_Data/uploads";
}

/// <summary>
/// Google AI Studio (Gemini) credentials. ApiKey is supplied via .NET User
/// Secrets in development (`dotnet user-secrets set "Gemini:ApiKey" "..."`)
/// or an environment variable (Gemini__ApiKey) in other environments — it is
/// never committed to source control or exposed to the frontend.
/// </summary>
public class GeminiOptions
{
    public const string SectionName = "Gemini";

    public string ApiKey { get; set; } = string.Empty;
    public string Model { get; set; } = "gemini-flash-latest";
    public bool IsConfigured => !string.IsNullOrWhiteSpace(ApiKey);
}
