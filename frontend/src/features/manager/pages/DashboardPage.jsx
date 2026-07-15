import React from 'react';
import { Card, Button, Tag, Typography, Row, Col, Space, theme } from 'antd';
import AIMatchScore from '../../../components/shared/AIMatchScore';
import { Users, CheckCircle, Clock, ChevronRight, MessageSquare } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

const { Title, Text } = Typography;

export default function HMDashboardPage() {
  const { user } = useAuthStore();
  const { token } = theme.useToken();

  const metrics = [
    { label: 'Action Required', value: '4', icon: <Clock size={20} color="#d97706" />, bg: '#fffbeb' },
    { label: 'Pending Interviews', value: '6', icon: <Users size={20} color={token.colorPrimary} />, bg: '#eef2ff' },
    { label: 'Decisions Made', value: '12', icon: <CheckCircle size={20} color="#16a34a" />, bg: '#f0fdf4' },
  ];

  const candidatesToReview = [
    { id: 1, name: 'Sarah Jenkins', role: 'Senior Frontend Engineer', matchScore: 94, status: 'Interview Feedback Required', date: 'Today, 2:00 PM' },
    { id: 2, name: 'Michael Chang', role: 'Frontend Developer', matchScore: 88, status: 'Initial Review', date: 'Yesterday' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Hiring Manager Dashboard</Title>
          <Text type="secondary" style={{ marginTop: '4px', display: 'block' }}>Review candidates and make hiring decisions.</Text>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {metrics.map((metric, i) => (
          <Col xs={24} md={8} key={i}>
            <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ backgroundColor: metric.bg, padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {metric.icon}
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: '14px', fontWeight: 500 }}>{metric.label}</Text>
                  <Title level={3} style={{ margin: 0 }}>{metric.value}</Title>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* Candidates Requiring Attention */}
        <Col xs={24} lg={12}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Card 
              title="Needs Your Attention" 
              extra={<Button type="link" size="small" style={{ padding: 0 }}>View All</Button>}
              bordered={false}
              style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, height: '100%' }}
              bodyStyle={{ padding: 0 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {candidatesToReview.map((candidate, index) => (
                  <div key={candidate.id} style={{ padding: '24px', borderBottom: index < candidatesToReview.length - 1 ? `1px solid ${token.colorBorder}` : 'none', transition: 'background-color 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '200px' }}>
                        <div style={{ flexShrink: 0 }}>
                          <AIMatchScore score={candidate.matchScore} size="sm" />
                        </div>
                        <div style={{ minWidth: 0, overflow: 'hidden' }}>
                          <Title level={5} style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candidate.name}</Title>
                          <Text type="secondary" style={{ fontSize: '14px', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candidate.role}</Text>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
                        <Tag color="warning" style={{ margin: 0 }}>{candidate.status}</Tag>
                        <Text type="secondary" style={{ fontSize: '12px', marginTop: '8px' }}>{candidate.date}</Text>
                      </div>
                    </div>
                    <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                      <Button block>Provide Feedback</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Col>

        {/* Team Updates / Pipeline */}
        <Col xs={24} lg={12}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Card title="Team Pipeline" bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, height: '100%' }} bodyStyle={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[
                  { role: 'Senior Frontend Engineer', count: 12, stage: 'Interviewing' },
                  { role: 'Product Designer', count: 4, stage: 'Screening' },
                  { role: 'Backend Engineer', count: 1, stage: 'Offer' }
                ].map((job, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <Text strong style={{ fontSize: '16px', display: 'block' }}>{job.role}</Text>
                      <Text type="secondary">{job.count} candidates in {job.stage}</Text>
                    </div>
                    <Button type="text" icon={<ChevronRight size={20} color={token.colorTextSecondary} />} />
                  </div>
                ))}
              </div>
              
              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: `1px solid ${token.colorBorder}` }}>
                <Text strong style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <MessageSquare size={16} /> Recent Recruiter Notes
                </Text>
                <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', fontSize: '14px', color: token.colorText, border: `1px solid ${token.colorBorder}` }}>
                  <Text strong>David Chen (Recruiter):</Text> "I've sent over 3 strong candidates for the Frontend role. Let me know your thoughts on Sarah."
                </div>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
