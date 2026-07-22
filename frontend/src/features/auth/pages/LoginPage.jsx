import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { Form, Input, Button, Checkbox, Divider, Typography, Card, Alert, theme } from 'antd';
import { Mail, Lock, Building2 } from 'lucide-react';
import { getApiErrorMessage } from '../../../lib/apiClient';
import { getDefaultRouteForRole } from '../../../lib/roleMap';

const { Title, Text } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [form] = Form.useForm();
  const { token } = theme.useToken();
  const [errorMessage, setErrorMessage] = useState(null);

  const onFinish = async (values) => {
    setErrorMessage(null);
    try {
      const user = await login(values.email, values.password);
      navigate(getDefaultRouteForRole(user.role));
    } catch (err) {
      setErrorMessage(getApiErrorMessage(err, 'Invalid email or password.'));
    }
  };

  // Seeded demo accounts follow the pattern <Role>@12345 (see backend DbSeeder).
  const setDevEmail = (email) => {
    const localPart = email.split('@')[0];
    const password = `${localPart[0].toUpperCase()}${localPart.slice(1)}@12345`;
    form.setFieldsValue({ email, password });
  };

  return (
    <Card 
      bordered={false} 
      style={{ 
        width: '100%', 
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.5) inset', 
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
      bodyStyle={{ padding: '40px 32px' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
          <img src="/Logo.svg" alt="TalentSphere AI" style={{ width: '180px', height: 'auto', objectFit: 'contain' }} />
        </div>
        <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' }}>Welcome back</Title>
        <Text type="secondary" style={{ fontSize: '15px', marginTop: '8px', display: 'block' }}>Please enter your details to sign in.</Text>
      </div>

      {errorMessage && (
        <Alert type="error" message={errorMessage} showIcon closable style={{ marginBottom: '24px', borderRadius: '12px' }} onClose={() => setErrorMessage(null)} />
      )}

      <Form form={form} layout="vertical" onFinish={onFinish} size="large" requiredMark={false}>
        <Form.Item
          label={<Text strong style={{ color: '#334155' }}>Email Address</Text>}
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input 
            prefix={<Mail size={18} color={token.colorPrimary} style={{ opacity: 0.8, marginRight: '8px' }} />} 
            placeholder="name@company.com" 
            style={{ backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid rgba(226, 232, 240, 0.8)', boxShadow: '0 2px 4px rgba(0,0,0,0.02) inset' }}
          />
        </Form.Item>
        
        <Form.Item 
          label={<Text strong style={{ color: '#334155' }}>Password</Text>}
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
          style={{ marginBottom: '16px' }}
        >
          <Input.Password 
            prefix={<Lock size={18} color={token.colorPrimary} style={{ opacity: 0.8, marginRight: '8px' }} />} 
            placeholder="••••••••" 
            style={{ backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid rgba(226, 232, 240, 0.8)', boxShadow: '0 2px 4px rgba(0,0,0,0.02) inset' }}
          />
        </Form.Item>
          
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox><Text style={{ color: '#475569' }}>Remember me</Text></Checkbox>
          </Form.Item>
          <a href="/reset-password" style={{ color: token.colorPrimary, fontWeight: 600, fontSize: '14px' }}>
            Forgot password?
          </a>
        </div>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" block loading={isLoading} style={{ height: '48px', fontSize: '16px', fontWeight: 600, borderRadius: '12px' }}>
            Sign In
          </Button>
        </Form.Item>
      </Form>

      <Divider style={{ margin: '32px 0', fontSize: '13px', color: '#94a3b8' }} plain>OR CONTINUE WITH</Divider>

      <div style={{ display: 'flex', gap: '16px' }}>
        <Button block icon={<Building2 size={18} color="#475569" />} style={{ flex: 1, height: '44px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid #e2e8f0', color: '#334155', fontWeight: 500 }}>
          SSO
        </Button>
        <Button block style={{ flex: 1, height: '44px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid #e2e8f0', color: '#334155', fontWeight: 500 }} icon={
          <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24">
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
        <Text style={{ color: '#64748b' }}>Don't have an account? </Text>
        <a href="/register" style={{ fontWeight: 600, color: token.colorPrimary, fontSize: '15px' }}>Create one</a>
      </div>

      {/* Fills in the seeded demo accounts created by the backend's DbSeeder */}
      <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: `1px solid rgba(226, 232, 240, 0.6)` }}>
        <Text style={{ display: 'block', textAlign: 'center', fontSize: '12px', marginBottom: '12px', color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Demo accounts</Text>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          <Button type="dashed" size="small" onClick={() => setDevEmail('candidate@talentsphere.local')} style={{ borderRadius: '6px' }}>Candidate</Button>
          <Button type="dashed" size="small" onClick={() => setDevEmail('recruiter@talentsphere.local')} style={{ borderRadius: '6px' }}>Recruiter</Button>
          <Button type="dashed" size="small" onClick={() => setDevEmail('manager@talentsphere.local')} style={{ borderRadius: '6px' }}>Manager</Button>
          <Button type="dashed" size="small" onClick={() => setDevEmail('admin@talentsphere.local')} style={{ borderRadius: '6px' }}>Admin</Button>
        </div>
      </div>
    </Card>
  );
}
