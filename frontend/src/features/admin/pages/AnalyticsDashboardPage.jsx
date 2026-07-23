import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, theme, Spin, message } from 'antd';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Users, Briefcase, Target, Activity } from 'lucide-react';
import { adminApi } from '../../../lib/api/admin';
import { getApiErrorMessage } from '../../../lib/apiClient';

const { Title, Text } = Typography;

const DUMMY_ANALYTICS = {
  totalUsers: 1245,
  activeJobs: 48,
  hireRatePercent: 12,
  averageMatchScore: 84,
  applicationsByStatus: {
    'Applied': 450,
    'Screening': 280,
    'Interview': 150,
    'Offer': 45,
    'Hired': 30,
    'Rejected': 520
  },
  jobsByDepartment: {
    'Engineering': 24,
    'Product': 8,
    'Sales': 10,
    'Marketing': 4,
    'HR': 2
  }
};

export default function AnalyticsDashboardPage() {
  const { token } = theme.useToken();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    adminApi.getAnalytics()
      .then((data) => setAnalytics(data || DUMMY_ANALYTICS))
      .catch(() => setAnalytics(DUMMY_ANALYTICS))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !analytics) {
    return <div style={{ textAlign: 'center', padding: '64px 0' }}><Spin size="large" /></div>;
  }

  const metrics = [
    { label: 'Total Users', value: analytics.totalUsers, icon: <Users size={20} color={token.colorPrimary} /> },
    { label: 'Active Jobs', value: analytics.activeJobs, icon: <Briefcase size={20} color="#4f46e5" /> },
    { label: 'Hire Rate', value: `${analytics.hireRatePercent}%`, icon: <Target size={20} color="#16a34a" /> },
    { label: 'Avg. AI Match Score', value: `${Math.round(analytics.averageMatchScore)}%`, icon: <Activity size={20} color="#d97706" /> },
  ];

  const statusData = Object.entries(analytics.applicationsByStatus).map(([name, count]) => ({ name, count }));
  const departmentData = Object.entries(analytics.jobsByDepartment).map(([name, value]) => ({ name, value }));
  const COLORS = [token.colorPrimary, '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>System Analytics</Title>
        <Text type="secondary" style={{ marginTop: '4px', display: 'block' }}>Platform overview and hiring metrics.</Text>
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
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* Applications by Status */}
        <Col xs={24} lg={16}>
          <Card title="Applications by Status" bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', height: '100%' }} bodyStyle={{ padding: '24px', height: '348px' }}>
            {statusData.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><Text type="secondary">No applications yet</Text></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={token.colorBorder} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: token.colorTextSecondary }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: token.colorTextSecondary }} allowDecimals={false} />
                  <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" fill={token.colorPrimary} radius={[4, 4, 0, 0]} name="Applications" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>

        {/* Jobs by Department */}
        <Col xs={24} lg={8}>
          <Card title="Jobs by Department" bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', height: '100%' }} bodyStyle={{ padding: '24px', height: '348px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {departmentData.length === 0 ? (
              <Text type="secondary">No jobs yet</Text>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={departmentData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ width: '100%', marginTop: '16px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
                  {departmentData.map((entry, index) => (
                    <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <Text type="secondary" strong>{entry.name}</Text>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
