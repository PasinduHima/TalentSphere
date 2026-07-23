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

Most "AI" capabilities are deterministic, swappable services behind
interfaces — no external API key required to run the app:

- **`IResumeParsingService`** — extracts text from `.docx`/`.txt` (best-effort
  for other formats), matches against a skill lexicon, and estimates years of
  experience via regex.
- **`ICandidateMatchingService`** — candidate ↔ job match scoring via the
  Strategy pattern (skill overlap, or experience-weighted for recruiter ranking).

One feature calls a real generative AI model:

- **`IInterviewQuestionGenerationService`** (Hiring Manager → *AI Interview
  Question Generator*) calls **Google's Gemini API**
  (`GeminiInterviewQuestionService`, `Infrastructure/AI`) with a JSON response
  schema to produce role-specific interview questions, rationale, and
  evaluation criteria. If no API key is configured, the call times out, or the
  response fails to parse, it transparently falls back to a deterministic
  template generator in the same class — the endpoint always returns a valid
  result, it just isn't Gemini-authored. See **Gemini API key setup** below.

All AI interfaces live in `Application/Interfaces/Services` — swap in a
different provider by implementing the interface and changing one line in
`DependencyInjection.cs`; no controller or service code changes.

#### Gemini API key setup

The key is never committed to source control and never sent to the frontend
(all Gemini calls happen server-side). Store it with .NET User Secrets:

```bash
cd backend/TalentSphere.API
dotnet user-secrets set "Gemini:ApiKey" "<your-google-ai-studio-key>"
dotnet user-secrets set "Gemini:Model" "gemini-flash-latest"   # optional, this is the default
```

Get a key from [Google AI Studio](https://aistudio.google.com/apikey). In
non-local environments, set the `Gemini__ApiKey` environment variable instead
(the `__` maps to the `Gemini:ApiKey` config section in ASP.NET Core).

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

The frontend is already wired up to this API (see `frontend/src/lib/api/*`
and `frontend/src/store/authStore.js`) — see the [repo root README](../README.md)
for the combined run/test walkthrough. The API's default CORS policy allows
`http://localhost:5173` (the Vite dev server); the frontend's base URL is set
via `VITE_API_BASE_URL` in `frontend/.env` (defaults to
`http://localhost:5185/api`, matching this API's default `http` launch
profile port).

## API surface

All endpoints are namespaced by role and protected with `[Authorize(Roles = ...)]`
(JWT bearer + ASP.NET Core Identity roles), except `/api/auth/*` register/login/refresh:

- `POST /api/auth/register|login|refresh|logout`, `GET /api/auth/me`, `POST /api/auth/change-password`
- `GET/PUT /api/candidate/profile`, resume upload/list/delete, `GET /api/candidate/jobs*`, `POST/GET /api/candidate/applications`
- `POST/PUT/GET/DELETE /api/recruiter/jobs*`, `GET /api/recruiter/candidates`, application review/ranking/status, interview scheduling
- `GET /api/hiring-manager/shortlisted`, interview feedback, hiring decisions, `POST /api/hiring-manager/ai/interview-questions` (Gemini-backed)
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
