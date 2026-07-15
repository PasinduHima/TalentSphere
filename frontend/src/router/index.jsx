import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROLES } from '../lib/constants';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import AppLayout from '../components/layout/AppLayout';
import AuthLayout from '../components/layout/AuthLayout';

// Auth Pages
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import PasswordResetPage from '../features/auth/pages/PasswordResetPage';

// Candidate Pages
import CandidateDashboardPage from '../features/candidate/pages/DashboardPage';
import JobSearchPage from '../features/candidate/pages/JobSearchPage';
import ApplicationTrackingPage from '../features/candidate/pages/ApplicationTrackingPage';
import ProfilePage from '../features/candidate/pages/ProfilePage';
import MessagesPage from '../features/candidate/pages/MessagesPage';

// Recruiter Pages
import JobPostingsPage from '../features/recruiter/pages/JobPostingsPage';
import CreateJobPage from '../features/recruiter/pages/CreateJobPage';
import CandidateSearchPage from '../features/recruiter/pages/CandidateSearchPage';
import ApplicationReviewPage from '../features/recruiter/pages/ApplicationReviewPage';
import InterviewSchedulingPage from '../features/recruiter/pages/InterviewSchedulingPage';

// Hiring Manager Pages
import HMDashboardPage from '../features/manager/pages/DashboardPage';
import CandidateReviewPage from '../features/manager/pages/CandidateReviewPage';
import HiringDecisionsPage from '../features/manager/pages/HiringDecisionsPage';
import AIQuestionGeneratorPage from '../features/manager/pages/AIQuestionGeneratorPage';

// Admin Pages
import AnalyticsDashboardPage from '../features/admin/pages/AnalyticsDashboardPage';
import UserManagementPage from '../features/admin/pages/UserManagementPage';
import DepartmentManagementPage from '../features/admin/pages/DepartmentManagementPage';
import SystemMonitoringPage from '../features/admin/pages/SystemMonitoringPage';

// Mock Pages for routing setup
const Placeholder = ({ title }) => (
  <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>{title}</h1>
      <p style={{ marginTop: '8px', color: '#64748b' }}>This page is under construction.</p>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  
  // ==========================================
  // Auth Routes
  // ==========================================
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'reset-password', element: <PasswordResetPage /> },
    ],
  },

  // ==========================================
  // Candidate Routes
  // ==========================================
  {
    path: '/candidate',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.CANDIDATE]}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '', element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <CandidateDashboardPage /> },
      { path: 'jobs', element: <JobSearchPage /> },
      { path: 'applications', element: <ApplicationTrackingPage /> },
      { path: 'messages', element: <MessagesPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },

  // ==========================================
  // Recruiter Routes
  // ==========================================
  {
    path: '/recruiter',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.RECRUITER]}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '', element: <Navigate to="jobs" replace /> },
      { path: 'jobs', element: <JobPostingsPage /> },
      { path: 'jobs/new', element: <CreateJobPage /> },
      { path: 'candidates', element: <CandidateSearchPage /> },
      { path: 'applications/:id', element: <ApplicationReviewPage /> },
      { path: 'interviews', element: <InterviewSchedulingPage /> },
    ],
  },

  // ==========================================
  // Hiring Manager Routes
  // ==========================================
  {
    path: '/hiring-manager',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.HIRING_MANAGER]}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '', element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <HMDashboardPage /> },
      { path: 'shortlisted', element: <Placeholder title="Shortlisted Candidates" /> },
      { path: 'feedback', element: <CandidateReviewPage /> },
      { path: 'decisions', element: <HiringDecisionsPage /> },
      { path: 'ai-questions', element: <AIQuestionGeneratorPage /> },
    ],
  },

  // ==========================================
  // Admin Routes
  // ==========================================
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '', element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <AnalyticsDashboardPage /> },
      { path: 'users', element: <UserManagementPage /> },
      { path: 'roles', element: <Placeholder title="Roles & Permissions" /> },
      { path: 'departments', element: <DepartmentManagementPage /> },
      { path: 'monitoring', element: <SystemMonitoringPage /> },
      { path: 'settings', element: <Placeholder title="Settings" /> },
    ],
  },
  
  // 404 Catch-all
  {
    path: '*',
    element: (
      <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: '#f8fafc' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#4f46e5', margin: 0 }}>404</h1>
        <p style={{ marginTop: '8px', fontSize: '20px', fontWeight: 500 }}>Page Not Found</p>
        <a href="/" style={{ marginTop: '24px', borderRadius: '6px', backgroundColor: '#4f46e5', color: '#fff', padding: '8px 16px', textDecoration: 'none', fontWeight: 500 }}>
          Return Home
        </a>
      </div>
    ),
  },
]);
