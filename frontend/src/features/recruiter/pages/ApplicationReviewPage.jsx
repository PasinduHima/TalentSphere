import React from 'react';
import { Card, Button, Tag, Typography, Row, Col, Space, theme } from 'antd';
import AIMatchScore from '../../../components/shared/AIMatchScore';
import StatusBadge from '../../../components/shared/StatusBadge';
import { APPLICATION_STATUSES } from '../../../lib/constants';
import { Check, X, MessageSquare, Calendar, Download, FileText, ChevronLeft } from 'lucide-react';

const { Title, Text } = Typography;

export default function ApplicationReviewPage() {
  const { token } = theme.useToken();
  const candidate = {
    name: 'Sarah Jenkins',
    role: 'Senior Frontend Engineer',
    appliedDate: 'Jul 8, 2026',
    status: APPLICATION_STATUSES.SCREENING,
    matchScore: 94,
    email: 'sarah.j@example.com',
    phone: '+1 (555) 123-4567',
    experience: '8 years',
    education: 'B.S. Computer Science, UC Berkeley',
  };

  return (
    <div style={{ maxWidth: '1024px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
        <Button type="text" icon={<ChevronLeft size={20} color={token.colorTextSecondary} />} />
        <Text strong style={{ color: token.colorTextSecondary }}>Back to Applications</Text>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img 
            src="https://i.pravatar.cc/150?u=sarah" 
            alt={candidate.name} 
            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 700 }}>{candidate.name}</Title>
            <Text type="secondary" style={{ display: 'block', marginTop: '4px' }}>{candidate.role}</Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', fontSize: '12px', color: token.colorTextSecondary }}>
              <span>Applied {candidate.appliedDate}</span>
              <span style={{ width: '4px', height: '4px', backgroundColor: token.colorBorder, borderRadius: '50%' }}></span>
              <StatusBadge status={candidate.status} type="application" />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button danger icon={<X size={16} />}>Reject</Button>
          <Button type="primary" icon={<Check size={16} />}>Advance to Interview</Button>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column - AI Analysis */}
        <Col xs={24} lg={8}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card 
              title={
                <span style={{ color: '#312e81', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ backgroundColor: '#21408e', color: '#fff', padding: '4px', borderRadius: '6px', display: 'flex' }}><FileText size={16} /></span>
                  AI Screening Analysis
                </span>
              }
              bordered={false}
              style={{ backgroundColor: '#eef2ff', borderColor: '#c7d2fe', borderRadius: '12px' }}
              headStyle={{ borderBottom: '1px solid #c7d2fe' }}
              bodyStyle={{ padding: '20px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', marginTop: '8px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                    <AIMatchScore score={candidate.matchScore} size="lg" />
                  </div>
                  <Text strong style={{ color: '#312e81' }}>Excellent Match</Text>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <Text strong style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: token.colorTextSecondary, display: 'block', marginBottom: '8px' }}>Key Strengths</Text>
                  <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: token.colorText }}>
                      <Check size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                      Extensive React and state management experience.
                    </li>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: token.colorText }}>
                      <Check size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                      Strong architectural knowledge (Micro-frontends).
                    </li>
                  </ul>
                </div>
                <div>
                  <Text strong style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: token.colorTextSecondary, display: 'block', marginBottom: '8px' }}>Potential Concerns</Text>
                  <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: token.colorText }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                        <span style={{ width: '6px', height: '6px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></span>
                      </div>
                      Limited backend Node.js experience mentioned.
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card title="Contact Details" bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}` }} bodyStyle={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Email</Text>
                  <Text strong>{candidate.email}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Phone</Text>
                  <Text strong>{candidate.phone}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Location</Text>
                  <Text strong>San Francisco, CA</Text>
                </div>
                
                <div style={{ paddingTop: '16px', marginTop: '8px', borderTop: `1px solid ${token.colorBorder}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <Button icon={<MessageSquare size={16} />}>Message</Button>
                  <Button icon={<Calendar size={16} />}>Schedule</Button>
                </div>
              </div>
            </Card>
          </div>
        </Col>

        {/* Right Column - Resume PDF Viewer Placeholder */}
        <Col xs={24} lg={16}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
            <Card 
              title="Resume"
              extra={<Button type="text" size="small" icon={<Download size={16} />}>Download PDF</Button>}
              bordered={false}
              style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, minHeight: '600px', display: 'flex', flexDirection: 'column' }}
              bodyStyle={{ padding: 0, flex: 1, backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', inset: 0, padding: '32px' }}>
                <div style={{ backgroundColor: '#fff', width: '100%', height: '100%', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: '32px', border: `1px solid ${token.colorBorder}` }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', opacity: 0.5 }}>
                    <div style={{ height: '32px', backgroundColor: token.colorBorder, borderRadius: '4px', width: '33%', marginBottom: '24px' }}></div>
                    <div style={{ height: '16px', backgroundColor: token.colorBorder, borderRadius: '4px', width: '75%' }}></div>
                    <div style={{ height: '16px', backgroundColor: token.colorBorder, borderRadius: '4px', width: '83%' }}></div>
                    <div style={{ height: '16px', backgroundColor: token.colorBorder, borderRadius: '4px', width: '100%' }}></div>
                    <div style={{ height: '16px', backgroundColor: token.colorBorder, borderRadius: '4px', width: '66%' }}></div>
                    
                    <div style={{ height: '24px', backgroundColor: token.colorBorder, borderRadius: '4px', width: '25%', marginTop: '32px', marginBottom: '16px' }}></div>
                    <div style={{ height: '16px', backgroundColor: token.colorBorder, borderRadius: '4px', width: '100%' }}></div>
                    <div style={{ height: '16px', backgroundColor: token.colorBorder, borderRadius: '4px', width: '100%' }}></div>
                    <div style={{ height: '16px', backgroundColor: token.colorBorder, borderRadius: '4px', width: '83%' }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
