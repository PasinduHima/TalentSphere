import React, { useState } from 'react';
import { Card, Button, Input, Slider, Typography, Layout, theme, Space, Tag, Divider, Row, Col } from 'antd';
import AIMatchScore from '../../../components/shared/AIMatchScore';
import { mockJobs } from '../../../data/mockData';
import { Search, MapPin, ChevronDown } from 'lucide-react';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function JobSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = theme.useToken();

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
              <Text strong style={{ display: 'block', marginBottom: '8px' }}>Location</Text>
              <Input prefix={<MapPin size={16} color={token.colorTextSecondary} />} placeholder="City, state, or remote" defaultValue="San Francisco, CA" />
            </div>

            <div>
              <Text strong style={{ display: 'block', marginBottom: '8px' }}>Job Type</Text>
              <Space wrap>
                <Tag color={token.colorPrimary} style={{ cursor: 'pointer', margin: 0 }}>Full-time</Tag>
                <Tag style={{ cursor: 'pointer', margin: 0 }}>Contract</Tag>
                <Tag style={{ cursor: 'pointer', margin: 0 }}>Remote</Tag>
              </Space>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text strong>Minimum AI Match</Text>
                <Text strong style={{ color: token.colorPrimary }}>80%</Text>
              </div>
              <Slider min={0} max={100} defaultValue={80} />
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
            placeholder="Search by job title, skill, or company" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button type="primary" size="large" style={{ padding: '0 24px' }}>Search</Button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <Text strong style={{ fontSize: '18px' }}>Recommended Jobs</Text>
            <Text type="secondary" style={{ marginLeft: '8px' }}>San Francisco, CA • Tech</Text>
          </div>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Text type="secondary">Sort by: </Text>
            <Text strong>Highest Match</Text>
            <ChevronDown size={16} color={token.colorTextSecondary} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          {mockJobs.map(job => (
            <Card key={job.id} bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}` }}>
              <Row gutter={[16, 16]} align="middle">
                <Col flex="48px">
                  <div style={{ width: '48px', height: '48px', backgroundColor: '#eef2ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e0e7ff' }}>
                    <span style={{ fontWeight: 700, color: token.colorPrimary }}>CO</span>
                  </div>
                </Col>
                <Col flex="auto">
                  <Title level={5} style={{ margin: 0, marginBottom: '4px' }}>{job.title}</Title>
                  <Text type="secondary" style={{ display: 'block' }}>{job.company} • {job.location}</Text>
                  
                  <Space wrap style={{ marginTop: '12px' }}>
                    {job.skills.map(skill => (
                      <Tag key={skill} color="blue" style={{ margin: 0 }}>
                        {skill}
                      </Tag>
                    ))}
                  </Space>
                </Col>
                
                <Col flex="none">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
                    <AIMatchScore score={job.matchScore} size="md" />
                    <div style={{ textAlign: 'right' }}>
                      <Text strong style={{ display: 'block', marginBottom: '8px' }}>{job.salary}</Text>
                      <Button type="primary">Apply Now</Button>
                    </div>
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
