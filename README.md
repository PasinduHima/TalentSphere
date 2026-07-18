# TalentSphere — AI-Powered Recruitment and Talent Management Platform

SE205.3 Software Architecture coursework. Two parts:

- [`backend/`](backend/README.md) — C# ASP.NET Core Web API (layered architecture, EF Core + SQL Server, JWT/RBAC, AI matching)
- [`frontend/`](frontend) — React + Vite + Ant Design client, now wired to the real backend API

## Quick start (both apps together)

### Prerequisites

- .NET 9 SDK
- Node.js 18+
- SQL Server LocalDB (`sqllocaldb info` should list `MSSQLLocalDB`)
- `dotnet-ef` global tool: `dotnet tool install --global dotnet-ef`

### 1. Start the backend

```bash
cd backend
dotnet ef database update --project TalentSphere.Infrastructure --startup-project TalentSphere.Infrastructure
dotnet run --project TalentSphere.API
```

By default this binds to **http://localhost:5185** (see `backend/TalentSphere.API/Properties/launchSettings.json`;
run with `--launch-profile https` for HTTPS too). The first run in the `Development`
environment seeds Identity roles plus demo accounts and a sample job posting —
watch the console for the seeded-account summary line.

Swagger UI: http://localhost:5185/swagger

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Opens at **http://localhost:5173**. It talks to the backend via
`VITE_API_BASE_URL` in [`frontend/.env`](frontend/.env) (defaults to
`http://localhost:5185/api`) — edit that file if your backend binds to a
different port.

### 3. Log in

Use the seeded demo accounts (also listed as one-click buttons on the login
page):

| Role | Email | Password |
|---|---|---|
| Admin | admin@talentsphere.local | Admin@12345 |
| Recruiter | recruiter@talentsphere.local | Recruiter@12345 |
| Hiring Manager | manager@talentsphere.local | Manager@12345 |
| Candidate | candidate@talentsphere.local | Candidate@12345 |

Or register a new candidate account from `/register` (self-service sign-up is
candidate-only; other roles are provisioned by an Admin from **User
Management** → **Add User**).

## What's wired up

The frontend's mock data (`src/data/mockData.js`, hard-coded arrays in pages)
has been replaced with real API calls for every role:

- **Auth**: register (candidate), login, logout, JWT access/refresh token
  handling with automatic silent refresh on 401 (`src/lib/apiClient.js`)
- **Candidate**: dashboard stats, job search + apply, application tracking,
  profile editing, resume upload/parsing
- **Recruiter**: job postings (create/publish/list), candidate search,
  AI-ranked application review with status updates, interview scheduling
- **Hiring Manager**: shortlisted candidates, interview feedback submission,
  hiring decisions (extend offer / reject)
- **Admin**: user management (create/list/delete), department & organization
  management, analytics dashboard, audit log, system health

Not wired (no backend support / out of scope for this coursework): in-app
messaging pages, the AI interview-question generator (bonus feature), and the
Settings/Roles-and-Permissions placeholder pages.

## Testing the integration end-to-end

1. Log in as **Candidate** → go to **Profile**, add a couple of skills (e.g.
   `C#`, `React`) → go to **Job Search**, note the AI match score, click
   **Apply Now**.
2. Log in as **Recruiter** → **Job Postings** → **View Applicants** on the job
   you applied to → confirm the application appears with the same match
   score → click **Advance** or **Reject**, or **Schedule** an interview.
3. Log in as **Hiring Manager** → **Dashboard** shows the shortlisted
   candidate once an interview exists → **Provide Feedback** → submit scores
   and a recommendation.
4. Back as **Hiring Manager**, go to **Hiring Decisions** → **Extend Offer**
   or **Reject** the candidate.
5. Log in as **Admin** → **Analytics** shows updated totals; **System
   Monitoring** → **Recent Audit Activity** shows every action taken above.

For API-only testing (Postman/Swagger, useful for the report's testing
evidence section), see [`backend/README.md`](backend/README.md#api-surface).

## Automated tests

```bash
cd backend
dotnet test          # 19 unit tests: matching strategies, resume parsing, repository/UoW

cd ../frontend
npm run lint          # oxlint
npm run build          # production build / type-adjacent sanity check
```
