# 🌐 TalentSphere

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/frontend-React%20%7C%20Vite-61DAFB?logo=react)
![.NET](https://img.shields.io/badge/backend-.NET%209-512BD4?logo=dotnet)
![Status](https://img.shields.io/badge/status-active-success.svg)

**TalentSphere** is an AI-Powered Recruitment and Talent Management Platform developed as part of the SE205.3 Software Architecture coursework. It streamlines the hiring process by intelligently matching candidates to jobs and leveraging generative AI for tailored interview generation.

---

## 🚀 Features

- **🧠 AI-Powered Resume Parsing**: Automatically extracts text, identifies skills, and estimates years of experience.
- **⚡ Smart Candidate Matching**: Matches candidates to job requirements using configurable strategies (e.g., Skill Overlap, Experience-Weighted).
- **🤖 Generative AI Interview Questions**: Integrates with Google's Gemini API to automatically generate role-specific interview questions, evaluation criteria, and rationales.
- **🔐 Role-Based Access Control**: Secure, partitioned workflows for Admins, Recruiters, Hiring Managers, and Candidates.
- **📊 Real-Time Analytics Dashboard**: Comprehensive metrics and insights for organizational management.

## 🏗️ Architecture Overview

The system is built as a distributed application with a clear separation of concerns:

- **Frontend**: A modern, responsive SPA built with **React** and **Vite**, featuring state management with Zustand and styling with Ant Design/Framer Motion.
- **Backend**: A robust API built on **ASP.NET Core 9** following Clean Architecture principles:
  - **Domain**: Core entities and enums.
  - **Application**: Business logic, DTOs, and abstract interfaces.
  - **Infrastructure**: Entity Framework Core, SQL Server (LocalDB), Identity, JWT, and AI service implementations.
  - **API**: Controllers and middleware.

## 🛠️ Getting Started

### Prerequisites

- [Node.js (v18+)](https://nodejs.org/) and `npm`
- [.NET 9 SDK](https://dotnet.microsoft.com/)
- [SQL Server LocalDB](https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb)
- `dotnet-ef` global tool (`dotnet tool install --global dotnet-ef`)

### 1. Backend Setup

```bash
cd backend

# Apply EF Core migrations to create and seed the database
dotnet ef database update --project TalentSphere.Infrastructure --startup-project TalentSphere.Infrastructure

# Run the API
dotnet run --project TalentSphere.API
```
*The API runs at `http://localhost:5185` with Swagger UI at `/swagger`.*

**(Optional) Gemini AI Integration:**
For the AI interview question generator, provide a Google AI Studio API key via user secrets:
```bash
cd backend/TalentSphere.API
dotnet user-secrets set "Gemini:ApiKey" "<your-key>"
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```
*The frontend runs at `http://localhost:5173`.*

## 🧪 Demo Accounts

The database is seeded with demo accounts on the first run. The default passwords are as follows:

| Role | Email | Password |
|---|---|---|
| Admin | admin@talentsphere.local | Admin@12345 |
| Recruiter | recruiter@talentsphere.local | Recruiter@12345 |
| Hiring Manager | manager@talentsphere.local | Manager@12345 |
| Candidate | candidate@talentsphere.local | Candidate@12345 |

## 📁 Repository Structure

```
TalentSphere/
├── backend/            # .NET 9 Clean Architecture Solution
│   ├── TalentSphere.API/
│   ├── TalentSphere.Application/
│   ├── TalentSphere.Domain/
│   ├── TalentSphere.Infrastructure/
│   └── TalentSphere.Tests/
└── frontend/           # React + Vite Application
    ├── src/
    └── public/
```

## 📝 License

This project is licensed under the MIT License.
