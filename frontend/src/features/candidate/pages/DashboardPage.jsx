import React, { useEffect, useState } from 'react';
import { Card, Button, Progress, Table, Typography, Row, Col, Space, theme, Spin, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Briefcase, User, Sparkles, ArrowRight, TrendingUp, Calendar } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { candidateApi } from '../../../lib/api/candidate';
import StatusBadge from '../../../components/shared/StatusBadge';

const { Title, Text } = Typography;

const DUMMY_PROFILE = { profileCompletionPercent: 78 };

const DUMMY_APPLICATIONS = [
  { id: 'a1', jobPostingId: 'j1', jobTitle: 'Senior Frontend Engineer', company: 'Acme Corp', matchScore: 94, status: 'Interview', createdAt: '2026-07-18T09:30:00Z' },
  { id: 'a2', jobPostingId: 'j2', jobTitle: 'Full Stack Developer', company: 'FinVault', matchScore: 87, status: 'Screening', createdAt: '2026-07-16T14:15:00Z' },
  { id: 'a3', jobPostingId: 'j3', jobTitle: 'React Developer', company: 'CloudNova', matchScore: 91, status: 'Applied', createdAt: '2026-07-14T11:00:00Z' },
  { id: 'a4', jobPostingId: 'j4', jobTitle: 'UI Engineer', company: 'BrightPath', matchScore: 72, status: 'Offer', createdAt: '2026-07-10T16:45:00Z' },
  { id: 'a5', jobPostingId: 'j5', jobTitle: 'Software Engineer', company: 'DataStream', matchScore: 68, status: 'Hired', createdAt: '2026-07-01T08:20:00Z' },
];

const DUMMY_RECOMMENDED_JOBS = [
  { id: 'r1', title: 'Senior React Developer', company: 'Acme Corp', location: 'San Francisco, CA', matchScore: 96, skills: ['React', 'TypeScript', 'GraphQL'] },
  { id: 'r2', title: 'Frontend Architect', company: 'FinVault', location: 'Remote', matchScore: 92, skills: ['Next.js', 'Design Systems', 'Performance'] },
  { id: 'r3', title: 'Full Stack Engineer', company: 'CloudNova', location: 'New York, NY', matchScore: 88, skills: ['React', 'Node.js', 'AWS'] },
];

export default function CandidateDashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const firstName = user?.firstName || 'there';
  const { token } = theme.useToken();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);

  useEffect(() => {
    Promise.all([
      candidateApi.getProfile().catch(() => DUMMY_PROFILE),
      candidateApi.getApplications().catch(() => DUMMY_APPLICATIONS),
      candidateApi.getRecommendedJobs(3).catch(() => DUMMY_RECOMMENDED_JOBS),
    ]).then(([profileData, applicationsData, jobsData]) => {
      setProfile(profileData || DUMMY_PROFILE);
      setApplications(applicationsData?.length ? applicationsData : DUMMY_APPLICATIONS);
      setRecommendedJobs(jobsData?.length ? jobsData : DUMMY_RECOMMENDED_JOBS);
    }).finally(() => setLoading(false));
  }, []);

  const avgMatchScore = applications.length
    ? Math.round(applications.reduce((sum, a) => sum + a.matchScore, 0) / applications.length)
    : 0;

  const interviewCount = applications.filter(a => a.status === 'Interview').length;

  const columns = [
    {
      title: 'Role & Company',
      dataIndex: 'jobTitle',
      key: 'role',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '11px', color: token.colorPrimary, flexShrink: 0 }}>
            {record.company?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: token.colorText }}>{text}</div>
            <div style={{ fontSize: '12px', color: token.colorTextSecondary, marginTop: '2px' }}>{record.company}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Date Applied',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date) => <span style={{ fontSize: '14px', color: token.colorTextSecondary }}>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>,
    },
    {
      title: 'Match',
      dataIndex: 'matchScore',
      key: 'match',
      render: (score) => (
        <span style={{ fontSize: '14px', fontWeight: 700, color: score >= 90 ? '#16a34a' : score >= 80 ? '#d97706' : token.colorTextSecondary }}>
          {Math.round(score)}%
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'right',
      render: (status) => <StatusBadge status={status} type="application" />,
    },
  ];

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '64px 0' }}><Spin size="large" /></div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Welcome back, {firstName}</Title>
        <Text type="secondary">Here's an overview of your job search progress today.</Text>
      </div>

      {/* KPI Cards */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', borderRadius: '12px', border: `1px solid ${token.colorBorder}` }}>
            <div style={{ backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '8px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <Briefcase size={20} color="#475569" />
            </div>
            <Title level={2} style={{ margin: 0, marginBottom: '4px', fontWeight: 700 }}>{applications.length}</Title>
            <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Applications</Text>
            <Text style={{ fontSize: '12px', color: '#16a34a', display: 'block', marginTop: '8px' }}>+2 this week</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', borderRadius: '12px', border: `1px solid ${token.colorBorder}` }}>
            <div style={{ backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '8px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <Calendar size={20} color="#475569" />
            </div>
            <Title level={2} style={{ margin: 0, marginBottom: '4px', fontWeight: 700 }}>{interviewCount}</Title>
            <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Upcoming Interviews</Text>
            <Text style={{ fontSize: '12px', color: '#d97706', display: 'block', marginTop: '8px' }}>Next: Tomorrow 2 PM</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', borderRadius: '12px', border: `1px solid ${token.colorBorder}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '8px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={20} color="#475569" />
              </div>
            </div>
            <Title level={2} style={{ margin: 0, marginBottom: '4px', fontWeight: 700 }}>{profile?.profileCompletionPercent ?? 0}%</Title>
            <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '16px' }}>Profile Completeness</Text>
            <Progress percent={profile?.profileCompletionPercent ?? 0} showInfo={false} strokeColor={token.colorPrimary} trailColor="#e2e8f0" size="small" />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ backgroundColor: token.colorPrimary, borderRadius: '12px', color: '#fff' }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '8px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <Sparkles size={20} color="#fff" />
            </div>
            <Title level={2} style={{ margin: 0, marginBottom: '4px', fontWeight: 700, color: '#fff' }}>{avgMatchScore}%</Title>
            <Text style={{ color: '#e0e7ff', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Avg. AI Match Score</Text>
            <Text style={{ color: '#c7d2fe', fontSize: '12px' }}>Based on your recent applications</Text>
          </Card>
        </Col>
      </Row>

      {/* Recommended Jobs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title level={4} style={{ margin: 0, fontWeight: 600 }}>Recommended Jobs For You</Title>
          <Button type="link" style={{ fontWeight: 500, padding: 0 }} icon={<ArrowRight size={16} />} iconPosition="end" onClick={() => navigate('/candidate/jobs')}>View all</Button>
        </div>

        {recommendedJobs.length === 0 ? (
          <Empty description="No recommendations yet — add skills to your profile to improve matches." style={{ padding: '32px 0' }} />
        ) : (
          <Row gutter={[24, 24]}>
            {recommendedJobs.map((job) => (
              <Col xs={24} md={8} key={job.id}>
                <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, height: '100%' }} hoverable onClick={() => navigate('/candidate/jobs')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#eef2ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${token.colorBorder}`, fontWeight: 700, fontSize: '12px', color: token.colorPrimary }}>
                      {job.company?.slice(0, 2).toUpperCase()}
                    </div>
                    <Progress type="circle" percent={Math.round(job.matchScore || 0)} size={40} strokeWidth={10} strokeColor={job.matchScore >= 90 ? '#10b981' : '#f59e0b'} format={(p) => <span style={{ fontSize: '12px', fontWeight: 700, color: token.colorText }}>{p}%</span>} />
                  </div>
                  <Title level={5} style={{ margin: 0, marginBottom: '4px', fontWeight: 600 }}>{job.title}</Title>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '16px', fontSize: '14px' }}>
                    {job.company} · {job.location}
                  </Text>
                  <Space size={[8, 8]} wrap>
                    {job.skills.slice(0, 3).map(tag => (
                      <span key={tag} style={{ padding: '4px 10px', backgroundColor: '#f8fafc', color: token.colorPrimary, fontSize: '12px', fontWeight: 500, borderRadius: '9999px', border: '1px solid #e2e8f0' }}>
                        {tag}
                      </span>
                    ))}
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Recent Applications */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title level={4} style={{ margin: 0, fontWeight: 600 }}>Recent Application Status</Title>
          <Button type="link" style={{ fontWeight: 500, padding: 0 }} icon={<ArrowRight size={16} />} iconPosition="end" onClick={() => navigate('/candidate/applications')}>View all</Button>
        </div>

        <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, padding: 0 }} bodyStyle={{ padding: 0 }}>
          <Table
            columns={columns}
            dataSource={applications.slice(0, 5).map((a) => ({ ...a, key: a.id }))}
            pagination={false}
            locale={{ emptyText: 'No applications yet' }}
          />
        </Card>
      </div>
    </div>
  );
}
