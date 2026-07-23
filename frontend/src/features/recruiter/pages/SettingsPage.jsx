import React, { useState } from 'react';
import { Card, Typography, Row, Col, Input, Button, Switch, Select, Divider, Form, theme, message, Avatar, Tabs } from 'antd';
import { User, Bell, Shield, Palette, Save } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

const { Title, Text } = Typography;

export default function RecruiterSettingsPage() {
  const { token } = theme.useToken();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  const handleSave = () => {
    message.success('Settings saved successfully!');
  };

  const tabItems = [
    {
      key: 'profile',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={16} /> Profile
        </span>
      ),
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Avatar
              size={72}
              src={user?.avatar}
              style={{ backgroundColor: '#eef2ff', color: token.colorPrimary, fontWeight: 700, fontSize: '24px' }}
            >
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Avatar>
            <div>
              <Text strong style={{ display: 'block', fontSize: '16px' }}>{user?.firstName} {user?.lastName}</Text>
              <Text type="secondary" style={{ display: 'block' }}>{user?.email}</Text>
              <Button size="small" style={{ marginTop: '8px' }}>Change Avatar</Button>
            </div>
          </div>

          <Divider style={{ margin: 0 }} />

          <Form layout="vertical" initialValues={{ firstName: user?.firstName || 'Alex', lastName: user?.lastName || 'Johnson', email: user?.email || 'alex.johnson@talentsphere.com', phone: '+1 (555) 234-5678', title: 'Senior Technical Recruiter', department: 'Engineering Recruitment' }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="First Name" name="firstName">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Last Name" name="lastName">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Email" name="email">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
              <Input />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Job Title" name="title">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Department" name="department">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" icon={<Save size={16} />} onClick={handleSave}>Save Changes</Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: 'notifications',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={16} /> Notifications
        </span>
      ),
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', maxWidth: '640px' }}>
          {[
            { title: 'New Applications', description: 'Get notified when a candidate applies to your job postings.', defaultChecked: true },
            { title: 'Interview Reminders', description: 'Receive reminders 30 minutes before scheduled interviews.', defaultChecked: true },
            { title: 'Candidate Messages', description: 'Notifications for new messages from candidates.', defaultChecked: true },
            { title: 'AI Match Alerts', description: 'Get alerted when a high-scoring candidate (90%+) applies.', defaultChecked: true },
            { title: 'Weekly Summary', description: 'Receive a weekly digest of your recruitment pipeline.', defaultChecked: false },
            { title: 'Application Status Updates', description: 'Notifications when application statuses change.', defaultChecked: false },
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: `1px solid ${token.colorBorder}` }}>
              <div>
                <Text strong style={{ display: 'block', fontSize: '14px' }}>{item.title}</Text>
                <Text type="secondary" style={{ fontSize: '13px' }}>{item.description}</Text>
              </div>
              <Switch defaultChecked={item.defaultChecked} />
            </div>
          ))}
          <div style={{ marginTop: '24px' }}>
            <Button type="primary" icon={<Save size={16} />} onClick={handleSave}>Save Preferences</Button>
          </div>
        </div>
      ),
    },
    {
      key: 'security',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={16} /> Security
        </span>
      ),
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '640px' }}>
          <Card bordered={false} style={{ border: `1px solid ${token.colorBorder}`, borderRadius: '12px' }}>
            <Title level={5} style={{ margin: 0, marginBottom: '16px' }}>Change Password</Title>
            <Form layout="vertical">
              <Form.Item label="Current Password">
                <Input.Password />
              </Form.Item>
              <Form.Item label="New Password">
                <Input.Password />
              </Form.Item>
              <Form.Item label="Confirm New Password">
                <Input.Password />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button type="primary" onClick={() => message.success('Password updated successfully!')}>Update Password</Button>
              </Form.Item>
            </Form>
          </Card>

          <Card bordered={false} style={{ border: `1px solid ${token.colorBorder}`, borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Title level={5} style={{ margin: 0 }}>Two-Factor Authentication</Title>
                <Text type="secondary" style={{ display: 'block', marginTop: '4px' }}>Add an extra layer of security to your account.</Text>
              </div>
              <Switch defaultChecked={false} />
            </div>
          </Card>

          <Card bordered={false} style={{ border: `1px solid ${token.colorBorder}`, borderRadius: '12px' }}>
            <Title level={5} style={{ margin: 0, marginBottom: '8px' }}>Active Sessions</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>You are currently logged in on these devices.</Text>
            {[
              { device: 'Chrome on Windows', location: 'Colombo, LK', time: 'Current session', isCurrent: true },
              { device: 'Safari on iPhone', location: 'Colombo, LK', time: '2 hours ago', isCurrent: false },
            ].map((session, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: idx === 0 ? `1px solid ${token.colorBorder}` : 'none' }}>
                <div>
                  <Text strong style={{ display: 'block', fontSize: '14px' }}>{session.device}</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>{session.location} · {session.time}</Text>
                </div>
                {session.isCurrent ? (
                  <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, color: '#16a34a' }}>Active</Text>
                ) : (
                  <Button size="small" danger>Revoke</Button>
                )}
              </div>
            ))}
          </Card>
        </div>
      ),
    },
    {
      key: 'preferences',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Palette size={16} /> Preferences
        </span>
      ),
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', maxWidth: '640px' }}>
          {[
            { title: 'Language', description: 'Choose your preferred language for the interface.', control: <Select defaultValue="en" style={{ width: '200px' }} options={[{ value: 'en', label: 'English' }, { value: 'es', label: 'Spanish' }, { value: 'fr', label: 'French' }]} /> },
            { title: 'Time Zone', description: 'Set your local time zone for scheduling.', control: <Select defaultValue="asia-colombo" style={{ width: '200px' }} options={[{ value: 'asia-colombo', label: 'Asia/Colombo (GMT+5:30)' }, { value: 'us-pacific', label: 'US/Pacific (GMT-7)' }, { value: 'us-eastern', label: 'US/Eastern (GMT-4)' }]} /> },
            { title: 'Default Dashboard View', description: 'Choose what you see first when logging in.', control: <Select defaultValue="overview" style={{ width: '200px' }} options={[{ value: 'overview', label: 'Overview' }, { value: 'jobs', label: 'Job Postings' }, { value: 'candidates', label: 'Candidates' }]} /> },
            { title: 'Compact Mode', description: 'Use a denser layout to show more information.', control: <Switch defaultChecked={false} /> },
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: `1px solid ${token.colorBorder}` }}>
              <div>
                <Text strong style={{ display: 'block', fontSize: '14px' }}>{item.title}</Text>
                <Text type="secondary" style={{ fontSize: '13px' }}>{item.description}</Text>
              </div>
              {item.control}
            </div>
          ))}
          <div style={{ marginTop: '24px' }}>
            <Button type="primary" icon={<Save size={16} />} onClick={handleSave}>Save Preferences</Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Settings</Title>
        <Text type="secondary" style={{ marginTop: '4px', display: 'block' }}>Manage your account settings and preferences.</Text>
      </div>

      <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          tabBarStyle={{ marginBottom: '24px' }}
        />
      </Card>
    </div>
  );
}
