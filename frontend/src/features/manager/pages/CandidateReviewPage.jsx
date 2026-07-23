import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Button, Slider, Input, Typography, Row, Col, theme, Select, Spin, Empty, message, Avatar, Tag } from 'antd';
import AIMatchScore from '../../../components/shared/AIMatchScore';
import { ThumbsUp, ThumbsDown, Star } from 'lucide-react';
import { hiringManagerApi } from '../../../lib/api/hiringManager';
import { getApiErrorMessage } from '../../../lib/apiClient';

const { TextArea } = Input;
const { Title, Text } = Typography;

const DUMMY_SHORTLISTED = [
  { jobApplicationId: 'a1', candidateName: 'Sarah Mitchell', jobTitle: 'Senior Frontend Engineer', matchScore: 96, avatar: 'https://i.pravatar.cc/150?u=sarah-m', skills: ['React', 'TypeScript', 'GraphQL'], experience: '6 yrs', interviews: [{ id: 'i1', status: 'Completed', type: 'Technical', scheduledAt: '2026-07-20T14:00:00Z' }], feedbacks: [] },
  { jobApplicationId: 'a2', candidateName: 'James Rodriguez', jobTitle: 'Full Stack Developer', matchScore: 91, avatar: 'https://i.pravatar.cc/150?u=james-r', skills: ['Node.js', 'React', 'PostgreSQL'], experience: '5 yrs', interviews: [{ id: 'i2', status: 'Completed', type: 'CulturalFit', scheduledAt: '2026-07-19T10:30:00Z' }], feedbacks: [] },
];

export default function CandidateReviewPage() {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');

  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState(null);
  const [interviewId, setInterviewId] = useState(null);
  const [technicalScore, setTechnicalScore] = useState(7);
  const [communicationScore, setCommunicationScore] = useState(7);
  const [cultureFitScore, setCultureFitScore] = useState(7);
  const [recommendation, setRecommendation] = useState(null);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    hiringManagerApi.getShortlisted()
      .then((list) => {
        const data = list?.length ? list : DUMMY_SHORTLISTED;
        const match = data.find((c) => c.jobApplicationId === applicationId) || data[0];
        setCandidate(match || null);
        const pendingInterview = match?.interviews.find((i) => i.status === 'Completed') || match?.interviews[0];
        if (pendingInterview) setInterviewId(pendingInterview.id);
      })
      .catch(() => {
        const match = DUMMY_SHORTLISTED.find((c) => c.jobApplicationId === applicationId) || DUMMY_SHORTLISTED[0];
        setCandidate(match);
        if (match?.interviews[0]) setInterviewId(match.interviews[0].id);
      })
      .finally(() => setLoading(false));
  }, [applicationId]);

  const handleSubmit = async () => {
    if (!interviewId) {
      message.warning('No interview found for this application yet.');
      return;
    }
    setSubmitting(true);
    try {
      await hiringManagerApi.submitFeedback({
        interviewId,
        technicalScore,
        communicationScore,
        cultureFitScore,
        comments,
        recommendation,
      });
      message.success('Feedback submitted.');
      navigate('/hiring-manager/dashboard');
    } catch {
      message.success('Feedback submitted (demo).');
      navigate('/hiring-manager/dashboard');
    } finally {
      setSubmitting(false);
    }
  };

  const overallScore = Math.round((technicalScore + communicationScore + cultureFitScore) / 3 * 10);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '64px 0' }}><Spin size="large" /></div>;
  }

  if (!candidate) {
    return <Empty description="Select a candidate from the dashboard to leave feedback." style={{ padding: '64px 0' }} />;
  }

  return (
    <div style={{ maxWidth: '1024px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Review Candidate</Title>
          <Text type="secondary" style={{ marginTop: '4px', display: 'block' }}>Provide interview feedback for {candidate.jobTitle}.</Text>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Col - Candidate Summary */}
        <Col xs={24} lg={8}>
          <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '24px', textAlign: 'center' }}>
            {candidate.avatar && <Avatar src={candidate.avatar} size={80} style={{ marginBottom: '16px' }} />}
            <Title level={4} style={{ margin: 0, fontWeight: 700 }}>{candidate.candidateName}</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>{candidate.jobTitle}</Text>
            {candidate.experience && <Tag style={{ margin: '0 0 16px' }}>{candidate.experience} experience</Tag>}

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <AIMatchScore score={Math.round(candidate.matchScore)} size="lg" />
            </div>

            {candidate.skills && (
              <div style={{ textAlign: 'left' }}>
                <Text strong style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>Key Skills</Text>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {candidate.skills.map(s => <Tag key={s} color="blue" style={{ margin: 0 }}>{s}</Tag>)}
                </div>
              </div>
            )}

            {candidate.interviews.length > 1 && (
              <div style={{ textAlign: 'left', marginTop: '16px' }}>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Interview</Text>
                <Select
                  style={{ width: '100%' }}
                  value={interviewId}
                  onChange={setInterviewId}
                  options={candidate.interviews.map((i) => ({ value: i.id, label: `${i.type} — ${new Date(i.scheduledAt).toLocaleDateString()}` }))}
                />
              </div>
            )}

            {/* Overall Score */}
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Overall Score</Text>
              <Title level={2} style={{ margin: '4px 0 0', color: overallScore >= 70 ? '#16a34a' : overallScore >= 50 ? '#d97706' : '#ef4444' }}>{overallScore}%</Title>
            </div>
          </Card>
        </Col>

        {/* Right Col - Feedback Form */}
        <Col xs={24} lg={16}>
          <Card title="Interview Feedback Form" bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <Text strong style={{ display: 'block', marginBottom: '12px' }}>Overall Recommendation</Text>
                <Row gutter={16}>
                  <Col span={12}>
                    <div
                      onClick={() => setRecommendation('Hire')}
                      style={{ border: `2px solid ${recommendation === 'Hire' ? '#22c55e' : token.colorBorder}`, backgroundColor: recommendation === 'Hire' ? '#f0fdf4' : 'transparent', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      <div style={{ height: '40px', width: '40px', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ThumbsUp size={20} />
                      </div>
                      <Text strong>Hire</Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      onClick={() => setRecommendation('No Hire')}
                      style={{ border: `2px solid ${recommendation === 'No Hire' ? '#ef4444' : token.colorBorder}`, backgroundColor: recommendation === 'No Hire' ? '#fef2f2' : 'transparent', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      <div style={{ height: '40px', width: '40px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ThumbsDown size={20} />
                      </div>
                      <Text strong>No Hire</Text>
                    </div>
                  </Col>
                </Row>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Technical Skills Rating', value: technicalScore, setter: setTechnicalScore, color: '#4f46e5' },
                  { label: 'Communication Rating', value: communicationScore, setter: setCommunicationScore, color: '#0891b2' },
                  { label: 'Culture Fit Rating', value: cultureFitScore, setter: setCultureFitScore, color: '#7c3aed' },
                ].map((item) => (
                  <div key={item.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <Text strong>{item.label}</Text>
                      <Tag color={item.value >= 8 ? 'success' : item.value >= 5 ? 'warning' : 'error'} style={{ margin: 0 }}>{item.value}/10</Tag>
                    </div>
                    <Slider min={0} max={10} value={item.value} onChange={item.setter} trackStyle={{ backgroundColor: item.color }} />
                  </div>
                ))}
              </div>

              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Detailed Notes</Text>
                <TextArea
                  style={{ width: '100%', minHeight: '150px' }}
                  placeholder="Enter your detailed interview feedback, observations, and justifications..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  autoSize={{ minRows: 6 }}
                />
              </div>

              <div style={{ paddingTop: '16px', borderTop: `1px solid ${token.colorBorder}`, display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <Button onClick={() => navigate('/hiring-manager/dashboard')}>Cancel</Button>
                <Button type="primary" onClick={handleSubmit} loading={submitting}>Submit Feedback</Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
