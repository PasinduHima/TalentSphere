export const APP_NAME = 'TalentSphere AI';
export const APP_SUBTITLE = 'Enterprise Recruitment';

export const ROLES = {
  CANDIDATE: 'candidate',
  RECRUITER: 'recruiter',
  HIRING_MANAGER: 'hiring_manager',
  ADMIN: 'admin',
};

export const ROLE_LABELS = {
  [ROLES.CANDIDATE]: 'Candidate',
  [ROLES.RECRUITER]: 'Recruiter',
  [ROLES.HIRING_MANAGER]: 'Hiring Manager',
  [ROLES.ADMIN]: 'Administrator',
};

export const APPLICATION_STATUSES = {
  APPLIED: 'Applied',
  SCREENING: 'Screening',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  HIRED: 'Hired',
  REJECTED: 'Rejected',
};

export const JOB_STATUSES = {
  ACTIVE: 'Active',
  DRAFT: 'Draft',
  CLOSED: 'Closed',
  PAUSED: 'Paused',
};

export const USER_STATUSES = {
  ACTIVE: 'Active',
  OFFLINE: 'Offline',
  SUSPENDED: 'Suspended',
};

export const INTERVIEW_TYPES = {
  INITIAL_SCREEN: 'Initial Screen',
  TECHNICAL: 'Technical Deep Dive',
  CULTURAL_FIT: 'Cultural Fit',
  FINAL: 'Final Round',
};

export const HIRING_DECISIONS = {
  EXTEND_OFFER: 'Extend Offer',
  PUT_ON_HOLD: 'Put on Hold',
  REJECT: 'Reject',
};

export const SERVICE_STATUSES = {
  OPERATIONAL: 'Operational',
  DEGRADED: 'Degraded',
  DOWN: 'Down',
};

export const AI_MATCH_THRESHOLDS = {
  HIGH: 80,
  MEDIUM: 60,
};

export const SIDEBAR_NAV = {
  [ROLES.CANDIDATE]: [
    { label: 'Dashboard', path: '/candidate/dashboard', icon: 'LayoutDashboard' },
    { label: 'Job Search', path: '/candidate/jobs', icon: 'Search' },
    { label: 'Applications', path: '/candidate/applications', icon: 'FileText' },
    { label: 'Messages', path: '/candidate/messages', icon: 'MessageSquare' },
    { label: 'Profile', path: '/candidate/profile', icon: 'User' },
  ],
  [ROLES.RECRUITER]: [
    { label: 'Dashboard', path: '/recruiter/dashboard', icon: 'LayoutDashboard' },
    { label: 'Job Postings', path: '/recruiter/jobs', icon: 'Briefcase' },
    { label: 'Candidates', path: '/recruiter/candidates', icon: 'Users' },
    { label: 'Interviews', path: '/recruiter/interviews', icon: 'Calendar' },
    { label: 'Messages', path: '/recruiter/messages', icon: 'MessageSquare' },
    { label: 'Settings', path: '/recruiter/settings', icon: 'Settings' },
  ],
  [ROLES.HIRING_MANAGER]: [
    { label: 'Dashboard', path: '/hiring-manager/dashboard', icon: 'LayoutDashboard' },
    { label: 'Shortlisted Candidates', path: '/hiring-manager/shortlisted', icon: 'UserCheck' },
    { label: 'Interview Feedback', path: '/hiring-manager/feedback', icon: 'MessageCircle' },
    { label: 'Hiring Decisions', path: '/hiring-manager/decisions', icon: 'CheckSquare' },
  ],
  [ROLES.ADMIN]: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'LayoutDashboard' },
    { label: 'User Management', path: '/admin/users', icon: 'Users' },
    { label: 'Roles & Permissions', path: '/admin/roles', icon: 'Shield' },
    { label: 'Departments', path: '/admin/departments', icon: 'Building2' },
    { label: 'System Monitoring', path: '/admin/monitoring', icon: 'Activity' },
    { label: 'Settings', path: '/admin/settings', icon: 'Settings' },
  ],
};
