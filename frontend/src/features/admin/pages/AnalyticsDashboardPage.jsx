import React from 'react';
import { Card, Button, Typography, Row, Col, theme } from 'antd';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Users, Briefcase, Activity, Target, Download, TrendingUp } from 'lucide-react';

const { Title, Text } = Typography;

export default function AnalyticsDashboardPage() {
  const { token } = theme.useToken();
  const metrics = [
    { label: 'Total Active Users', value: '1,248', change: '+12%', isPositive: true, icon: <Users size={20} color={token.colorPrimary} /> },
    { label: 'Active Jobs', value: '45', change: '+5%', isPositive: true, icon: <Briefcase size={20} color="#4f46e5" /> },
    { label: 'Time to Hire (Days)', value: '18', change: '-2.4', isPositive: true, icon: <Target size={20} color="#16a34a" /> },
    { label: 'AI Accuracy Rate', value: '94%', change: '+1.2%', isPositive: true, icon: <Activity size={20} color="#d97706" /> },
  ];

  const hiringData = [
    { name: 'Jan', hires: 40, applications: 240 },
    { name: 'Feb', hires: 30, applications: 139 },
    { name: 'Mar', hires: 20, applications: 980 },
    { name: 'Apr', hires: 27, applications: 390 },
    { name: 'May', hires: 18, applications: 480 },
    { name: 'Jun', hires: 23, applications: 380 },
  ];

  const sourceData = [
    { name: 'LinkedIn', value: 400 },
    { name: 'Direct', value: 300 },
    { name: 'Referral', value: 300 },
    { name: 'Other', value: 200 },
  ];
  const COLORS = [token.colorPrimary, '#6366f1', '#10b981', '#f59e0b'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>System Analytics</Title>
          <Text type="secondary" style={{ marginTop: '4px', display: 'block' }}>Platform overview and hiring metrics.</Text>
        </div>
        <Button icon={<Download size={16} />}>Export Report</Button>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        {metrics.map((metric, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '8px', borderRadius: '8px', border: `1px solid ${token.colorBorder}`, display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                  {metric.icon}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: 500, color: metric.isPositive ? '#16a34a' : '#dc2626' }}>
                  {metric.isPositive ? <TrendingUp size={16} style={{ marginRight: '4px' }} /> : null}
                  {metric.change}
                </div>
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
        {/* Main Chart */}
        <Col xs={24} lg={16}>
          <Card title="Applications vs. Hires (YTD)" bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', height: '100%' }} bodyStyle={{ padding: '24px', height: '348px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hiringData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={token.colorBorder} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: token.colorTextSecondary }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: token.colorTextSecondary }} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="applications" fill="#e0e7ff" radius={[4, 4, 0, 0]} name="Applications" />
                <Bar dataKey="hires" fill={token.colorPrimary} radius={[4, 4, 0, 0]} name="Hires" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Pie Chart */}
        <Col xs={24} lg={8}>
          <Card title="Candidate Sources" bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', height: '100%' }} bodyStyle={{ padding: '24px', height: '348px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ width: '100%', marginTop: '16px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
              {sourceData.map((entry, index) => (
                <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: COLORS[index] }}></div>
                  <Text type="secondary" strong>{entry.name}</Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
