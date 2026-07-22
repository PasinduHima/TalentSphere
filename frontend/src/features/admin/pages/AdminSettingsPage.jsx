import React, { useState } from 'react';
import { Card, Typography, Row, Col, Input, Button, Switch, Select, Divider, Form, theme, message, Tabs, Slider, InputNumber } from 'antd';
import { Settings, Globe, Database, Mail, Shield, Bell, Save, Server } from 'lucide-react';

const { Title, Text } = Typography;

export default function AdminSettingsPage() {
  const { token } = theme.useToken();
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = () => {
    message.success('Settings saved successfully!');
  };

  const tabItems = [
    {
      key: 'general',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={16} /> General
        </span>
      ),
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', maxWidth: '640px' }}>
          <Form layout="vertical" initialValues={{ siteName: 'TalentSphere AI', tagline: 'Enterprise Recruitment Platform', timezone: 'asia-colombo', dateFormat: 'mdy', language: 'en' }}>
            <Form.Item label="Platform Name" name="siteName">
              <Input />
            </Form.Item>
            <Form.Item label="Tagline" name="tagline">
              <Input />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Default Language" name="language">
                  <Select options={[{ value: 'en', label: 'English' }, { value: 'es', label: 'Spanish' }, { value: 'fr', label: 'French' }, { value: 'de', label: 'German' }]} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Default Time Zone" name="timezone">
                  <Select options={[{ value: 'asia-colombo', label: 'Asia/Colombo (GMT+5:30)' }, { value: 'utc', label: 'UTC (GMT+0)' }, { value: 'us-pacific', label: 'US/Pacific (GMT-7)' }, { value: 'us-eastern', label: 'US/Eastern (GMT-4)' }, { value: 'europe-london', label: 'Europe/London (GMT+1)' }]} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Date Format" name="dateFormat">
              <Select options={[{ value: 'mdy', label: 'MM/DD/YYYY' }, { value: 'dmy', label: 'DD/MM/YYYY' }, { value: 'ymd', label: 'YYYY-MM-DD' }]} />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" icon={<Save size={16} />} onClick={handleSave}>Save Settings</Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: 'email',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Mail size={16} /> Email
        </span>
      ),
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '640px' }}>
          <Card bordered={false} style={{ border: `1px solid ${token.colorBorder}`, borderRadius: '12px' }}>
            <Title level={5} style={{ margin: 0, marginBottom: '16px' }}>SMTP Configuration</Title>
            <Form layout="vertical" initialValues={{ smtpHost: 'smtp.talentsphere.com', smtpPort: 587, smtpUser: 'noreply@talentsphere.com', encryption: 'tls' }}>
              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item label="SMTP Host" name="smtpHost">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Port" name="smtpPort">
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Username" name="smtpUser">
                <Input />
              </Form.Item>
              <Form.Item label="Password">
                <Input.Password defaultValue="••••••••••" />
              </Form.Item>
              <Form.Item label="Encryption" name="encryption">
                <Select options={[{ value: 'tls', label: 'TLS' }, { value: 'ssl', label: 'SSL' }, { value: 'none', label: 'None' }]} />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button style={{ marginRight: '8px' }}>Send Test Email</Button>
                <Button type="primary" icon={<Save size={16} />} onClick={handleSave}>Save SMTP</Button>
              </Form.Item>
            </Form>
          </Card>

          <Card bordered={false} style={{ border: `1px solid ${token.colorBorder}`, borderRadius: '12px' }}>
            <Title level={5} style={{ margin: 0, marginBottom: '16px' }}>Email Templates</Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { name: 'Welcome Email', description: 'Sent to new users upon registration.', enabled: true },
                { name: 'Application Confirmation', description: 'Sent to candidates after applying.', enabled: true },
                { name: 'Interview Invitation', description: 'Sent when an interview is scheduled.', enabled: true },
                { name: 'Password Reset', description: 'Sent when a user requests a password reset.', enabled: true },
                { name: 'Weekly Digest', description: 'Weekly summary for recruiters and managers.', enabled: false },
              ].map((tmpl, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${token.colorBorder}` }}>
                  <div>
                    <Text strong style={{ display: 'block', fontSize: '14px' }}>{tmpl.name}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{tmpl.description}</Text>
                  </div>
                  <Switch defaultChecked={tmpl.enabled} size="small" />
                </div>
              ))}
            </div>
          </Card>
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
            <Title level={5} style={{ margin: 0, marginBottom: '16px' }}>Password Policy</Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { title: 'Minimum Length', description: 'Minimum password length for all users.', control: <InputNumber defaultValue={8} min={6} max={32} style={{ width: '80px' }} /> },
                { title: 'Require Uppercase', description: 'Passwords must contain at least one uppercase letter.', control: <Switch defaultChecked /> },
                { title: 'Require Number', description: 'Passwords must contain at least one number.', control: <Switch defaultChecked /> },
                { title: 'Require Special Character', description: 'Passwords must contain at least one special character.', control: <Switch defaultChecked={false} /> },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${token.colorBorder}` }}>
                  <div>
                    <Text strong style={{ display: 'block', fontSize: '14px' }}>{item.title}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{item.description}</Text>
                  </div>
                  {item.control}
                </div>
              ))}
            </div>
          </Card>

          <Card bordered={false} style={{ border: `1px solid ${token.colorBorder}`, borderRadius: '12px' }}>
            <Title level={5} style={{ margin: 0, marginBottom: '16px' }}>Session Settings</Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { title: 'Session Timeout (minutes)', description: 'Automatically log users out after inactivity.', control: <InputNumber defaultValue={60} min={5} max={1440} style={{ width: '100px' }} /> },
                { title: 'Max Concurrent Sessions', description: 'Limit active sessions per user.', control: <InputNumber defaultValue={3} min={1} max={10} style={{ width: '80px' }} /> },
                { title: 'Enforce 2FA for Admins', description: 'Require two-factor authentication for admin accounts.', control: <Switch defaultChecked /> },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${token.colorBorder}` }}>
                  <div>
                    <Text strong style={{ display: 'block', fontSize: '14px' }}>{item.title}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{item.description}</Text>
                  </div>
                  {item.control}
                </div>
              ))}
            </div>
          </Card>

          <Button type="primary" icon={<Save size={16} />} onClick={handleSave} style={{ alignSelf: 'flex-start' }}>Save Security Settings</Button>
        </div>
      ),
    },
    {
      key: 'integrations',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={16} /> Integrations
        </span>
      ),
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '640px' }}>
          {[
            { name: 'Google Workspace', description: 'Enable Google Calendar and Gmail integration for interview scheduling.', connected: true, icon: '🟢' },
            { name: 'Microsoft 365', description: 'Sync with Outlook calendars and Teams meetings.', connected: false, icon: '🔵' },
            { name: 'Slack', description: 'Send notifications and updates to Slack channels.', connected: true, icon: '💬' },
            { name: 'LinkedIn', description: 'Import candidate profiles and post job listings.', connected: false, icon: '🔗' },
            { name: 'Zapier', description: 'Connect to 5000+ apps via Zapier workflows.', connected: false, icon: '⚡' },
          ].map((integration, idx) => (
            <Card key={idx} bordered={false} style={{ border: `1px solid ${token.colorBorder}`, borderRadius: '12px' }} bodyStyle={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#f8fafc', border: `1px solid ${token.colorBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                    {integration.icon}
                  </div>
                  <div>
                    <Text strong style={{ display: 'block', fontSize: '14px' }}>{integration.name}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{integration.description}</Text>
                  </div>
                </div>
                <Button type={integration.connected ? 'default' : 'primary'} size="small">
                  {integration.connected ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ),
    },
    {
      key: 'data',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={16} /> Data & Storage
        </span>
      ),
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '640px' }}>
          <Card bordered={false} style={{ border: `1px solid ${token.colorBorder}`, borderRadius: '12px' }}>
            <Title level={5} style={{ margin: 0, marginBottom: '16px' }}>Storage Usage</Title>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text type="secondary">Used: 12.4 GB</Text>
                <Text type="secondary">Total: 50 GB</Text>
              </div>
              <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '24.8%', backgroundColor: token.colorPrimary, borderRadius: '4px' }}></div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {[
                { label: 'Resumes', size: '6.2 GB', color: token.colorPrimary },
                { label: 'Profile Photos', size: '2.1 GB', color: '#6366f1' },
                { label: 'System Data', size: '4.1 GB', color: '#16a34a' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }}></div>
                  <Text type="secondary" style={{ fontSize: '13px' }}>{item.label}: <Text strong>{item.size}</Text></Text>
                </div>
              ))}
            </div>
          </Card>

          <Card bordered={false} style={{ border: `1px solid ${token.colorBorder}`, borderRadius: '12px' }}>
            <Title level={5} style={{ margin: 0, marginBottom: '16px' }}>Data Retention</Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { title: 'Closed Job Postings', description: 'Automatically archive closed job postings after.', control: <Select defaultValue="90" style={{ width: '160px' }} options={[{ value: '30', label: '30 days' }, { value: '60', label: '60 days' }, { value: '90', label: '90 days' }, { value: '180', label: '180 days' }, { value: 'never', label: 'Never' }]} /> },
                { title: 'Rejected Applications', description: 'Remove rejected application data after.', control: <Select defaultValue="180" style={{ width: '160px' }} options={[{ value: '30', label: '30 days' }, { value: '90', label: '90 days' }, { value: '180', label: '180 days' }, { value: '365', label: '1 year' }, { value: 'never', label: 'Never' }]} /> },
                { title: 'Audit Logs', description: 'Retain system audit logs for.', control: <Select defaultValue="365" style={{ width: '160px' }} options={[{ value: '90', label: '90 days' }, { value: '180', label: '180 days' }, { value: '365', label: '1 year' }, { value: '730', label: '2 years' }]} /> },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${token.colorBorder}` }}>
                  <div>
                    <Text strong style={{ display: 'block', fontSize: '14px' }}>{item.title}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{item.description}</Text>
                  </div>
                  {item.control}
                </div>
              ))}
            </div>
          </Card>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Button type="primary" icon={<Save size={16} />} onClick={handleSave}>Save Settings</Button>
            <Button danger onClick={() => message.info('Export feature coming soon.')}>Export All Data</Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>System Settings</Title>
        <Text type="secondary" style={{ marginTop: '4px', display: 'block' }}>Configure platform-wide settings, integrations, and security policies.</Text>
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
