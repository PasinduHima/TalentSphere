import React, { useState } from 'react';
import { Card, Typography, Row, Col, Table, Tag, Progress, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
} from 'recharts';
import { Briefcase, Users, Calendar, TrendingUp, ArrowRight, Clock } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import StatusBadge from '../../../components/shared/StatusBadge';

const { Title, Text } = Typography;

// Dummy data
const PIPELINE_DATA = [
  { stage: 'Applied', count: 124 },
  { stage: 'Screening', count: 68 },
  { stage: 'Interview', count: 34 },
  { stage: 'Offer', count: 12 },
  { stage: 'Hired', count: 8 },
];

const RECENT_APPLICATIONS = [
  { id: '1', candidateName: 'Sarah Mitchell', jobTitle: 'Senior Frontend Engineer', matchScore: 94, status: 'Interview', appliedAt: '2026-07-18T09:30:00Z' },
  { id: '2', candidateName: 'James Rodriguez', jobTitle: 'Backend Developer', matchScore: 87, status: 'Screening', appliedAt: '2026-07-19T14:15:00Z' },
  { id: '3', candidateName: 'Emily Chen', jobTitle: 'Product Designer', matchScore: 91, status: 'Applied', appliedAt: '2026-07-20T11:00:00Z' },
  { id: '4', candidateName: 'Michael Okafor', jobTitle: 'DevOps Engineer', matchScore: 78, status: 'Interview', appliedAt: '2026-07-17T16:45:00Z' },
  { id: '5', candidateName: 'Priya Sharma', jobTitle: 'Data Analyst', matchScore: 82, status: 'Offer', appliedAt: '2026-07-15T08:20:00Z' },
];

const UPCOMING_INTERVIEWS = [
  { id: '1', candidateName: 'Sarah Mitchell', jobTitle: 'Senior Frontend Engineer', type: 'Technical', scheduledAt: '2026-07-23T14:00:00Z', duration: 60 },
  { id: '2', candidateName: 'Michael Okafor', jobTitle: 'DevOps Engineer', type: 'Cultural Fit', scheduledAt: '2026-07-24T10:30:00Z', duration: 45 },
  { id: '3', candidateName: 'Lena Kowalski', jobTitle: 'QA Lead', type: 'Final Round', scheduledAt: '2026-07-25T15:00:00Z', duration: 30 },
];

export default function RecruiterDashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const firstName = user?.firstName || 'there';

  const metrics = [
    { label: 'Active Jobs', value: 12, icon: <Briefcase size={20} color={token.colorPrimary} />, change: '+3 this month' },
    { label: 'Total Candidates', value: 246, icon: <Users size={20} color="#6366f1" />, change: '+18 this week' },
    { label: 'Interviews This Week', value: 8, icon: <Calendar size={20} color="#16a34a" />, change: '3 today' },
    { label: 'Avg. Time-to-Hire', value: '18d', icon: <TrendingUp size={20} color="#d97706" />, change: '↓ 2d vs last month' },
  ];

  const columns = [
    {
      title: 'Candidate',
      key: 'candidate',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#eef2ff', color: token.colorPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '11px', flexShrink: 0 }}>
            {record.candidateName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: token.colorText, fontSize: '14px' }}>{record.candidateName}</div>
            <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>{record.jobTitle}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'AI Match',
      dataIndex: 'matchScore',
      key: 'match',
      render: (score) => (
        <span style={{ fontWeight: 600, color: score >= 90 ? '#16a34a' : score >= 80 ? '#d97706' : token.colorTextSecondary, fontSize: '14px' }}>
          {score}%
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <StatusBadge status={status} type="application" />,
    },
    {
      title: 'Applied',
      dataIndex: 'appliedAt',
      key: 'appliedAt',
      render: (date) => <span style={{ color: token.colorTextSecondary, fontSize: '13px' }}>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Welcome back, {firstName}</Title>
        <Text type="secondary" style={{ marginTop: '4px', display: 'block' }}>Here's your recruitment pipeline overview for today.</Text>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        {metrics.map((metric, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '24px' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '8px', borderRadius: '8px', border: `1px solid ${token.colorBorder}`, display: 'inline-flex', marginBottom: '16px' }}>
                {metric.icon}
              </div>
              <div>
                <Title level={3} style={{ margin: 0, fontWeight: 700 }}>{metric.value}</Title>
                <Text type="secondary" style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginTop: '4px' }}>{metric.label}</Text>
                <Text style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px', display: 'block' }}>{metric.change}</Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* Hiring Pipeline Chart */}
        <Col xs={24} lg={14}>
          <Card title="Hiring Pipeline" bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', height: '100%' }} bodyStyle={{ padding: '24px', height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PIPELINE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={token.colorBorder} />
                <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fill: token.colorTextSecondary }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: token.colorTextSecondary }} allowDecimals={false} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill={token.colorPrimary} radius={[4, 4, 0, 0]} name="Candidates" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Upcoming Interviews */}
        <Col xs={24} lg={10}>
          <Card
            title="Upcoming Interviews"
            extra={<a onClick={() => navigate('/recruiter/interviews')} style={{ color: token.colorPrimary, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>View all <ArrowRight size={14} /></a>}
            bordered={false}
            style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', height: '100%' }}
            bodyStyle={{ padding: '0' }}
          >
            {UPCOMING_INTERVIEWS.map((interview, idx) => (
              <div key={interview.id} style={{ padding: '16px 24px', borderBottom: idx < UPCOMING_INTERVIEWS.length - 1 ? `1px solid ${token.colorBorder}` : 'none', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', padding: '8px 12px', minWidth: '64px', border: `1px solid ${token.colorBorder}` }}>
                  <Text strong style={{ fontSize: '14px', lineHeight: 1.2 }}>{new Date(interview.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                  <Text type="secondary" style={{ fontSize: '11px', fontWeight: 500 }}>{new Date(interview.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</Text>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text strong style={{ display: 'block', fontSize: '14px' }}>{interview.candidateName}</Text>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>{interview.jobTitle}</Text>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <Tag color="blue" style={{ margin: 0, fontSize: '11px' }}>{interview.type}</Tag>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: token.colorTextSecondary }}><Clock size={12} /> {interview.duration}m</span>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      {/* Recent Applications */}
      <Card
        title="Recent Applications"
        extra={<a onClick={() => navigate('/recruiter/jobs')} style={{ color: token.colorPrimary, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>View all jobs <ArrowRight size={14} /></a>}
        bordered={false}
        style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          columns={columns}
          dataSource={RECENT_APPLICATIONS}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
}
