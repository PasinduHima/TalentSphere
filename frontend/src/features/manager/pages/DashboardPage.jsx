import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Tag, Typography, Row, Col, theme, Spin, Empty, message } from 'antd';
import AIMatchScore from '../../../components/shared/AIMatchScore';
import { Users, CheckCircle, Clock } from 'lucide-react';
import { hiringManagerApi } from '../../../lib/api/hiringManager';
import { getApiErrorMessage } from '../../../lib/apiClient';

const { Title, Text } = Typography;

export default function HMDashboardPage() {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const [loading, setLoading] = useState(true);
  const [shortlisted, setShortlisted] = useState([]);
  const [decisions, setDecisions] = useState([]);

  useEffect(() => {
    Promise.all([hiringManagerApi.getShortlisted(), hiringManagerApi.getDecisions()])
      .then(([shortlistedData, decisionsData]) => {
        setShortlisted(shortlistedData);
        setDecisions(decisionsData);
      })
      .catch((err) => message.error(getApiErrorMessage(err, 'Failed to load dashboard data.')))
      .finally(() => setLoading(false));
  }, []);

  const needsFeedback = shortlisted.filter((c) =>
    c.interviews.some((i) => i.status === 'Completed') && c.feedbacks.length === 0
  );
  const pendingInterviews = shortlisted.filter((c) => c.interviews.some((i) => i.status === 'Scheduled')).length;

  const metrics = [
    { label: 'Action Required', value: String(needsFeedback.length), icon: <Clock size={20} color="#d97706" />, bg: '#fffbeb' },
    { label: 'Pending Interviews', value: String(pendingInterviews), icon: <Users size={20} color={token.colorPrimary} />, bg: '#eef2ff' },
    { label: 'Decisions Made', value: String(decisions.length), icon: <CheckCircle size={20} color="#16a34a" />, bg: '#f0fdf4' },
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
              extra={<Button type="link" size="small" style={{ padding: 0 }} onClick={() => navigate('/hiring-manager/shortlisted')}>View All</Button>}
              bordered={false}
              style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, height: '100%' }}
              bodyStyle={{ padding: 0 }}
            >
              {needsFeedback.length === 0 ? (
                <Empty description="Nothing needs your attention right now" style={{ padding: '32px 0' }} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {needsFeedback.map((candidate, index) => (
                    <div key={candidate.jobApplicationId} style={{ padding: '24px', borderBottom: index < needsFeedback.length - 1 ? `1px solid ${token.colorBorder}` : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '200px' }}>
                          <AIMatchScore score={Math.round(candidate.matchScore)} size="sm" />
                          <div style={{ minWidth: 0, overflow: 'hidden' }}>
                            <Title level={5} style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candidate.candidateName}</Title>
                            <Text type="secondary" style={{ fontSize: '14px', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candidate.jobTitle}</Text>
                          </div>
                        </div>
                        <Tag color="warning" style={{ margin: 0 }}>Feedback Required</Tag>
                      </div>
                      <div style={{ marginTop: '16px' }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {shortlisted.slice(0, 6).map((c) => (
                    <div key={c.jobApplicationId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <Text strong style={{ fontSize: '15px', display: 'block' }}>{c.candidateName}</Text>
                        <Text type="secondary">{c.jobTitle} · {c.status}</Text>
                      </div>
                      <Tag color={c.status === 'Offer' ? 'success' : 'processing'}>{c.status}</Tag>
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
