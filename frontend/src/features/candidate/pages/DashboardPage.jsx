import React from 'react';
import { Card, Button, Progress, Table, Typography, Row, Col, Space, theme } from 'antd';
import { Briefcase, User, Sparkles, ArrowRight, Clock } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

const { Title, Text } = Typography;

export default function CandidateDashboardPage() {
  const { user } = useAuthStore();
  const firstName = user?.name?.split(' ')[0] || 'Alex';
  const { token } = theme.useToken();

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
      dataIndex: 'appliedDate',
      key: 'date',
      render: (date) => <span style={{ fontSize: '14px', color: token.colorTextSecondary }}>{new Date(date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>,
    },
    {
      title: 'Match',
      dataIndex: 'matchScore',
      key: 'match',
      render: (score) => <span style={{ fontSize: '14px', fontWeight: 600, color: token.colorText }}>{score || 94}%</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'right',
      render: (status) => {
        let colorClass = '#f8fafc';
        let borderColor = '#e2e8f0';
        let textColor = '#334155';
        let dotColor = '#94a3b8';
        
        if (status === 'interviewing') {
          colorClass = '#fff'; textColor = '#0f172a'; dotColor = '#10b981';
        } else if (status === 'under_review' || status === 'reviewing' || status === 'screening') {
          colorClass = '#fff'; textColor = '#0f172a'; dotColor = '#f59e0b';
        } else if (status === 'rejected') {
          colorClass = '#fff'; textColor = '#0f172a'; dotColor = '#ef4444';
        } else if (status === 'offer') {
          colorClass = '#fff'; textColor = '#0f172a'; dotColor = '#10b981';
        }

        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.025em', backgroundColor: colorClass, border: `1px solid ${borderColor}`, color: textColor }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: dotColor }}></span>
            {status.replace('_', ' ')}
            <span style={{ color: token.colorTextSecondary, marginLeft: '4px', fontWeight: 500 }}>(1)</span>
          </span>
        );
      },
    },
  ];

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
              <Title level={2} style={{ margin: 0, marginBottom: '4px', fontWeight: 700 }}>3</Title>
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
              <span style={{ backgroundColor: '#d1fae5', color: '#059669', fontSize: '12px', fontWeight: 500, padding: '4px 8px', borderRadius: '6px' }}>
                +15% this week
              </span>
            </div>
            <div>
              <Title level={2} style={{ margin: 0, marginBottom: '4px', fontWeight: 700 }}>85%</Title>
              <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '16px' }}>Profile Completeness</Text>
              <Progress percent={85} showInfo={false} strokeColor={token.colorPrimary} trailColor="#e2e8f0" size="small" />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card bordered={false} style={{ backgroundColor: token.colorPrimary, borderRadius: '12px', color: '#fff' }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '8px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
              <Sparkles size={20} color="#fff" />
            </div>
            <div>
              <Title level={2} style={{ margin: 0, marginBottom: '4px', fontWeight: 700, color: '#fff' }}>92%</Title>
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
          <Button type="link" style={{ fontWeight: 500, padding: 0 }} icon={<ArrowRight size={16} />} iconPosition="end">View all</Button>
        </div>
        
        <Row gutter={[24, 24]}>
          {[
            { title: 'Senior UX Researcher', company: 'Nexus Tech', location: 'San Francisco, CA (Hybrid)', salary: '$130,000 - $160,000', match: 95, tags: ['User Testing', 'Figma', 'Data Analysis'] },
            { title: 'Lead Product Designer', company: 'FinEdge', location: 'Remote', salary: '$145,000 - $175,000', match: 88, tags: ['Design Systems', 'Prototyping', '+2'] },
            { title: 'UI Designer', company: 'Creativ Studio', location: 'New York, NY (On-site)', salary: '$110,000 - $135,000', match: 82, tags: ['UI/UX', 'Wireframing', 'CSS'] }
          ].map((job, idx) => (
            <Col xs={24} md={8} key={idx}>
              <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                    <div style={{ width: '24px', height: '24px', backgroundColor: token.colorPrimary, borderRadius: '4px', opacity: 0.2 }}></div>
                  </div>
                  <Progress type="circle" percent={job.match} size={40} strokeWidth={10} strokeColor={job.match >= 90 ? '#10b981' : '#f59e0b'} format={(p) => <span style={{ fontSize: '12px', fontWeight: 700, color: token.colorText }}>{p}%</span>} />
                </div>
                <Title level={5} style={{ margin: 0, marginBottom: '4px', fontWeight: 600 }}>{job.title}</Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: '16px', fontSize: '14px' }}>
                  {job.company} · {job.location}
                </Text>
                <Text strong style={{ display: 'block', marginBottom: '24px', fontSize: '14px' }}>{job.salary}</Text>
                <Space size={[8, 8]} wrap>
                  {job.tags.map(tag => (
                    <span key={tag} style={{ padding: '4px 10px', backgroundColor: '#f8fafc', color: token.colorPrimary, fontSize: '12px', fontWeight: 500, borderRadius: '9999px', border: '1px solid #e2e8f0' }}>
                      {tag}
                    </span>
                  ))}
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Recent Applications */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title level={4} style={{ margin: 0, fontWeight: 600 }}>Recent Application Status</Title>
          <Button type="link" style={{ fontWeight: 500, padding: 0 }} icon={<ArrowRight size={16} />} iconPosition="end">View all</Button>
        </div>
        
        <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, padding: 0 }} bodyStyle={{ padding: 0 }}>
          <Table 
            columns={columns} 
            dataSource={[
              { key: 1, jobTitle: 'Product Designer', company: 'GlobalTech Inc.', appliedDate: '2026-10-12', matchScore: 94, status: 'interviewing' },
              { key: 2, jobTitle: 'UX Architect', company: 'Elevate Systems', appliedDate: '2026-10-05', matchScore: 89, status: 'under_review' },
              { key: 3, jobTitle: 'Senior Product Designer', company: 'Innovate AI', appliedDate: '2026-09-28', matchScore: 96, status: 'screening' },
              { key: 4, jobTitle: 'Visual Designer', company: 'CreativeMinds', appliedDate: '2026-09-15', matchScore: 78, status: 'rejected' },
              { key: 5, jobTitle: 'Interaction Designer', company: 'Synergy Corp', appliedDate: '2026-09-02', matchScore: 91, status: 'offer' },
            ]} 
            pagination={false}
          />
        </Card>
      </div>
    </div>
  );
}
