import React, { useState } from 'react';
import { Card, Button, Input, Tag, Select, Slider, Layout, Typography, theme, Row, Col, Space } from 'antd';
import AIMatchScore from '../../../components/shared/AIMatchScore';
import { Search, Mail, Calendar, FileText, ChevronDown } from 'lucide-react';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function CandidateSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = theme.useToken();

  const candidates = [
    { id: 1, name: 'Sarah Jenkins', role: 'Senior Frontend Engineer', location: 'San Francisco, CA', matchScore: 94, skills: ['React', 'TypeScript', 'Node.js', 'System Architecture'], status: 'Available', experience: '8 yrs', currentCompany: 'Tech Innovators' },
    { id: 2, name: 'Michael Chang', role: 'Frontend Developer', location: 'Remote', matchScore: 88, skills: ['Vue.js', 'JavaScript', 'CSS', 'Tailwind'], status: 'Interviewing', experience: '5 yrs', currentCompany: 'Digital Solutions' },
    { id: 3, name: 'Priya Patel', role: 'UI/UX Designer', location: 'New York, NY', matchScore: 82, skills: ['Figma', 'Prototyping', 'User Research'], status: 'Available', experience: '6 yrs', currentCompany: 'Creative Agency' },
  ];

  return (
    <Layout style={{ background: 'transparent', minHeight: 'calc(100vh - 150px)', gap: '24px' }}>
      {/* Filters Sidebar */}
      <Sider width={260} style={{ background: 'transparent' }} breakpoint="lg" collapsedWidth="0" trigger={null}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Filters</Title>
            <Button type="text" size="small" style={{ color: token.colorTextSecondary }}>Clear All</Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text strong>AI Match Score</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>Min 80%</Text>
                <Text strong style={{ color: token.colorPrimary, fontSize: '14px' }}>80%</Text>
              </div>
              <Slider defaultValue={80} tooltip={{ formatter: null }} />
            </div>

            <div>
              <Text strong style={{ display: 'block', marginBottom: '8px' }}>Skills</Text>
              <Input placeholder="Add a skill..." />
              <Space wrap style={{ marginTop: '12px' }}>
                <Tag closable color="blue" style={{ margin: 0 }}>React</Tag>
                <Tag closable color="blue" style={{ margin: 0 }}>TypeScript</Tag>
              </Space>
            </div>

            <div>
              <Text strong style={{ display: 'block', marginBottom: '8px' }}>Experience</Text>
              <Select 
                defaultValue="5+ years"
                style={{ width: '100%' }}
                options={[
                  { value: 'any', label: 'Any Experience' },
                  { value: '1-3', label: '1-3 years' },
                  { value: '3-5', label: '3-5 years' },
                  { value: '5+', label: '5+ years' }
                ]}
              />
            </div>
          </div>
        </div>
      </Sider>

      {/* Main Content */}
      <Content style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <Input 
            size="large"
            prefix={<Search size={16} color={token.colorTextSecondary} />} 
            placeholder="Search by name, role, or keywords" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button type="primary" size="large" style={{ padding: '0 24px' }}>Search</Button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <Title level={5} style={{ margin: 0, fontWeight: 600 }}>AI Recommended Candidates</Title>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Text type="secondary">Sort by: </Text>
            <Text strong>Highest Match</Text>
            <ChevronDown size={16} color={token.colorTextSecondary} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          {candidates.map(candidate => (
            <Card key={candidate.id} hoverable bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}` }} bodyStyle={{ padding: '24px' }}>
              <Row gutter={[24, 24]}>
                {/* Avatar & Score */}
                <Col xs={24} lg={4} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <img 
                    src={`https://i.pravatar.cc/150?u=${candidate.id}`} 
                    alt={candidate.name} 
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: `1px solid ${token.colorBorder}` }}
                  />
                  <AIMatchScore score={candidate.matchScore} size="sm" />
                </Col>

                {/* Info */}
                <Col xs={24} lg={20} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <Title level={4} style={{ margin: 0 }}>{candidate.name}</Title>
                      <Text strong style={{ color: token.colorTextSecondary }}>{candidate.role}</Text>
                    </div>
                    <Tag color={candidate.status === 'Available' ? 'success' : 'warning'}>{candidate.status}</Tag>
                  </div>

                  <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                    {candidate.experience} exp • {candidate.location} • Current: {candidate.currentCompany}
                  </Text>

                  <Space wrap style={{ marginBottom: '16px' }}>
                    {candidate.skills.map(skill => (
                      <Tag key={skill} style={{ margin: 0 }}>{skill}</Tag>
                    ))}
                  </Space>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '16px', borderTop: `1px solid ${token.colorBorder}` }}>
                    <Button type="primary" icon={<Mail size={16} />}>Message</Button>
                    <Button icon={<Calendar size={16} />}>Schedule Interview</Button>
                    <Button type="text" icon={<FileText size={16} />}>View Resume</Button>
                  </div>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      </Content>
    </Layout>
  );
}
