import React from 'react';
import { Card, Button, Tag, Table, Progress, Typography, Row, Col, theme } from 'antd';
import { Activity, Server, Database, Shield, RefreshCw } from 'lucide-react';

const { Title, Text } = Typography;

export default function SystemMonitoringPage() {
  const { token } = theme.useToken();
  const services = [
    { name: 'Core API Server', status: 'Healthy', uptime: '99.99%', latency: '45ms', load: 32 },
    { name: 'AI Prediction Engine', status: 'Healthy', uptime: '99.95%', latency: '120ms', load: 65 },
    { name: 'Database Cluster', status: 'Healthy', uptime: '100%', latency: '12ms', load: 45 },
    { name: 'Email Notification Service', status: 'Warning', uptime: '98.5%', latency: '250ms', load: 89 },
  ];

  const columns = [
    { title: 'Service Name', dataIndex: 'name', key: 'name', render: (text) => <Text strong>{text}</Text> },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Healthy' ? 'success' : 'warning'} style={{ margin: 0 }}>
          {status}
        </Tag>
      )
    },
    { title: 'Uptime', dataIndex: 'uptime', key: 'uptime', render: (text) => <Text strong>{text}</Text> },
    { title: 'Latency', dataIndex: 'latency', key: 'latency' },
    { 
      title: 'CPU Load', 
      dataIndex: 'load', 
      key: 'load',
      render: (load) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '100px' }}>
          <Progress percent={load} showInfo={false} size="small" status={load > 80 ? "exception" : "active"} strokeColor={load > 80 ? undefined : token.colorPrimary} />
          <span style={{ fontSize: '12px' }}>{load}%</span>
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: () => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button type="text" size="small">Logs</Button>
          <Button type="text" size="small">Restart</Button>
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={24} color={token.colorPrimary} />
            System Monitoring
          </Title>
          <Text type="secondary" style={{ marginTop: '4px', display: 'block' }}>Real-time health and performance of the TalentSphere platform.</Text>
        </div>
        <Button icon={<RefreshCw size={16} />}>Refresh Stats</Button>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ backgroundColor: token.colorPrimary, color: '#fff', borderRadius: '12px', height: '100%' }} bodyStyle={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#e0e7ff' }}>
              <Server size={20} />
              <Text strong style={{ color: '#e0e7ff' }}>Global Status</Text>
            </div>
            <Title level={2} style={{ margin: '0 0 8px 0', color: '#fff' }}>Operational</Title>
            <Text style={{ color: '#c7d2fe', fontSize: '14px' }}>All primary systems are functioning normally.</Text>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', height: '100%' }} bodyStyle={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: token.colorTextSecondary }}>
              <Database size={20} color="#6366f1" />
              <Text strong type="secondary">Total Data Processed</Text>
            </div>
            <Title level={2} style={{ margin: '0 0 8px 0' }}>45.2 TB</Title>
            <Text strong style={{ color: '#16a34a', fontSize: '14px' }}>+2.4 TB this week</Text>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', height: '100%' }} bodyStyle={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: token.colorTextSecondary }}>
              <Shield size={20} color="#10b981" />
              <Text strong type="secondary">Security Alerts</Text>
            </div>
            <Title level={2} style={{ margin: '0 0 8px 0' }}>0</Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>No active security threats detected.</Text>
          </Card>
        </Col>
      </Row>

      <Card title="Microservices Health" bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', overflow: 'hidden' }} bodyStyle={{ padding: 0 }}>
        <Table columns={columns} dataSource={services} pagination={false} rowKey="name" style={{ margin: 0 }} />
      </Card>
    </div>
  );
}
