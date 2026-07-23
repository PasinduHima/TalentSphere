namespace TalentSphere.Application.Common;

public static class EmailTemplates
{
    private const string BaseTemplate = @"
<!DOCTYPE html>
<html lang=""en"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>{{Subject}}</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            color: #334155;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
            border: 1px solid #f1f5f9;
        }
        .header {
            background: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%);
            padding: 40px 32px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.02em;
        }
        .content {
            padding: 40px 32px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 24px;
        }
        .message {
            font-size: 16px;
            color: #475569;
            margin-bottom: 32px;
        }
        .cta-container {
            text-align: center;
            margin: 40px 0;
        }
        .btn {
            display: inline-block;
            background-color: #4f46e5;
            color: #ffffff;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            transition: background-color 0.2s;
        }
        .btn:hover {
            background-color: #4338ca;
        }
        .btn-outline {
            background-color: transparent;
            color: #4f46e5;
            border: 2px solid #4f46e5;
        }
        .btn-outline:hover {
            background-color: #e0e7ff;
        }
        .footer {
            padding: 24px 32px;
            background-color: #f8fafc;
            text-align: center;
            font-size: 14px;
            color: #64748b;
            border-top: 1px solid #f1f5f9;
        }
    </style>
</head>
<body>
    <div class=""container"">
        <div class=""header"">
            <h1>TalentSphere</h1>
        </div>
        <div class=""content"">
            <div class=""greeting"">Hello {{CandidateName}},</div>
            <div class=""message"">
                {{MessageBody}}
            </div>
            <div class=""cta-container"">
                <a href=""{{ActionUrl}}"" class=""btn {{ButtonClass}}"">{{ActionText}}</a>
            </div>
            <div class=""message"" style=""font-size: 14px; color: #94a3b8;"">
                Best regards,<br>
                <strong>The TalentSphere Hiring Team</strong>
            </div>
        </div>
        <div class=""footer"">
            &copy; {{Year}} TalentSphere Inc. All rights reserved.
        </div>
    </div>
</body>
</html>
";

    public static string GenerateOfferEmail(string candidateName, string jobTitle, Guid applicationId)
    {
        var body = $@"
            <p>Congratulations! We are thrilled to inform you that you have been selected for the <strong>{jobTitle}</strong> position.</p>
            <p>We were incredibly impressed by your skills and background, and we believe you will be a fantastic addition to our team. Please click the button below to review your offer details and next steps.</p>";

        return BaseTemplate
            .Replace("{{Subject}}", "Offer Extended")
            .Replace("{{CandidateName}}", candidateName)
            .Replace("{{MessageBody}}", body)
            .Replace("{{ActionUrl}}", $"http://localhost:5173/candidate/application-status/{applicationId}")
            .Replace("{{ButtonClass}}", "")
            .Replace("{{ActionText}}", "View Offer Details")
            .Replace("{{Year}}", DateTime.UtcNow.Year.ToString());
    }

    public static string GenerateRejectionEmail(string candidateName, string jobTitle, Guid applicationId)
    {
        var body = $@"
            <p>Thank you for taking the time to interview with us for the <strong>{jobTitle}</strong> position.</p>
            <p>While we were impressed with your background, we have decided to move forward with another candidate whose qualifications more closely align with our current needs for this particular role.</p>
            <p>We truly appreciate your interest in our company and encourage you to explore other open roles that might be a better fit.</p>";

        return BaseTemplate
            .Replace("{{Subject}}", "Application Update")
            .Replace("{{CandidateName}}", candidateName)
            .Replace("{{MessageBody}}", body)
            .Replace("{{ActionUrl}}", $"http://localhost:5173/candidate/application-status/{applicationId}")
            .Replace("{{ButtonClass}}", "btn-outline")
            .Replace("{{ActionText}}", "Explore Other Roles")
            .Replace("{{Year}}", DateTime.UtcNow.Year.ToString());
    }
}
