import React, { useEffect, useState } from 'react';
import { Card, Input, Tag, Layout, Typography, theme, Row, Col, Space, Spin, Empty, message, Button, Progress } from 'antd';
import { recruiterApi } from '../../../lib/api/recruiter';
import { getApiErrorMessage } from '../../../lib/apiClient';
import { Search, MapPin, Mail, Briefcase, GraduationCap } from 'lucide-react';
import AIMatchScore from '../../../components/shared/AIMatchScore';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const DUMMY_CANDIDATES = [
  { candidateProfileId: 'c1', fullName: 'Sarah Mitchell', headline: 'Senior Frontend Engineer | React & TypeScript Expert', email: 'sarah.m@email.com', location: 'San Francisco, CA', experienceYears: 6, skills: ['React', 'TypeScript', 'GraphQL', 'Next.js', 'Tailwind CSS'], matchScore: 96, education: 'MS Computer Science, Stanford' },
  { candidateProfileId: 'c2', fullName: 'James Rodriguez', headline: 'Full Stack Developer | Node.js & AWS', email: 'james.r@email.com', location: 'Remote', experienceYears: 5, skills: ['Node.js', 'React', 'PostgreSQL', 'AWS', 'Docker'], matchScore: 91, education: 'BS Software Engineering, MIT' },
  { candidateProfileId: 'c3', fullName: 'Emily Chen', headline: 'Product Designer | User-Centered Design', email: 'emily.c@email.com', location: 'New York, NY', experienceYears: 4, skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'], matchScore: 87, education: 'BFA Interaction Design, SVA' },
  { candidateProfileId: 'c4', fullName: 'Michael Okafor', headline: 'DevOps Engineer | Cloud Infrastructure Specialist', email: 'michael.o@email.com', location: 'Austin, TX', experienceYears: 7, skills: ['Kubernetes', 'Terraform', 'AWS', 'CI/CD', 'Python'], matchScore: 83, education: 'BS Computer Engineering, UT Austin' },
  { candidateProfileId: 'c5', fullName: 'Priya Sharma', headline: 'Data Analyst | Machine Learning & Python', email: 'priya.s@email.com', location: 'Seattle, WA', experienceYears: 3, skills: ['Python', 'SQL', 'Tableau', 'Machine Learning', 'R'], matchScore: 78, education: 'MS Data Science, UW' },
  { candidateProfileId: 'c6', fullName: 'Lena Kowalski', headline: 'QA Lead | Automation & Performance Testing', email: 'lena.k@email.com', location: 'Chicago, IL', experienceYears: 8, skills: ['Selenium', 'Cypress', 'Jest', 'Performance Testing', 'JIRA'], matchScore: 74, education: 'BS Computer Science, UIC' },
  { candidateProfileId: 'c7', fullName: 'Alex Nguyen', headline: 'Backend Engineer | Go & Distributed Systems', email: 'alex.n@email.com', location: 'Remote', experienceYears: 5, skills: ['Go', 'gRPC', 'Kafka', 'PostgreSQL', 'Redis'], matchScore: 69, education: 'BS Computer Science, UC Berkeley' },
];

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
      if (result.items?.length) {
        setCandidates(result.items);
        setTotalCount(result.totalCount);
      } else {
        setCandidates(DUMMY_CANDIDATES);
        setTotalCount(DUMMY_CANDIDATES.length);
      }
    } catch {
      setCandidates(DUMMY_CANDIDATES);
      setTotalCount(DUMMY_CANDIDATES.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCandidates(); }, []);

  const handleSearch = () => {
    const filtered = DUMMY_CANDIDATES.filter(c => {
      if (searchTerm && !c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) && !c.headline.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (skillFilter && !c.skills.some(s => s.toLowerCase().includes(skillFilter.toLowerCase()))) return false;
      return true;
    });
    setCandidates(filtered);
    setTotalCount(filtered.length);
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
              <Card key={candidate.candidateProfileId} bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}` }} bodyStyle={{ padding: '24px' }} hoverable>
                <Row gutter={[24, 16]} align="top">
                  <Col xs={24} sm={4} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.fullName)}&background=random&size=96&bold=true`}
                      alt={candidate.fullName}
                      style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${token.colorBorder}` }}
                    />
                    {candidate.matchScore && <AIMatchScore score={candidate.matchScore} size="sm" />}
                  </Col>

                  <Col xs={24} sm={20} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <Title level={4} style={{ margin: 0 }}>{candidate.fullName}</Title>
                        <Text strong style={{ color: token.colorTextSecondary, fontSize: '14px' }}>{candidate.headline || 'No headline set'}</Text>
                      </div>
                      <Button type="primary" size="small">View Profile</Button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', margin: '12px 0', fontSize: '13px', color: token.colorTextSecondary }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Briefcase size={14} /> {candidate.experienceYears} yrs exp</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {candidate.location || 'Location not set'}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={14} /> {candidate.email}</span>
                      {candidate.education && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><GraduationCap size={14} /> {candidate.education}</span>}
                    </div>

                    <Space wrap>
                      {candidate.skills.length === 0
                        ? <Text type="secondary" style={{ fontSize: '13px' }}>No skills listed</Text>
                        : candidate.skills.map(skill => <Tag key={skill} color="blue" style={{ margin: 0 }}>{skill}</Tag>)}
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
