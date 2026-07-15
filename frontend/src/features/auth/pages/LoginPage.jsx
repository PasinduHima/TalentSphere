import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { Form, Input, Button, Checkbox, Divider, Typography, Card, theme } from 'antd';
import { Mail, Lock, Building2 } from 'lucide-react';

const { Title, Text, Link } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [form] = Form.useForm();
  const { token } = theme.useToken();

  const onFinish = async (values) => {
    await login(values.email || 'candidate@example.com', values.password || 'password123');
    const { user } = useAuthStore.getState();
    if (user) {
      const rolePath = user.role === 'hiring_manager' ? 'hiring-manager' : user.role;
      navigate(`/${rolePath}/dashboard`);
    }
  };

  const setDevEmail = (email) => {
    form.setFieldsValue({ email, password: 'password123' });
  };

  return (
    <Card bordered={false} style={{ width: '100%', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)', borderRadius: '16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Log In</Title>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} size="large" requiredMark={false}>
        <Form.Item 
          label={<Text strong>Email Address</Text>}
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input 
            prefix={<Mail size={16} color={token.colorTextSecondary} />} 
            placeholder="name@company.com" 
          />
        </Form.Item>
        
        <Form.Item 
          label={<Text strong>Password</Text>}
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
          style={{ marginBottom: '16px' }}
        >
          <Input.Password 
            prefix={<Lock size={16} color={token.colorTextSecondary} />} 
            placeholder="••••••••" 
          />
        </Form.Item>
          
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox><Text type="secondary">Remember me</Text></Checkbox>
          </Form.Item>
          <a href="/reset-password" style={{ color: token.colorPrimary, fontWeight: 500, fontSize: '14px' }}>
            Forgot password?
          </a>
        </div>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" block loading={isLoading}>
            Log In
          </Button>
        </Form.Item>
      </Form>

      <Divider style={{ margin: '24px 0', fontSize: '14px', color: token.colorTextSecondary }} plain>or continue with</Divider>

      <div style={{ display: 'flex', gap: '16px' }}>
        <Button block icon={<Building2 size={16} />} style={{ flex: 1 }}>
          SSO
        </Button>
        <Button block style={{ flex: 1 }} icon={
          <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
        }>
          Google
        </Button>
      </div>

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <Text type="secondary">Don't have an account? </Text>
        <a href="/register" style={{ fontWeight: 500, color: token.colorPrimary, fontSize: '14px' }}>Create one</a>
      </div>

      {/* Dev helper to switch roles */}
      <div style={{ marginTop: '40px', paddingTop: '16px', borderTop: `1px solid ${token.colorBorder}` }}>
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', fontSize: '12px', marginBottom: '8px' }}>Development Helper: Switch Roles</Text>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          <Button size="small" onClick={() => setDevEmail('candidate@example.com')}>Candidate</Button>
          <Button size="small" onClick={() => setDevEmail('recruiter@example.com')}>Recruiter</Button>
          <Button size="small" onClick={() => setDevEmail('manager@example.com')}>Manager</Button>
          <Button size="small" onClick={() => setDevEmail('admin@example.com')}>Admin</Button>
        </div>
      </div>
    </Card>
  );
}
