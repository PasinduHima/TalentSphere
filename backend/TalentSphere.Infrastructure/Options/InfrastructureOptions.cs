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
