import React from 'react';
import { Card, Button, Slider, Input, Typography, Row, Col, theme } from 'antd';
import AIMatchScore from '../../../components/shared/AIMatchScore';
import { ThumbsUp, ThumbsDown, Video, FileText } from 'lucide-react';

const { TextArea } = Input;
const { Title, Text } = Typography;

export default function CandidateReviewPage() {
  const { token } = theme.useToken();
  const candidate = {
    name: 'Sarah Jenkins',
    role: 'Senior Frontend Engineer',
    matchScore: 94,
    strengths: ['React & Ecosystem', 'System Design', 'Communication'],
    weaknesses: ['Limited Backend Node.js'],
  };

  return (
    <div style={{ maxWidth: '1024px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Review Candidate</Title>
          <Text type="secondary" style={{ marginTop: '4px', display: 'block' }}>Provide interview feedback for {candidate.role}.</Text>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Col - Candidate Summary */}
        <Col xs={24} lg={8}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '24px', textAlign: 'center' }}>
              <img 
                src="https://i.pravatar.cc/150?u=sarah" 
                alt={candidate.name} 
                style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: `1px solid ${token.colorBorder}`, margin: '0 auto 16px' }}
              />
              <Title level={4} style={{ margin: 0, fontWeight: 700 }}>{candidate.name}</Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>{candidate.role}</Text>
              
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <AIMatchScore score={candidate.matchScore} size="lg" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '24px', borderTop: `1px solid ${token.colorBorder}` }}>
                <Button block icon={<FileText size={16} />}>View Resume</Button>
                <Button block icon={<Video size={16} />}>Interview Recording</Button>
              </div>
            </Card>
            
            <Card 
              title="AI Screening Summary" 
              bordered={false}
              style={{ backgroundColor: '#eef2ff', borderColor: '#c7d2fe', borderRadius: '12px' }}
              headStyle={{ borderBottom: '1px solid rgba(199, 210, 254, 0.5)' }}
              bodyStyle={{ padding: '20px' }}
            >
              <Text strong style={{ color: '#3730a3', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Strengths:</Text>
              <ul style={{ paddingLeft: '20px', margin: 0, marginBottom: '16px', color: '#4338ca', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {candidate.strengths.map(s => <li key={s}>{s}</li>)}
              </ul>
              <Text strong style={{ color: '#3730a3', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Areas to probe:</Text>
              <ul style={{ paddingLeft: '20px', margin: 0, color: '#4338ca', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {candidate.weaknesses.map(w => <li key={w}>{w}</li>)}
              </ul>
            </Card>
          </div>
        </Col>

        {/* Right Col - Feedback Form */}
        <Col xs={24} lg={16}>
          <Card title="Interview Feedback Form" bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <Text strong style={{ display: 'block', marginBottom: '12px' }}>Overall Recommendation</Text>
                <Row gutter={16}>
                  <Col span={12}>
                    <div style={{ border: `2px solid ${token.colorBorder}`, borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#22c55e'; e.currentTarget.style.backgroundColor = '#f0fdf4'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = token.colorBorder; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                      <div style={{ height: '40px', width: '40px', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ThumbsUp size={20} />
                      </div>
                      <Text strong>Hire</Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ border: `2px solid ${token.colorBorder}`, borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.backgroundColor = '#fef2f2'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = token.colorBorder; e.currentTarget.style.backgroundColor = 'transparent'; }}>
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
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Technical Skills Rating (1-5)</Text>
                  <Slider min={1} max={5} defaultValue={4} marks={{1: '1', 2: '2', 3: '3', 4: '4', 5: '5'}} />
                </div>
                <div style={{ marginTop: '24px' }}>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Culture Fit Rating (1-5)</Text>
                  <Slider min={1} max={5} defaultValue={5} marks={{1: '1', 2: '2', 3: '3', 4: '4', 5: '5'}} />
                </div>
              </div>

              <div style={{ marginTop: '32px' }}>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Detailed Notes</Text>
                <TextArea 
                  style={{ width: '100%', minHeight: '150px' }}
                  placeholder="Enter your detailed interview feedback, observations, and justifications..."
                  autoSize={{ minRows: 6 }}
                />
              </div>
              
              <div style={{ paddingTop: '16px', borderTop: `1px solid ${token.colorBorder}`, display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <Button>Save Draft</Button>
                <Button type="primary">Submit Feedback</Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
