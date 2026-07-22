import React, { useEffect, useState } from 'react';
import { Card, Button, Input, Typography, Layout, theme, Space, Tag, Row, Col, Spin, Empty, message, Drawer, Divider } from 'antd';
import AIMatchScore from '../../../components/shared/AIMatchScore';
import { candidateApi } from '../../../lib/api/candidate';
import { Search, MapPin, Clock, DollarSign, Building2, Briefcase, GraduationCap } from 'lucide-react';

const { Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const DUMMY_JOBS = [
  { 
    id: 'j1', 
    title: 'Senior Software Engineer', 
    company: 'Home Depot', 
    location: 'Remote', 
    salaryMin: 90000, 
    salaryMax: 180000, 
    matchScore: 96, 
    skills: ['Go', 'React', 'TypeScript', 'GCP', 'BigQuery'], 
    postedAt: '2026-07-20T10:00:00Z', 
    type: 'Full-time',
    description: `Position Purpose:
The Technology Insights team gives Home Depot engineering leadership visibility into how the organization builds software — delivery velocity, code quality, deployment health, and AI-assisted development adoption — through a portfolio of internal platforms and integrations spanning a variety of internal tooling and SaaS products. As a Senior Software Engineer, you will design, build, and operate the data pipelines, backend services, and integrations that turn raw engineering signals into trusted, actionable metrics for engineering leaders across the company. You'll work across the full stack — from cloud infrastructure and data modeling to APIs and the automation that keeps operational records accurate — and adopt AI-native engineering practices in how we build, not just what we build.

Direct Manager/Direct Reports:
This position typically reports to Software Engineer Manager or Sr. Manager
This position has 0 Direct Reports

Travel Requirements:
No travel required.

Physical Requirements:
Most of the time is spent sitting in a comfortable position and there is frequent opportunity to move about.

Working Conditions:
Located in a comfortable indoor area. Any unpleasant conditions would be infrequent and not objectionable.`,
    responsibilities: [
      '50% Delivery and Execution - Develops, tests, deploys, and maintains software, with a clear understanding of the value the software is to provide; Takes on new opportunities and tough challenges with a sense of urgency, high energy and enthusiasm.',
      '20% Learns and Grows - Learns through successful and failed experiment when tackling new problems; Actively seeks ways to grow and be challenged using both formal and informal development channels.',
      '20% Plans and Aligns - Collaborates with other team members in agile processes; Creates new and better ways for the organization to be successful; Works the Product Team to ensure user stories are valuable.',
      '10% Supports and Enables - Helps grow junior engineers by providing guidance on modern software development frameworks, and leading technical discussions.'
    ],
    qualifications: [
      'Must be eighteen years of age or older. Must be legally permitted to work in the United States.',
      '3-5 years of experience',
      'Experience building and operating production services on Google Cloud Platform, including BigQuery',
      'Familiarity with engineering metrics and DORA-style measurement (deployment frequency, lead time, change failure rate)',
      'Proficiency in Go, React, and TypeScript — our backend services are primarily Go, with React/TypeScript front ends',
      'Prompt engineering experience and exposure to building or operating LLM-backed agents or tools',
      'Comfort working in a small platform team supporting many internal stakeholders',
      'Strong data instincts: comfortable writing and reasoning about SQL against BigQuery datasets',
      'Prior experience in a role that sits between a platform team and its internal customers'
    ],
    applyEndDate: '08/28/2026'
  },
  { 
    id: 'j2', 
    title: 'Full Stack Developer', 
    company: 'FinVault', 
    location: 'Remote', 
    salaryMin: 130000, 
    salaryMax: 170000, 
    matchScore: 91, 
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'], 
    postedAt: '2026-07-19T10:00:00Z', 
    type: 'Full-time',
    description: `Position Purpose:
FinVault is revolutionizing decentralized finance by providing enterprise-grade infrastructure to retail investors. The Core Banking team provides the backbone for all transaction processing, ledger management, and financial reporting. As a Full Stack Developer, you will architect secure APIs, optimize complex database transactions, and build responsive dashboards that process millions of dollars daily. We operate in a highly regulated environment, so security, compliance, and code quality are paramount.

Direct Manager/Direct Reports:
This position typically reports to the Director of Engineering.
This position has 0 Direct Reports, but involves mentoring junior staff.

Travel Requirements:
10% travel required for quarterly team offsites and industry conferences.

Physical Requirements:
General office environment. Ability to sit and type for extended periods.

Working Conditions:
Remote position with flexible hours. Occasional on-call rotations required.`,
    responsibilities: [
      '40% Architecture & Design - Lead the technical design of new microservices; evaluate new technologies; ensure compliance with SOC2 standards.',
      '40% Coding & Implementation - Write robust, testable code in Node.js and React; optimize PostgreSQL schemas; build real-time financial dashboards.',
      '10% Code Review & Quality - Conduct thorough code reviews; maintain high test coverage; triage and resolve production bugs.',
      '10% Team Collaboration - Participate in daily standups, sprint planning, and retrospective meetings; translate business requirements into technical specs.'
    ],
    qualifications: [
      'Must be legally permitted to work in the United States or Canada.',
      '4+ years of professional full-stack development experience.',
      'Deep expertise in modern JavaScript/TypeScript (Node.js and React).',
      'Extensive experience with relational databases (PostgreSQL preferred) and query optimization.',
      'Solid understanding of AWS infrastructure (EC2, RDS, S3, Lambda).',
      'Familiarity with financial compliance, encryption, and secure coding practices (OWASP).',
      'Experience with CI/CD pipelines and automated testing frameworks (Jest, Cypress).',
      'Excellent communication skills and ability to explain complex technical concepts to non-technical stakeholders.'
    ],
    applyEndDate: '08/15/2026'
  },
  { 
    id: 'j3', 
    title: 'React Native Developer', 
    company: 'CloudNova', 
    location: 'New York, NY', 
    salaryMin: 120000, 
    salaryMax: 160000, 
    matchScore: 87, 
    skills: ['React Native', 'iOS', 'Android', 'TypeScript'], 
    postedAt: '2026-07-18T10:00:00Z', 
    type: 'Full-time',
    description: `Position Purpose:
CloudNova is building the next generation of productivity and collaboration tools for enterprise teams. Our mobile application is a core part of our strategy, allowing users to stay connected and productive on the go. We need a React Native expert to take our mobile app to the next level, ensuring a seamless and native-feeling experience across both iOS and Android platforms. You will work closely with design and product teams to implement complex gestures, offline syncing, and real-time data updates.

Direct Manager/Direct Reports:
Reports to Mobile Engineering Lead.
0 Direct Reports.

Travel Requirements:
No travel required.

Physical Requirements:
Standard office environment physical requirements.

Working Conditions:
Located in our modern New York City office with a hybrid work schedule (3 days in-office, 2 days remote).`,
    responsibilities: [
      '60% Feature Development - Architect and build the core CloudNova mobile application using React Native; implement complex UI animations and offline-first syncing capabilities.',
      '20% Native Integration - Write native modules in Swift/Objective-C or Kotlin/Java when performance dictates or when accessing low-level device APIs.',
      '10% Performance Optimization - Profile and optimize the application to ensure high performance and 60fps framerates on older devices; minimize battery and memory consumption.',
      '10% Quality Assurance - Write unit and integration tests; collaborate with QA to ensure a bug-free release cycle across multiple OS versions and screen sizes.'
    ],
    qualifications: [
      'Bachelor’s degree in Computer Science or equivalent experience.',
      '3+ years of production experience with React Native.',
      'Experience publishing apps to the App Store and Google Play Store.',
      'Understanding of native iOS and Android lifecycles and build tools (Xcode, Android Studio).',
      'Strong eye for UI/UX details and experience implementing complex animations (Reanimated).',
      'Experience with state management libraries (Redux, Zustand, or MobX).',
      'Solid understanding of offline storage, SQLite, and real-time data synchronization.'
    ],
    applyEndDate: '09/01/2026'
  },
  { 
    id: 'j4', 
    title: 'UI/UX Engineer', 
    company: 'BrightPath', 
    location: 'Austin, TX', 
    salaryMin: 110000, 
    salaryMax: 145000, 
    matchScore: 83, 
    skills: ['Figma', 'CSS', 'React', 'Design Systems'], 
    postedAt: '2026-07-17T10:00:00Z', 
    type: 'Full-time',
    description: `Position Purpose:
As a UI/UX Engineer at BrightPath, you will bridge the critical gap between design and engineering. You will be responsible for maintaining our global design system and ensuring that our React components are accessible, beautiful, and easy for other developers to consume. You aren't just writing code; you are shaping the visual language of our entire product suite. This role requires a rare blend of technical prowess in React/CSS and a deep empathy for user experience and visual design.

Direct Manager/Direct Reports:
Reports to VP of Product Design.
0 Direct Reports.

Travel Requirements:
Occasional travel (1-2 times a year) for company offsites.

Physical Requirements:
General office setting.

Working Conditions:
Flexible hybrid model in our Austin headquarters. Open, collaborative office layout.`,
    responsibilities: [
      '50% Component Development - Develop and maintain the BrightPath React component library; translate Figma designs into pixel-perfect, accessible React components.',
      '20% Design System Management - Establish and enforce CSS architecture and styling best practices; document component usage guidelines and APIs.',
      '20% UX Prototyping - Build interactive prototypes for complex user flows to test assumptions before full backend implementation.',
      '10% Accessibility & Compliance - Ensure all UI components meet WCAG 2.1 AA accessibility standards; conduct regular audits with screen readers.'
    ],
    qualifications: [
      'Portfolio demonstrating strong UI/UX sensibilities and high-quality frontend code.',
      'Expertise in modern CSS (Grid, Flexbox, Custom Properties, Animations) and HTML5.',
      'Deep understanding of web accessibility (WCAG) standards and ARIA attributes.',
      'Experience building scalable React applications and managing state.',
      'Proficiency with Figma and understanding of design tokens.',
      'Experience working closely with product designers and interpreting design intent.',
      'Familiarity with Storybook or similar UI component development environments.'
    ],
    applyEndDate: '08/20/2026'
  },
  { 
    id: 'j5', 
    title: 'DevOps Engineer', 
    company: 'DataStream', 
    location: 'Remote', 
    salaryMin: 140000, 
    salaryMax: 190000, 
    matchScore: 74, 
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'], 
    postedAt: '2026-07-16T10:00:00Z', 
    type: 'Full-time',
    description: `Position Purpose:
DataStream handles petabytes of real-time data daily. Our infrastructure must be incredibly resilient, scalable, and secure. We need a Senior DevOps Engineer to harden our infrastructure, improve our CI/CD pipelines, and ensure 99.99% uptime for our core data ingestion services. You will be the backbone of our engineering organization, empowering developers to ship code quickly and safely while maintaining strict operational standards.

Direct Manager/Direct Reports:
Reports to Director of Cloud Infrastructure.
No direct reports.

Travel Requirements:
Minimal to none.

Physical Requirements:
Standard remote office requirements.

Working Conditions:
Fully remote. Requires participation in a rotating 24/7 on-call schedule.`,
    responsibilities: [
      '40% Infrastructure Management - Manage and scale complex Kubernetes clusters on AWS (EKS); implement Infrastructure as Code using Terraform and Terragrunt.',
      '30% CI/CD Pipelines - Optimize CI/CD pipelines (GitHub Actions) for faster, more reliable deployments; implement blue-green and canary deployment strategies.',
      '20% Observability & Reliability - Build comprehensive monitoring and alerting stacks using Prometheus, Grafana, and DataDog; conduct blameless post-mortems.',
      '10% Security & Compliance - Enforce IAM least-privilege policies; manage secrets and certificates; assist with SOC2 compliance audits.'
    ],
    qualifications: [
      '5+ years of experience in DevOps, Site Reliability Engineering, or Cloud Architecture.',
      'Strong background in Linux administration and advanced bash/Python scripting.',
      'Extensive production experience with AWS services (EC2, S3, RDS, VPC, IAM) and Kubernetes.',
      'Deep expertise with Terraform or similar Infrastructure as Code tools.',
      'Proficiency with CI/CD tools and modern deployment paradigms.',
      'Experience configuring and managing observability stacks.',
      'Strong understanding of networking concepts (DNS, TCP/IP, Load Balancing).'
    ],
    applyEndDate: '08/30/2026'
  },
  { 
    id: 'j6', 
    title: 'Product Designer', 
    company: 'DesignForge', 
    location: 'Los Angeles, CA', 
    salaryMin: 100000, 
    salaryMax: 140000, 
    matchScore: 69, 
    skills: ['Figma', 'User Research', 'Prototyping', 'UI/UX'], 
    postedAt: '2026-07-15T10:00:00Z', 
    type: 'Contract',
    description: `Position Purpose:
DesignForge is a premier digital product agency working with Fortune 500 clients to build innovative mobile and web experiences. As a Product Designer, you will lead the end-to-end design process from initial concept and user research through to high-fidelity prototyping and developer handoff. You will tackle complex problems and distill them into intuitive, elegant, and delightful user interfaces. 

Direct Manager/Direct Reports:
Reports to the Creative Director.
0 Direct Reports.

Travel Requirements:
Occasional travel to client sites (10-15%).

Physical Requirements:
Standard office environment.

Working Conditions:
Hybrid schedule out of our LA studio. Fast-paced agency environment.`,
    responsibilities: [
      '40% Interface Design - Create stunning, pixel-perfect user interfaces for web and mobile platforms using Figma; develop and maintain robust design systems.',
      '30% UX & Interaction - Map out user journeys, create wireframes, and build interactive prototypes to communicate design intent and test user flows.',
      '20% User Research - Conduct user interviews, surveys, and usability testing; synthesize findings into actionable design improvements.',
      '10% Client & Developer Collaboration - Present designs to stakeholders and clients, articulating the rationale behind design decisions; collaborate closely with engineers during implementation.'
    ],
    qualifications: [
      'A standout portfolio showcasing end-to-end product design (UX and UI) across web and mobile platforms.',
      '3+ years of professional product design experience in an agency or fast-paced tech company.',
      'Mastery of Figma, including advanced prototyping, auto-layout, and component variants.',
      'Strong understanding of typography, color theory, and layout principles.',
      'Experience planning and conducting generative and evaluative user research.',
      'Excellent communication and storytelling skills; ability to defend design decisions effectively.',
      'Basic understanding of HTML/CSS to communicate effectively with developers.'
    ],
    applyEndDate: '07/30/2026'
  },
  { 
    id: 'j7', 
    title: 'Data Engineer', 
    company: 'QuantumLab', 
    location: 'Seattle, WA', 
    salaryMin: 155000, 
    salaryMax: 210000, 
    matchScore: 62, 
    skills: ['Python', 'Spark', 'SQL', 'Airflow', 'Snowflake'], 
    postedAt: '2026-07-14T10:00:00Z', 
    type: 'Full-time',
    description: `Position Purpose:
QuantumLab is pushing the boundaries of machine learning and predictive analytics in the healthcare sector. Data is our lifeblood. As a Data Engineer, you will design, construct, and maintain the highly scalable data architectures that power our ML models. You will be responsible for building robust ETL pipelines, managing data warehouses, and ensuring data quality and governance across billions of rows of sensitive medical data.

Direct Manager/Direct Reports:
Reports to the Head of Data Engineering.
0 Direct Reports.

Travel Requirements:
No travel required.

Physical Requirements:
Standard office environment physical requirements.

Working Conditions:
Located in our Seattle headquarters. Hybrid remote policy.`,
    responsibilities: [
      '50% Pipeline Development - Design and build scalable, reliable ETL/ELT pipelines using Apache Airflow, Python, and Apache Spark to ingest data from diverse sources.',
      '30% Data Architecture - Architect and optimize data models within Snowflake; ensure query performance and cost efficiency for massive datasets.',
      '10% Data Quality - Implement automated data validation and quality checks; establish data governance and lineage practices to ensure compliance with HIPAA.',
      '10% ML Support - Collaborate with Data Scientists to prepare feature stores and operationalize machine learning models in production.'
    ],
    qualifications: [
      'Bachelor’s or Master’s degree in Computer Science, Engineering, or a related field.',
      '4+ years of dedicated Data Engineering experience.',
      'Advanced proficiency in SQL and Python.',
      'Extensive experience with big data processing frameworks (Apache Spark, Hadoop, etc.).',
      'Strong experience with workflow orchestration tools (Apache Airflow, Prefect, or Dagster).',
      'Proven track record managing cloud data warehouses (Snowflake, BigQuery, or Redshift).',
      'Understanding of data modeling concepts (Star schema, Snowflake schema, Data Vault).',
      'Experience working with sensitive data and an understanding of HIPAA compliance is a strong plus.'
    ],
    applyEndDate: '09/15/2026'
  }
];

function formatSalary(min, max) {
  if (!min && !max) return 'Salary not disclosed';
  const fmt = (n) => `$${Math.round(n / 1000)}k`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  return fmt(min || max);
}

function timeAgo(dateStr) {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export default function JobSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [dbJobs, setDbJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [appliedIds, setAppliedIds] = useState(new Set());
  
  // Drawer state
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const { token } = theme.useToken();

  const loadJobs = async () => {
    setLoading(true);
    try {
      const result = await candidateApi.searchJobs({ page: 1, pageSize: 50 });
      setDbJobs(result.items || []);
    } catch {
      setDbJobs([]);
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

  const getDisplayedJobs = () => {
    const formattedDbJobs = dbJobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.department?.name || 'TalentSphere',
      location: job.location || 'Remote',
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      matchScore: job.matchScore || 0,
      skills: (job.skills || []).map(s => typeof s === 'string' ? s : s.name),
      postedAt: job.createdAt || job.postedAt,
      type: job.employmentType || 'Full-time',
      description: job.description,
      responsibilities: job.requirements ? [job.requirements] : [],
      qualifications: [],
      applyEndDate: ''
    }));

    const allJobs = [...formattedDbJobs, ...DUMMY_JOBS];

    return allJobs.filter(j => {
      const termMatch = !searchTerm || j.title.toLowerCase().includes(searchTerm.toLowerCase()) || (j.company && j.company.toLowerCase().includes(searchTerm.toLowerCase()));
      const locMatch = !location || (j.location && j.location.toLowerCase().includes(location.toLowerCase()));
      return termMatch && locMatch;
    });
  };

  const displayedJobs = getDisplayedJobs();

  const handleSearch = () => {
    // State updates already trigger re-render and filtering
  };

  const clearFilters = () => {
    setLocation('');
    setSearchTerm('');
  };

  const handleApply = async (job, e) => {
    if (e) e.stopPropagation(); // Prevent opening drawer
    setApplyingId(job.id);
    try {
      await candidateApi.applyToJob({ jobPostingId: job.id });
      setAppliedIds((prev) => new Set(prev).add(job.id));
      message.success(`Applied to ${job.title}`);
    } catch {
      // For dummy jobs, just simulate success
      if (DUMMY_JOBS.some(d => d.id === job.id)) {
        setAppliedIds((prev) => new Set(prev).add(job.id));
        message.success(`Applied to ${job.title}`);
      } else {
        message.error('Failed to apply. Please try again.');
      }
    } finally {
      setApplyingId(null);
    }
  };

  const openJobDetails = async (job) => {
    // If it's a dummy job, it already has full details
    if (DUMMY_JOBS.some(d => d.id === job.id)) {
      setSelectedJob(job);
      setDrawerVisible(true);
      return;
    }

    // It's a real database job. The search API doesn't return description/requirements, so fetch them.
    try {
      const detail = await candidateApi.getJob(job.id);
      setSelectedJob({
        ...job,
        description: detail.description,
        responsibilities: detail.requirements ? detail.requirements.split('\n').filter(r => r.trim()) : [],
        qualifications: [],
        applyEndDate: detail.closingDate ? new Date(detail.closingDate).toLocaleDateString() : 'Not specified',
      });
      setDrawerVisible(true);
    } catch (err) {
      message.error('Failed to load job details.');
    }
  };

  return (
    <Layout style={{ background: 'transparent', minHeight: 'calc(100vh - 150px)', gap: '24px' }}>
      {/* Filters Sidebar */}
      <Sider width={260} style={{ background: 'transparent' }} breakpoint="lg" collapsedWidth="0" trigger={null}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Filters</Title>
            <Button type="text" size="small" style={{ color: token.colorTextSecondary }} onClick={clearFilters}>Clear All</Button>
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
            <Text strong style={{ fontSize: '18px' }}>{loading ? 'Searching…' : `${displayedJobs.length} job${displayedJobs.length === 1 ? '' : 's'} found`}</Text>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}><Spin size="large" /></div>
        ) : displayedJobs.length === 0 ? (
          <Empty description="No jobs match your search" style={{ padding: '64px 0' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
            {displayedJobs.map(job => {
              const hasApplied = appliedIds.has(job.id);
              return (
                <Card 
                  key={job.id} 
                  bordered={false} 
                  style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, transition: 'box-shadow 0.2s', cursor: 'pointer' }} 
                  hoverable
                  onClick={() => openJobDetails(job)}
                >
                  <Row gutter={[16, 16]} align="middle">
                    <Col flex="48px">
                      <div style={{ width: '48px', height: '48px', backgroundColor: '#eef2ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e0e7ff' }}>
                        <span style={{ fontWeight: 700, color: token.colorPrimary, fontSize: '13px' }}>{job.company?.slice(0, 2).toUpperCase() || 'CO'}</span>
                      </div>
                    </Col>
                    <Col flex="auto">
                      <Title level={5} style={{ margin: 0, marginBottom: '4px', color: token.colorPrimary }}>{job.title}</Title>
                      <Text type="secondary" style={{ display: 'block' }}>{job.company} • {job.location}</Text>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: token.colorTextSecondary }}>
                          <DollarSign size={13} /> {formatSalary(job.salaryMin, job.salaryMax)}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: token.colorTextSecondary }}>
                          <Clock size={13} /> {timeAgo(job.postedAt || job.createdAt || '2026-07-20')}
                        </span>
                        {job.type && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: token.colorTextSecondary }}>
                            <Building2 size={13} /> {job.type}
                          </span>
                        )}
                      </div>

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
                          <Button
                            type="primary"
                            disabled={hasApplied}
                            loading={applyingId === job.id}
                            onClick={(e) => handleApply(job, e)}
                            style={{ borderRadius: '8px' }}
                          >
                            {hasApplied ? '✓ Applied' : 'Apply Now'}
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

      {/* Job Details Drawer */}
      <Drawer
        title={<span style={{ fontSize: '20px', fontWeight: 600 }}>Job Details</span>}
        placement="right"
        width={720}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        bodyStyle={{ padding: '0' }}
        footer={
          selectedJob && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button onClick={() => setDrawerVisible(false)}>Cancel</Button>
              <Button 
                type="primary" 
                onClick={(e) => { handleApply(selectedJob, e); setDrawerVisible(false); }}
                disabled={appliedIds.has(selectedJob.id)}
              >
                {appliedIds.has(selectedJob.id) ? 'Already Applied' : 'Apply Now'}
              </Button>
            </div>
          )
        }
      >
        {selectedJob && (
          <div style={{ padding: '24px' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: '#eef2ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e0e7ff', flexShrink: 0 }}>
                <span style={{ fontWeight: 700, color: token.colorPrimary, fontSize: '20px' }}>{selectedJob.company?.slice(0, 2).toUpperCase() || 'CO'}</span>
              </div>
              <div>
                <Title level={3} style={{ margin: 0 }}>{selectedJob.title}</Title>
                <Text style={{ fontSize: '16px', color: token.colorTextSecondary }}>{selectedJob.company} • {selectedJob.location}</Text>
              </div>
            </div>

            <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
              <Col span={8}>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '4px' }}><DollarSign size={14} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }}/> Pay</Text>
                  <Text strong>{formatSalary(selectedJob.salaryMin, selectedJob.salaryMax)} a year</Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '4px' }}><Building2 size={14} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }}/> Work setting</Text>
                  <Text strong>{selectedJob.type}, {selectedJob.location.includes('Remote') ? 'Remote' : 'On-site'}</Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '4px' }}><Clock size={14} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }}/> Posted</Text>
                  <Text strong>{timeAgo(selectedJob.postedAt || selectedJob.createdAt || '2026-07-20')}</Text>
                </div>
              </Col>
            </Row>

            <Divider />

            {/* Description Section */}
            <div style={{ marginBottom: '32px' }}>
              <Title level={4} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={20} color={token.colorPrimary}/> Full job description
              </Title>
              <Paragraph style={{ whiteSpace: 'pre-line', fontSize: '15px', lineHeight: '1.8' }}>
                {selectedJob.description || "No description provided for this job."}
              </Paragraph>
            </div>

            {/* Responsibilities Section */}
            {selectedJob.responsibilities && (
              <div style={{ marginBottom: '32px' }}>
                <Title level={5}>Key Responsibilities:</Title>
                <ul style={{ paddingLeft: '20px', fontSize: '15px', lineHeight: '1.8' }}>
                  {selectedJob.responsibilities.map((resp, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Qualifications Section */}
            {selectedJob.qualifications && (
              <div style={{ marginBottom: '32px' }}>
                <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GraduationCap size={20} color={token.colorPrimary}/> Qualifications
                </Title>
                <ul style={{ paddingLeft: '20px', fontSize: '15px', lineHeight: '1.8' }}>
                  {selectedJob.qualifications.map((qual, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>{qual}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* End Date */}
            {selectedJob.applyEndDate && (
              <Text type="secondary" italic style={{ display: 'block', marginTop: '24px' }}>
                Apply End Date: {selectedJob.applyEndDate}.
              </Text>
            )}

          </div>
        )}
      </Drawer>
    </Layout>
  );
}
