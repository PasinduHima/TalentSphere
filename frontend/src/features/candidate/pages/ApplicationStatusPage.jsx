import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Result, Spin, Space, Divider } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export const ApplicationStatusPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Dummy state - in reality, we'd fetch the application status using the ID from the URL
  // Here we randomly simulate an Offer or Rejection based on the ID string length or just randomly for demo
  const [status, setStatus] = useState('offer'); 

  useEffect(() => {
    // Simulate API call to fetch application decision
    const timer = setTimeout(() => {
      // For demo purposes, let's alternate based on char code of last char, or just random
      const lastChar = id ? id.charCodeAt(id.length - 1) : 0;
      setStatus(lastChar % 2 === 0 ? 'offer' : 'rejected');
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8fafc' }}>
        <Spin size="large" tip="Loading your application status..." />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
      padding: '24px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '600px',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          border: 'none',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: 0 }}
      >
        {status === 'offer' ? (
          <div>
            <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '48px 32px', textAlign: 'center', color: 'white' }}>
              <CheckCircleOutlined style={{ fontSize: '64px', marginBottom: '24px' }} />
              <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 800 }}>Congratulations!</Title>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px' }}>We are thrilled to offer you the position.</Text>
            </div>
            
            <div style={{ padding: '40px 32px' }}>
              <Paragraph style={{ fontSize: '16px', color: '#475569', lineHeight: '1.8' }}>
                Based on your outstanding interviews and qualifications, the team was incredibly impressed and unanimously agreed you would be a perfect fit for our organization.
              </Paragraph>
              
              <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', marginTop: '24px', marginBottom: '32px', border: '1px solid #e2e8f0' }}>
                <Space align="start" size={16}>
                  <FileTextOutlined style={{ fontSize: '24px', color: '#4f46e5', marginTop: '4px' }} />
                  <div>
                    <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '4px' }}>Offer Letter Attached</Text>
                    <Text type="secondary">Please review the details of your compensation package, benefits, and next steps.</Text>
                  </div>
                </Space>
              </div>

              <Space direction="vertical" style={{ width: '100%' }} size={16}>
                <Button type="primary" size="large" block style={{ height: '56px', borderRadius: '12px', fontSize: '16px', fontWeight: 600, background: '#4f46e5' }}>
                  Accept Offer
                </Button>
                <Button size="large" block style={{ height: '56px', borderRadius: '12px', fontSize: '16px', fontWeight: 600 }}>
                  View Offer Document
                </Button>
              </Space>
            </div>
          </div>
        ) : (
          <div>
             <div style={{ background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)', padding: '48px 32px', textAlign: 'center', color: 'white' }}>
              <CloseCircleOutlined style={{ fontSize: '64px', marginBottom: '24px' }} />
              <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 800 }}>Application Update</Title>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px' }}>Thank you for your interest.</Text>
            </div>
            
            <div style={{ padding: '40px 32px' }}>
              <Paragraph style={{ fontSize: '16px', color: '#475569', lineHeight: '1.8' }}>
                We appreciate the time you took to interview with us. After careful consideration, we have decided to move forward with another candidate whose qualifications more closely align with our current needs.
              </Paragraph>
              
              <Paragraph style={{ fontSize: '16px', color: '#475569', lineHeight: '1.8', marginTop: '16px' }}>
                The competition for this role was extremely high, and we were genuinely impressed with your background. We encourage you to apply for future openings that match your skills.
              </Paragraph>

              <Divider style={{ margin: '32px 0' }} />

              <Button type="primary" size="large" block onClick={() => navigate('/candidate/jobs')} style={{ height: '56px', borderRadius: '12px', fontSize: '16px', fontWeight: 600, background: '#4f46e5' }}>
                Browse Open Roles
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
