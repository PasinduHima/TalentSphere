import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, theme, Row, Col } from 'antd';
import { Mail, Lock, User, Briefcase } from 'lucide-react';
import { ROLES } from '../../../lib/constants';

const { Title, Text } = Typography;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { token } = theme.useToken();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: ROLES.CANDIDATE,
  });

  const handleNext = (values) => {
    setFormData({ ...formData, ...values });
    setStep(step + 1);
  };

  const handleSubmit = () => {
    navigate('/login');
  };

  return (
    <Card bordered={false} style={{ width: '100%', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderRadius: '16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={4} style={{ margin: 0, fontWeight: 600 }}>Create an account</Title>
        <Text type="secondary" style={{ display: 'block', marginTop: '4px' }}>Join the future of talent management.</Text>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ height: '8px', width: '32px', borderRadius: '9999px', backgroundColor: step >= 1 ? token.colorPrimary : token.colorBorder }}></div>
          <div style={{ height: '8px', width: '32px', borderRadius: '9999px', backgroundColor: step >= 2 ? token.colorPrimary : token.colorBorder }}></div>
          <div style={{ height: '8px', width: '32px', borderRadius: '9999px', backgroundColor: step >= 3 ? token.colorPrimary : token.colorBorder }}></div>
        </div>
      </div>

      {step === 1 && (
        <Form layout="vertical" onFinish={handleNext} size="large" requiredMark={false} initialValues={formData}>
          <Form.Item 
            label={<Text strong>Email address</Text>}
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input prefix={<Mail size={16} color={token.colorTextSecondary} />} placeholder="Enter your email" type="email" />
          </Form.Item>
          
          <Form.Item 
            label={<Text strong>Password</Text>}
            name="password"
            rules={[{ required: true, message: 'Please create a password!' }]}
          >
            <Input.Password prefix={<Lock size={16} color={token.colorTextSecondary} />} placeholder="Create a password" />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
            <Button type="primary" htmlType="submit" block>Continue</Button>
          </Form.Item>
        </Form>
      )}

      {step === 2 && (
        <Form layout="vertical" onFinish={handleNext} size="large" requiredMark={false} initialValues={formData}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                label={<Text strong>First name</Text>}
                name="firstName"
                rules={[{ required: true, message: 'Required!' }]}
              >
                <Input prefix={<User size={16} color={token.colorTextSecondary} />} placeholder="First name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label={<Text strong>Last name</Text>}
                name="lastName"
                rules={[{ required: true, message: 'Required!' }]}
              >
                <Input placeholder="Last name" />
              </Form.Item>
            </Col>
          </Row>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <Button size="large" onClick={() => setStep(1)} style={{ flex: 1 }}>Back</Button>
            <Button type="primary" htmlType="submit" size="large" style={{ flex: 1 }}>Continue</Button>
          </div>
        </Form>
      )}

      {step === 3 && (
        <div>
          <Text strong style={{ display: 'block', marginBottom: '12px' }}>Select your role</Text>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { id: ROLES.CANDIDATE, title: 'Candidate', desc: 'I am looking for a job' },
              { id: ROLES.RECRUITER, title: 'Recruiter', desc: 'I am hiring talent' },
              { id: ROLES.HIRING_MANAGER, title: 'Hiring Manager', desc: 'I review candidates' },
            ].map((roleOption) => {
              const isSelected = formData.role === roleOption.id;
              return (
                <div 
                  key={roleOption.id}
                  onClick={() => setFormData({ ...formData, role: roleOption.id })}
                  style={{
                    padding: '16px',
                    border: `1px solid ${isSelected ? token.colorPrimary : token.colorBorder}`,
                    backgroundColor: isSelected ? '#eef2ff' : '#fff',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ 
                    padding: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: isSelected ? token.colorPrimary : '#f1f5f9',
                    display: 'flex'
                  }}>
                    <Briefcase size={20} color={isSelected ? '#fff' : token.colorTextSecondary} />
                  </div>
                  <div>
                    <Text strong style={{ display: 'block', fontSize: '16px' }}>{roleOption.title}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{roleOption.desc}</Text>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <Button size="large" onClick={() => setStep(2)} style={{ flex: 1 }}>Back</Button>
            <Button type="primary" size="large" onClick={handleSubmit} style={{ flex: 1 }}>Complete Sign Up</Button>
          </div>
        </div>
      )}

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <Text type="secondary">Already have an account? </Text>
        <a href="/login" style={{ fontWeight: 600, color: token.colorPrimary, fontSize: '14px' }}>Sign in</a>
      </div>
    </Card>
  );
}
