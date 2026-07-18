import React, { useEffect, useState } from 'react';
import { Card, Button, Progress, Table, Typography, Row, Col, Space, theme, Spin, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Briefcase, User, Sparkles, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { candidateApi } from '../../../lib/api/candidate';
import StatusBadge from '../../../components/shared/StatusBadge';

const { Title, Text } = Typography;

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
      candidateApi.getProfile(),
      candidateApi.getApplications(),
      candidateApi.getRecommendedJobs(3),
    ]).then(([profileData, applicationsData, jobsData]) => {
      setProfile(profileData);
      setApplications(applicationsData);
      setRecommendedJobs(jobsData);
    }).finally(() => setLoading(false));
  }, []);

  const avgMatchScore = applications.length
    ? Math.round(applications.reduce((sum, a) => sum + a.matchScore, 0) / applications.length)
    : 0;

  const columns = [
    {
      title: 'Role & Company',
      dataIndex: 'jobTitle',
      key: 'role',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500, color: token.colorText }}>{text}</div>
          <div style={{ fontSize: '12px', color: token.colorTextSecondary, marginTop: '2px' }}>{record.company}</div>
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
      render: (score) => <span style={{ fontSize: '14px', fontWeight: 600, color: token.colorText }}>{Math.round(score)}%</span>,
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
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', borderRadius: '12px', border: `1px solid ${token.colorBorder}` }}>
            <div style={{ backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '8px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
              <Briefcase size={20} color="#475569" />
            </div>
            <div>
              <Title level={2} style={{ margin: 0, marginBottom: '4px', fontWeight: 700 }}>{applications.length}</Title>
              <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Applications</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card bordered={false} style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', borderRadius: '12px', border: `1px solid ${token.colorBorder}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div style={{ backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '8px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={20} color="#475569" />
              </div>
            </div>
            <div>
              <Title level={2} style={{ margin: 0, marginBottom: '4px', fontWeight: 700 }}>{profile?.profileCompletionPercent ?? 0}%</Title>
              <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '16px' }}>Profile Completeness</Text>
              <Progress percent={profile?.profileCompletionPercent ?? 0} showInfo={false} strokeColor={token.colorPrimary} trailColor="#e2e8f0" size="small" />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card bordered={false} style={{ backgroundColor: token.colorPrimary, borderRadius: '12px', color: '#fff' }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '8px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
              <Sparkles size={20} color="#fff" />
            </div>
            <div>
              <Title level={2} style={{ margin: 0, marginBottom: '4px', fontWeight: 700, color: '#fff' }}>{avgMatchScore}%</Title>
              <Text style={{ color: '#e0e7ff', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Avg. AI Match Score</Text>
              <Text style={{ color: '#c7d2fe', fontSize: '12px' }}>Based on your recent applications</Text>
            </div>
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
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                      <div style={{ width: '24px', height: '24px', backgroundColor: token.colorPrimary, borderRadius: '4px', opacity: 0.2 }}></div>
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
