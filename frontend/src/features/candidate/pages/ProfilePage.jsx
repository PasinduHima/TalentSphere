import React from 'react';
import { Card, Button, Input, Tag, Typography, Row, Col, Space, theme } from 'antd';
import { useAuthStore } from '../../../store/authStore';
import { Camera, FileText, X } from 'lucide-react';

const { TextArea } = Input;
const { Title, Text } = Typography;

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [skills, setSkills] = React.useState(['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'System Architecture']);
  const [newSkill, setNewSkill] = React.useState('');
  const { token } = theme.useToken();

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Profile & CV</Title>
          <Text type="secondary">Manage your personal information and skills.</Text>
        </div>
        <Button type="primary">Save Changes</Button>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column - Avatar & CV */}
        <Col xs={24} md={8}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card bordered={false} style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', borderRadius: '12px', border: `1px solid ${token.colorBorder}` }} bodyStyle={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ position: 'relative', marginBottom: '16px', cursor: 'pointer', width: '128px', height: '128px' }}>
                <img 
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}`} 
                  alt={user?.name} 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid #fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '50%', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                  <Camera size={32} color="#fff" />
                </div>
              </div>
              <Title level={4} style={{ margin: 0, fontWeight: 700 }}>{user?.name}</Title>
              <Text type="secondary" style={{ display: 'block', marginTop: '4px' }}>Senior Frontend Engineer</Text>
              <Tag color="success" style={{ marginTop: '12px', padding: '4px 12px', borderRadius: '9999px' }}>Open to work</Tag>
            </Card>

            <Card title="Resume / CV" bordered={false} style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', borderRadius: '12px', border: `1px solid ${token.colorBorder}` }} headStyle={{ borderBottom: `1px solid ${token.colorBorder}` }}>
              <div style={{ border: `2px dashed ${token.colorBorder}`, borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', marginBottom: '16px', backgroundColor: '#f8fafc', transition: 'background-color 0.2s' }}>
                <div style={{ backgroundColor: '#eef2ff', color: token.colorPrimary, padding: '12px', borderRadius: '50%', marginBottom: '12px' }}>
                  <FileText size={24} />
                </div>
                <Text strong style={{ fontSize: '14px' }}>Upload new resume</Text>
                <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px' }}>PDF or DOCX up to 5MB</Text>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: `1px solid ${token.colorBorder}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileText size={20} color={token.colorPrimary} />
                    <div>
                      <Text strong style={{ fontSize: '14px', display: 'block' }}>Sarah_Jenkins_CV_2026.pdf</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Updated 2 days ago</Text>
                    </div>
                  </div>
                  <Button type="text" size="small" danger icon={<X size={16} />} />
                </div>
              </div>
            </Card>
          </div>
        </Col>

        {/* Right Column - Form */}
        <Col xs={24} md={16}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card title="Personal Information" bordered={false} style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', borderRadius: '12px', border: `1px solid ${token.colorBorder}` }} headStyle={{ borderBottom: `1px solid ${token.colorBorder}` }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <Text strong>First Name</Text>
                      <Input size="large" defaultValue="Sarah" />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <Text strong>Last Name</Text>
                      <Input size="large" defaultValue="Jenkins" />
                    </div>
                  </Col>
                </Row>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Text strong>Email Address</Text>
                  <Input size="large" type="email" defaultValue={user?.email} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Text strong>Phone Number</Text>
                  <Input size="large" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Text strong>Location</Text>
                  <Input size="large" defaultValue="San Francisco, CA" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Text strong>Bio</Text>
                  <TextArea 
                    defaultValue="Passionate frontend engineer with 8+ years of experience building scalable web applications. Strong focus on UX, accessibility, and performance."
                    autoSize={{ minRows: 4 }}
                  />
                </div>
              </div>
            </Card>

            <Card title="Skills & Expertise" bordered={false} style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', borderRadius: '12px', border: `1px solid ${token.colorBorder}` }} headStyle={{ borderBottom: `1px solid ${token.colorBorder}` }}>
              <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <Input 
                    size="large"
                    placeholder="Add a skill (e.g. React, Python)" 
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                  />
                </div>
                <Button type="primary" size="large" htmlType="submit" disabled={!newSkill.trim()}>Add</Button>
              </form>

              <Space wrap>
                {skills.map(skill => (
                  <Tag 
                    key={skill} 
                    closable 
                    onClose={(e) => {
                      e.preventDefault();
                      handleRemoveSkill(skill);
                    }}
                    color="blue"
                    style={{ padding: '4px 10px', fontSize: '14px', borderRadius: '4px' }}
                  >
                    {skill}
                  </Tag>
                ))}
              </Space>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
