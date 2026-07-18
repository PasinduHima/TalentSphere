import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Button, Slider, Input, Typography, Row, Col, theme, Select, Spin, Empty, message } from 'antd';
import AIMatchScore from '../../../components/shared/AIMatchScore';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { hiringManagerApi } from '../../../lib/api/hiringManager';
import { getApiErrorMessage } from '../../../lib/apiClient';

const { TextArea } = Input;
const { Title, Text } = Typography;

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
        const match = list.find((c) => c.jobApplicationId === applicationId);
        setCandidate(match || null);
        const pendingInterview = match?.interviews.find((i) => i.status === 'Completed') || match?.interviews[0];
        if (pendingInterview) setInterviewId(pendingInterview.id);
      })
      .catch((err) => message.error(getApiErrorMessage(err, 'Failed to load candidate.')))
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
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to submit feedback.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '64px 0' }}><Spin size="large" /></div>;
  }

  if (!applicationId || !candidate) {
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
            <Title level={4} style={{ margin: 0, fontWeight: 700 }}>{candidate.candidateName}</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>{candidate.jobTitle}</Text>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <AIMatchScore score={Math.round(candidate.matchScore)} size="lg" />
            </div>

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
                <div>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Technical Skills Rating (0-10)</Text>
                  <Slider min={0} max={10} value={technicalScore} onChange={setTechnicalScore} />
                </div>
                <div>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Communication Rating (0-10)</Text>
                  <Slider min={0} max={10} value={communicationScore} onChange={setCommunicationScore} />
                </div>
                <div>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Culture Fit Rating (0-10)</Text>
                  <Slider min={0} max={10} value={cultureFitScore} onChange={setCultureFitScore} />
                </div>
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
                <Button type="primary" onClick={handleSubmit} loading={submitting}>Submit Feedback</Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
