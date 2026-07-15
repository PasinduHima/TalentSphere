import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, theme } from 'antd';
import { Mail, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';

const { Title, Text } = Typography;

export default function PasswordResetPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { token } = theme.useToken();

  const handleSubmit = (values) => {
    setEmail(values.email);
    setIsSubmitted(true);
  };

  return (
    <Card bordered={false} style={{ width: '100%', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderRadius: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#eef2ff', color: token.colorPrimary, borderRadius: '50%', padding: '12px', display: 'flex' }}>
          <KeyRound size={24} />
        </div>
      </div>

      {!isSubmitted ? (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Title level={4} style={{ margin: 0, fontWeight: 600 }}>Reset password</Title>
            <Text type="secondary" style={{ display: 'block', marginTop: '4px' }}>
              Enter your email address and we'll send you a link to reset your password.
            </Text>
          </div>

          <Form layout="vertical" onFinish={handleSubmit} size="large" requiredMark={false}>
            <Form.Item 
              label={<Text strong>Email address</Text>}
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input prefix={<Mail size={16} color={token.colorTextSecondary} />} placeholder="Enter your email" type="email" />
            </Form.Item>
            
            <Form.Item style={{ marginBottom: 0, marginTop: '16px' }}>
              <Button type="primary" htmlType="submit" block>
                Send reset link
              </Button>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ margin: '0 auto 16px', width: '48px', height: '48px', backgroundColor: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} color="#10b981" />
          </div>
          <Title level={4} style={{ margin: 0, marginBottom: '8px' }}>Check your email</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
            We sent a password reset link to <br/>
            <Text strong>{email || 'your email'}</Text>
          </Text>
          <Button block onClick={() => setIsSubmitted(false)} size="large">
            Didn't receive the email? Click to resend
          </Button>
        </div>
      )}

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <button 
          type="button"
          onClick={() => navigate('/login')}
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            fontSize: '14px', 
            fontWeight: 600, 
            color: token.colorPrimary,
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} style={{ marginRight: '6px' }} />
          Back to login
        </button>
      </div>
    </Card>
  );
}
