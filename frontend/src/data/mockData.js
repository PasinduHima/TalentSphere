import { ROLES, JOB_STATUSES, APPLICATION_STATUSES } from '../lib/constants';

export const mockJobs = [
  {
    id: 'job-1',
    title: 'Senior Frontend Engineer',
    company: 'Acme Corp',
    location: 'Remote',
    type: 'Full-time',
    salary: '$140k - $180k',
    matchScore: 94,
    skills: ['React', 'TypeScript', 'System Design'],
    postedAt: '2026-07-01T10:00:00Z',
    status: JOB_STATUSES.ACTIVE,
    applicants: 45,
  },
  {
    id: 'job-2',
    title: 'UI/UX Designer',
    company: 'FinTrust',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$120k - $150k',
    matchScore: 82,
    skills: ['Figma', 'Prototyping', 'Design Systems'],
    postedAt: '2026-07-05T09:00:00Z',
    status: JOB_STATUSES.ACTIVE,
    applicants: 112,
  },
  {
    id: 'job-3',
    title: 'Product Manager',
    company: 'HealthFlow',
    location: 'Remote',
    type: 'Full-time',
    salary: '$130k - $160k',
    matchScore: 65,
    skills: ['Agile', 'Roadmapping', 'Data Analysis'],
    postedAt: '2026-07-10T08:30:00Z',
    status: JOB_STATUSES.ACTIVE,
    applicants: 28,
  },
];

export const mockApplications = [
  {
    id: 'app-1',
    jobId: 'job-1',
    jobTitle: 'Senior Frontend Engineer',
    company: 'Acme Corp',
    appliedAt: '2026-07-08T14:20:00Z',
    status: APPLICATION_STATUSES.INTERVIEW,
    nextStep: 'Technical Interview with Jane Doe on Jul 14',
  },
  {
    id: 'app-2',
    jobId: 'job-2',
    jobTitle: 'Lead UI Designer',
    company: 'Acme Corp',
    appliedAt: '2026-07-02T11:15:00Z',
    status: APPLICATION_STATUSES.SCREENING,
    nextStep: 'Awaiting Recruiter Review',
  },
];

export const mockStats = {
  candidate: {
    activeApplications: 12,
    profileCompletion: 85,
    matchScoreLevel: 'High',
  }
};
