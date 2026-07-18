import React, { useEffect, useState } from 'react';
import { Card, Input, Tag, Layout, Typography, theme, Row, Col, Space, Spin, Empty, message, Button } from 'antd';
import { recruiterApi } from '../../../lib/api/recruiter';
import { getApiErrorMessage } from '../../../lib/apiClient';
import { Search } from 'lucide-react';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function CandidateSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { token } = theme.useToken();

  const loadCandidates = async (filters = {}) => {
    setLoading(true);
    try {
      const result = await recruiterApi.searchCandidates({ page: 1, pageSize: 20, ...filters });
      setCandidates(result.items);
      setTotalCount(result.totalCount);
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to load candidates.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCandidates(); }, []);

  const handleSearch = () => {
    loadCandidates({ keyword: searchTerm || undefined, skill: skillFilter || undefined });
  };

  return (
    <Layout style={{ background: 'transparent', minHeight: 'calc(100vh - 150px)', gap: '24px' }}>
      {/* Filters Sidebar */}
      <Sider width={260} style={{ background: 'transparent' }} breakpoint="lg" collapsedWidth="0" trigger={null}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Filters</Title>
          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>Skill</Text>
            <Input placeholder="e.g. React" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} onPressEnter={handleSearch} />
          </div>
          <Button type="primary" block onClick={handleSearch}>Apply Filters</Button>
        </div>
      </Sider>

      {/* Main Content */}
      <Content style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <Input
            size="large"
            prefix={<Search size={16} color={token.colorTextSecondary} />}
            placeholder="Search by name or headline"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={handleSearch}
            style={{ flex: 1 }}
          />
          <Button type="primary" size="large" style={{ padding: '0 24px' }} onClick={handleSearch}>Search</Button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <Text strong style={{ fontSize: '18px' }}>{loading ? 'Searching…' : `${totalCount} candidate${totalCount === 1 ? '' : 's'} found`}</Text>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}><Spin size="large" /></div>
        ) : candidates.length === 0 ? (
          <Empty description="No candidates match your search" style={{ padding: '64px 0' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
            {candidates.map(candidate => (
              <Card key={candidate.candidateProfileId} bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}` }} bodyStyle={{ padding: '24px' }}>
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={4} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.fullName)}&background=random`}
                      alt={candidate.fullName}
                      style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: `1px solid ${token.colorBorder}` }}
                    />
                  </Col>

                  <Col xs={24} lg={20} style={{ display: 'flex', flexDirection: 'column' }}>
                    <Title level={4} style={{ margin: 0 }}>{candidate.fullName}</Title>
                    <Text strong style={{ color: token.colorTextSecondary }}>{candidate.headline || 'No headline set'}</Text>

                    <Text type="secondary" style={{ display: 'block', margin: '8px 0 16px' }}>
                      {candidate.experienceYears} yrs exp • {candidate.location || 'Location not set'} • {candidate.email}
                    </Text>

                    <Space wrap>
                      {candidate.skills.length === 0
                        ? <Text type="secondary" style={{ fontSize: '13px' }}>No skills listed</Text>
                        : candidate.skills.map(skill => <Tag key={skill} style={{ margin: 0 }}>{skill}</Tag>)}
                    </Space>
                  </Col>
                </Row>
              </Card>
            ))}
          </div>
        )}
      </Content>
    </Layout>
  );
}
