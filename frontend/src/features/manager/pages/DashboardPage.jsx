import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Tag, Typography, Row, Col, theme, Spin, Empty, message, Progress, Avatar } from 'antd';
import AIMatchScore from '../../../components/shared/AIMatchScore';
import { Users, CheckCircle, Clock, TrendingUp, Briefcase, ArrowRight } from 'lucide-react';
import { hiringManagerApi } from '../../../lib/api/hiringManager';
import { getApiErrorMessage } from '../../../lib/apiClient';

const { Title, Text } = Typography;

const DUMMY_SHORTLISTED = [
  { jobApplicationId: 'a1', candidateName: 'Sarah Mitchell', jobTitle: 'Senior Frontend Engineer', matchScore: 96, status: 'Interview', avatar: 'https://i.pravatar.cc/150?u=sarah-m', interviews: [{ id: 'i1', status: 'Completed', type: 'Technical', scheduledAt: '2026-07-20T14:00:00Z' }], feedbacks: [] },
  { jobApplicationId: 'a2', candidateName: 'James Rodriguez', jobTitle: 'Full Stack Developer', matchScore: 91, status: 'Interview', avatar: 'https://i.pravatar.cc/150?u=james-r', interviews: [{ id: 'i2', status: 'Completed', type: 'CulturalFit', scheduledAt: '2026-07-19T10:30:00Z' }], feedbacks: [] },
  { jobApplicationId: 'a3', candidateName: 'Emily Chen', jobTitle: 'Product Designer', matchScore: 87, status: 'Interview', avatar: 'https://i.pravatar.cc/150?u=emily-c', interviews: [{ id: 'i3', status: 'Scheduled', type: 'InitialScreen', scheduledAt: '2026-07-25T15:00:00Z' }], feedbacks: [] },
  { jobApplicationId: 'a4', candidateName: 'Michael Okafor', jobTitle: 'DevOps Engineer', matchScore: 83, status: 'Offer', avatar: 'https://i.pravatar.cc/150?u=michael-o', interviews: [{ id: 'i4', status: 'Completed', type: 'Final', scheduledAt: '2026-07-18T09:00:00Z' }], feedbacks: [{ id: 'f1' }] },
  { jobApplicationId: 'a5', candidateName: 'Priya Sharma', jobTitle: 'Data Analyst', matchScore: 78, status: 'Interview', avatar: 'https://i.pravatar.cc/150?u=priya-s3', interviews: [{ id: 'i5', status: 'Scheduled', type: 'Technical', scheduledAt: '2026-07-26T11:00:00Z' }], feedbacks: [] },
];

const DUMMY_DECISIONS = [
  { id: 'd1', jobApplicationId: 'dx1', candidateName: 'Alex Nguyen', jobTitle: 'Backend Engineer', decision: 'ExtendOffer' },
  { id: 'd2', jobApplicationId: 'dx2', candidateName: 'Lena Kowalski', jobTitle: 'QA Lead', decision: 'Reject' },
];

export default function HMDashboardPage() {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const [loading, setLoading] = useState(true);
  const [shortlisted, setShortlisted] = useState([]);
  const [decisions, setDecisions] = useState([]);

  useEffect(() => {
    Promise.all([hiringManagerApi.getShortlisted(), hiringManagerApi.getDecisions()])
      .then(([shortlistedData, decisionsData]) => {
        setShortlisted(shortlistedData?.length ? shortlistedData : DUMMY_SHORTLISTED);
        setDecisions(decisionsData?.length ? decisionsData : DUMMY_DECISIONS);
      })
      .catch(() => {
        setShortlisted(DUMMY_SHORTLISTED);
        setDecisions(DUMMY_DECISIONS);
      })
      .finally(() => setLoading(false));
  }, []);

  const needsFeedback = shortlisted.filter((c) =>
    c.interviews.some((i) => i.status === 'Completed') && c.feedbacks.length === 0
  );
  const pendingInterviews = shortlisted.filter((c) => c.interviews.some((i) => i.status === 'Scheduled')).length;
  const offerRate = shortlisted.length ? Math.round((shortlisted.filter(c => c.status === 'Offer').length / shortlisted.length) * 100) : 0;

  const metrics = [
    { label: 'Action Required', value: String(needsFeedback.length), icon: <Clock size={20} color="#d97706" />, bg: '#fffbeb', delta: 'Feedback pending', deltaColor: '#d97706' },
    { label: 'Pending Interviews', value: String(pendingInterviews), icon: <Users size={20} color={token.colorPrimary} />, bg: '#eef2ff', delta: 'This week', deltaColor: token.colorPrimary },
    { label: 'Decisions Made', value: String(decisions.length), icon: <CheckCircle size={20} color="#16a34a" />, bg: '#f0fdf4', delta: `${offerRate}% offer rate`, deltaColor: '#16a34a' },
    { label: 'Total Candidates', value: String(shortlisted.length), icon: <Briefcase size={20} color="#7c3aed" />, bg: '#f5f3ff', delta: 'In pipeline', deltaColor: '#7c3aed' },
  ];

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '64px 0' }}><Spin size="large" /></div>;
  }

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
          <Col xs={24} sm={12} md={6} key={i}>
            <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ backgroundColor: metric.bg, padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {metric.icon}
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: '13px', fontWeight: 500 }}>{metric.label}</Text>
                  <Title level={3} style={{ margin: 0 }}>{metric.value}</Title>
                  <Text style={{ fontSize: '12px', color: metric.deltaColor }}>{metric.delta}</Text>
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
              extra={<Button type="link" size="small" style={{ padding: 0 }} onClick={() => navigate('/hiring-manager/shortlisted')}>View All <ArrowRight size={14} style={{ marginLeft: 4 }} /></Button>}
              bordered={false}
              style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, height: '100%' }}
              bodyStyle={{ padding: 0 }}
            >
              {needsFeedback.length === 0 ? (
                <Empty description="Nothing needs your attention right now" style={{ padding: '32px 0' }} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {needsFeedback.map((candidate, index) => (
                    <div key={candidate.jobApplicationId} style={{ padding: '20px 24px', borderBottom: index < needsFeedback.length - 1 ? `1px solid ${token.colorBorder}` : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '200px' }}>
                          {candidate.avatar && <Avatar src={candidate.avatar} size={40} />}
                          <div style={{ minWidth: 0, overflow: 'hidden' }}>
                            <Title level={5} style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candidate.candidateName}</Title>
                            <Text type="secondary" style={{ fontSize: '13px', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candidate.jobTitle}</Text>
                          </div>
                          <AIMatchScore score={Math.round(candidate.matchScore)} size="sm" />
                        </div>
                        <Tag color="warning" style={{ margin: 0 }}>Feedback Required</Tag>
                      </div>
                      <div style={{ marginTop: '12px' }}>
                        <Button block onClick={() => navigate(`/hiring-manager/feedback?applicationId=${candidate.jobApplicationId}`)}>Provide Feedback</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </Col>

        {/* Team Pipeline */}
        <Col xs={24} lg={12}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Card title="Shortlisted Pipeline" bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, height: '100%' }} bodyStyle={{ padding: '24px' }}>
              {shortlisted.length === 0 ? (
                <Empty description="No shortlisted candidates yet" />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {shortlisted.slice(0, 6).map((c) => (
                    <div key={c.jobApplicationId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${token.colorBorder}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {c.avatar && <Avatar src={c.avatar} size={32} />}
                        <div>
                          <Text strong style={{ fontSize: '14px', display: 'block' }}>{c.candidateName}</Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>{c.jobTitle}</Text>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AIMatchScore score={Math.round(c.matchScore)} size="sm" />
                        <Tag color={c.status === 'Offer' ? 'success' : 'processing'} style={{ margin: 0 }}>{c.status}</Tag>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
