import { ROLES } from './constants';

// Backend (ASP.NET Identity) roles are PascalCase; the frontend's routing,
// sidebar nav, and ProtectedRoute checks all key off the lowercase/snake_case
// values in lib/constants.js. This maps between the two representations.
const BACKEND_TO_FRONTEND = {
  Candidate: ROLES.CANDIDATE,
  Recruiter: ROLES.RECRUITER,
  HiringManager: ROLES.HIRING_MANAGER,
  Admin: ROLES.ADMIN,
};

const FRONTEND_TO_BACKEND = {
  [ROLES.CANDIDATE]: 'Candidate',
  [ROLES.RECRUITER]: 'Recruiter',
  [ROLES.HIRING_MANAGER]: 'HiringManager',
  [ROLES.ADMIN]: 'Admin',
};

export function toFrontendRole(backendRole) {
  return BACKEND_TO_FRONTEND[backendRole] ?? ROLES.CANDIDATE;
}

export function toBackendRole(frontendRole) {
  return FRONTEND_TO_BACKEND[frontendRole] ?? 'Candidate';
}

export function roleToPath(frontendRole) {
  return frontendRole === ROLES.HIRING_MANAGER ? 'hiring-manager' : frontendRole;
}

// Each role's router config lands on a different default child route (see
// router/index.jsx) — Recruiter has no `dashboard` path and defaults to `jobs`.
export function getDefaultRouteForRole(frontendRole) {
  const base = roleToPath(frontendRole);
  const landingSegment = frontendRole === ROLES.RECRUITER ? 'jobs' : 'dashboard';
  return `/${base}/${landingSegment}`;
}
