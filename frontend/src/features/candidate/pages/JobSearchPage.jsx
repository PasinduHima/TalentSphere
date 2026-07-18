import React, { useEffect, useState } from 'react';
import { Card, Button, Input, Typography, Layout, theme, Space, Tag, Row, Col, Spin, Empty, message } from 'antd';
import AIMatchScore from '../../../components/shared/AIMatchScore';
import { candidateApi } from '../../../lib/api/candidate';
import { getApiErrorMessage } from '../../../lib/apiClient';
import { Search, MapPin } from 'lucide-react';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

function formatSalary(min, max) {
  if (!min && !max) return 'Salary not disclosed';
  const fmt = (n) => `$${Math.round(n / 1000)}k`;
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  return fmt(min || max);
}

export default function JobSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const { token } = theme.useToken();

  const loadJobs = async (filters = {}) => {
    setLoading(true);
    try {
      const result = await candidateApi.searchJobs({ page: 1, pageSize: 20, ...filters });
      setJobs(result.items);
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to load jobs.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    candidateApi.getApplications().then((apps) => {
      setAppliedIds(new Set(apps.map((a) => a.jobPostingId)));
    }).catch(() => {});
  }, []);

  const handleSearch = () => {
    loadJobs({ keyword: searchTerm || undefined, location: location || undefined });
  };

  const handleApply = async (job) => {
    setApplyingId(job.id);
    try {
      await candidateApi.applyToJob({ jobPostingId: job.id });
      setAppliedIds((prev) => new Set(prev).add(job.id));
      message.success(`Applied to ${job.title}`);
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Could not submit your application.'));
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <Layout style={{ background: 'transparent', minHeight: 'calc(100vh - 150px)', gap: '24px' }}>
      {/* Filters Sidebar */}
      <Sider width={260} style={{ background: 'transparent' }} breakpoint="lg" collapsedWidth="0" trigger={null}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Filters</Title>
            <Button type="text" size="small" style={{ color: token.colorTextSecondary }} onClick={() => { setLocation(''); setSearchTerm(''); loadJobs(); }}>Clear All</Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <Text strong style={{ display: 'block', marginBottom: '8px' }}>Location</Text>
              <Input
                prefix={<MapPin size={16} color={token.colorTextSecondary} />}
                placeholder="City, state, or remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onPressEnter={handleSearch}
              />
            </div>
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
            placeholder="Search by job title or company"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={handleSearch}
            style={{ flex: 1 }}
          />
          <Button type="primary" size="large" style={{ padding: '0 24px' }} onClick={handleSearch}>Search</Button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <Text strong style={{ fontSize: '18px' }}>{loading ? 'Searching…' : `${jobs.length} jobs found`}</Text>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}><Spin size="large" /></div>
        ) : jobs.length === 0 ? (
          <Empty description="No jobs match your search" style={{ padding: '64px 0' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
            {jobs.map(job => {
              const hasApplied = appliedIds.has(job.id);
              return (
                <Card key={job.id} bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}` }}>
                  <Row gutter={[16, 16]} align="middle">
                    <Col flex="48px">
                      <div style={{ width: '48px', height: '48px', backgroundColor: '#eef2ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e0e7ff' }}>
                        <span style={{ fontWeight: 700, color: token.colorPrimary }}>{job.company?.slice(0, 2).toUpperCase() || 'CO'}</span>
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
                        <AIMatchScore score={Math.round(job.matchScore || 0)} size="md" />
                        <div style={{ textAlign: 'right' }}>
                          <Text strong style={{ display: 'block', marginBottom: '8px' }}>{formatSalary(job.salaryMin, job.salaryMax)}</Text>
                          <Button
                            type="primary"
                            disabled={hasApplied}
                            loading={applyingId === job.id}
                            onClick={() => handleApply(job)}
                          >
                            {hasApplied ? 'Applied' : 'Apply Now'}
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              );
            })}
          </div>
        )}
      </Content>
    </Layout>
  );
}
