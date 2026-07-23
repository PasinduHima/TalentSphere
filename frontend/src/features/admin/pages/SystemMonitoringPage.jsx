import React, { useEffect, useState } from 'react';
import { Card, Button, Tag, Table, Typography, Row, Col, theme, message } from 'antd';
import { Activity, Server, Database, RefreshCw } from 'lucide-react';
import { adminApi } from '../../../lib/api/admin';
import { getApiErrorMessage } from '../../../lib/apiClient';

const { Title, Text } = Typography;

export default function SystemMonitoringPage() {
  const { token } = theme.useToken();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditTotal, setAuditTotal] = useState(0);
  const [userTotal, setUserTotal] = useState(0);

  const load = () => {
    setLoading(true);
    Promise.all([
      adminApi.getSystemHealth(),
      adminApi.getAuditLogs({ page: 1, pageSize: 10 }),
      adminApi.getUsers({ page: 1, pageSize: 1 }),
    ])
      .then(([health, logs, users]) => {
        setServices(health);
        setAuditLogs(logs.items);
        setAuditTotal(logs.totalCount);
        setUserTotal(users.totalCount);
      })
      .catch((err) => message.error(getApiErrorMessage(err, 'Failed to load system status.')))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const allOperational = services.every((s) => s.status === 'Operational');

  const serviceColumns = [
    { title: 'Service Name', dataIndex: 'serviceName', key: 'serviceName', render: (text) => <Text strong>{text}</Text> },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'Operational' ? 'success' : status === 'Degraded' ? 'warning' : 'error'} style={{ margin: 0 }}>{status}</Tag>
    },
    { title: 'Details', dataIndex: 'details', key: 'details', render: (text) => <Text type="secondary">{text || '-'}</Text> },
    { title: 'Checked At', dataIndex: 'checkedAt', key: 'checkedAt', render: (date) => new Date(date).toLocaleTimeString() },
  ];

  const auditColumns = [
    { title: 'Action', dataIndex: 'action', key: 'action', render: (text) => <Tag style={{ margin: 0 }}>{text}</Tag> },
    { title: 'Entity', dataIndex: 'entityName', key: 'entityName' },
    { title: 'User', dataIndex: 'userEmail', key: 'userEmail', render: (email) => email || <Text type="secondary">system</Text> },
    { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp', render: (date) => new Date(date).toLocaleString() },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={24} color={token.colorPrimary} />
            System Monitoring
          </Title>
          <Text type="secondary" style={{ marginTop: '4px', display: 'block' }}>Real-time health and activity on the TalentSphere platform.</Text>
        </div>
        <Button icon={<RefreshCw size={16} />} onClick={load} loading={loading}>Refresh</Button>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ backgroundColor: token.colorPrimary, color: '#fff', borderRadius: '12px', height: '100%' }} bodyStyle={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#e0e7ff' }}>
              <Server size={20} />
              <Text strong style={{ color: '#e0e7ff' }}>Global Status</Text>
            </div>
            <Title level={2} style={{ margin: '0 0 8px 0', color: '#fff' }}>{allOperational ? 'Operational' : 'Degraded'}</Title>
            <Text style={{ color: '#c7d2fe', fontSize: '14px' }}>{services.length} services monitored.</Text>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', height: '100%' }} bodyStyle={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: token.colorTextSecondary }}>
              <Database size={20} color="#6366f1" />
              <Text strong type="secondary">Audit Events Logged</Text>
            </div>
            <Title level={2} style={{ margin: '0 0 8px 0' }}>{auditTotal}</Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>Actions tracked across the platform</Text>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', height: '100%' }} bodyStyle={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: token.colorTextSecondary }}>
              <Activity size={20} color="#10b981" />
              <Text strong type="secondary">Registered Users</Text>
            </div>
            <Title level={2} style={{ margin: '0 0 8px 0' }}>{userTotal}</Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>Across all roles</Text>
          </Card>
        </Col>
      </Row>

      <Card title="Service Health" bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', overflow: 'hidden' }} bodyStyle={{ padding: 0 }}>
        <Table columns={serviceColumns} dataSource={services} pagination={false} rowKey="serviceName" loading={loading} style={{ margin: 0 }} />
      </Card>

      <Card title="Recent Audit Activity" bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', overflow: 'hidden' }} bodyStyle={{ padding: 0 }}>
        <Table columns={auditColumns} dataSource={auditLogs} pagination={false} rowKey="id" loading={loading} style={{ margin: 0 }} locale={{ emptyText: 'No activity logged yet' }} />
      </Card>
    </div>
  );
}
