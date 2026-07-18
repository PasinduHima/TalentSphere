# TalentSphere — Backend (ASP.NET Core Web API)

Backend for the **AI-Powered Recruitment and Talent Management Platform** (SE205.3
Software Architecture coursework). Pairs with the existing React frontend in
[`../frontend`](../frontend).

## Architecture

Layered / Clean Architecture, five projects:

```
TalentSphere.Domain          Entities, enums — no dependencies
TalentSphere.Application     DTOs, service interfaces, business-logic services
                              (depends only on Domain + abstractions)
TalentSphere.Infrastructure  EF Core, ASP.NET Identity, JWT, repositories,
                              AI/matching/notification implementations
TalentSphere.API             Controllers, Swagger, DI wiring, middleware
TalentSphere.Tests           xUnit unit tests
```

Dependencies point inward (API → Infrastructure → Application → Domain);
Application never references Infrastructure or API.

### Design patterns

| Pattern | Where |
|---|---|
| Repository | `IGenericRepository<T>` / `GenericRepository<T>` (`Infrastructure/Persistence`) |
| Unit of Work | `IUnitOfWork` / `UnitOfWork` — one `DbContext`/transaction per request |
| Dependency Injection | Constructor injection throughout; wired in `Infrastructure/DependencyInjection.cs` |
| Factory | `INotificationSenderFactory` resolves the right `INotificationSender` (Email/SMS/In-app) for a channel (`Infrastructure/Notifications`) |
| Strategy | `IMatchingStrategy` — `SkillOverlapMatchingStrategy` and `WeightedExperienceMatchingStrategy`, selected at runtime by `CandidateMatchingService` (`Infrastructure/AI`) |

### AI / analytics services

No external AI API key is required — the "AI" capabilities are implemented as
deterministic, swappable services behind interfaces:

- **`IResumeParsingService`** — extracts text from `.docx`/`.txt` (best-effort
  for other formats), matches against a skill lexicon, and estimates years of
  experience via regex.
- **`ICandidateMatchingService`** — candidate ↔ job match scoring via the
  Strategy pattern (skill overlap, or experience-weighted for recruiter ranking).

Both interfaces live in `Application/Interfaces/Services` — swap in a real
provider (Azure AI, OpenAI, etc.) by implementing the interface and changing
one line in `DependencyInjection.cs`; no controller or service code changes.

### Other integration points (stubbed behind interfaces)

- `IEmailService` — SMTP if `Smtp:Enabled` is `true` in config, otherwise logs
  the message (safe default for local dev/demo).
- `ISmsService`, `ICalendarService` — logging-based mocks modelling the
  Twilio/Outlook-Graph/Google-Calendar contracts described in the coursework
  brief; swap the implementation to go live.
- `IFileStorageService` — local disk under `App_Data/uploads`; swap for Azure
  Blob/S3 for cloud deployment.

## Prerequisites

- .NET 9 SDK (pinned via `global.json`)
- SQL Server (LocalDB is fine for development — `sqllocaldb info` should list
  `MSSQLLocalDB`)
- `dotnet-ef` global tool: `dotnet tool install --global dotnet-ef`

## Running locally

```bash
cd backend

# Apply migrations (creates TalentSphereDb on LocalDB by default)
dotnet ef database update --project TalentSphere.Infrastructure --startup-project TalentSphere.Infrastructure

# Run the API (seeds demo data + roles on first run, Development only)
dotnet run --project TalentSphere.API
```

Swagger UI: `https://localhost:<port>/swagger` (also available over HTTP).
The JWT bearer scheme is pre-configured in Swagger — click **Authorize** and
paste `Bearer <access_token>` after logging in via `/api/auth/login`.

### Seeded demo accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@talentsphere.local | Admin@12345 |
| Recruiter | recruiter@talentsphere.local | Recruiter@12345 |
| Hiring Manager | manager@talentsphere.local | Manager@12345 |
| Candidate | candidate@talentsphere.local | Candidate@12345 |

### Connecting the React frontend

The API's default CORS policy allows `http://localhost:5173` (the Vite dev
server). Point the frontend's API base URL at `http://localhost:5299` (or
whatever port `dotnet run` binds) and replace the mock `authStore`/`mockData`
calls with real `fetch`/`axios` calls against the endpoints below.

## API surface

All endpoints are namespaced by role and protected with `[Authorize(Roles = ...)]`
(JWT bearer + ASP.NET Core Identity roles), except `/api/auth/*` register/login/refresh:

- `POST /api/auth/register|login|refresh|logout`, `GET /api/auth/me`, `POST /api/auth/change-password`
- `GET/PUT /api/candidate/profile`, resume upload/list/delete, `GET /api/candidate/jobs*`, `POST/GET /api/candidate/applications`
- `POST/PUT/GET/DELETE /api/recruiter/jobs*`, `GET /api/recruiter/candidates`, application review/ranking/status, interview scheduling
- `GET /api/hiring-manager/shortlisted`, interview feedback, hiring decisions
- Full user/org/department management, analytics dashboard, audit log, system health under `/api/admin/*`

Full request/response contracts are in Swagger — export it (`/swagger/v1/swagger.json`)
for the report's API documentation section.

## Testing

```bash
dotnet test
```

19 unit tests cover the matching strategies (Strategy pattern), the rule-based
resume/skill parser, the generic repository + unit of work (against the EF
Core InMemory provider), and pagination helpers. For the coursework's
required API testing evidence, exercise the running API with Postman/Swagger
and include screenshots/collection exports in the report.

## Configuration

All secrets/connection strings live in `TalentSphere.API/appsettings.json`
(and `appsettings.Development.json` for local overrides — not committed with
real secrets). Key sections: `ConnectionStrings:DefaultConnection`, `Jwt`,
`Smtp`, `FileStorage`, `Cors:AllowedOrigins`. **Change `Jwt:Secret` before any
non-local deployment.**
