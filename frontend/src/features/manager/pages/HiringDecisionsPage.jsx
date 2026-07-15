import React, { useState } from 'react';
import { Card, Button, Input, Tag, Table, Tabs, Typography, theme } from 'antd';
import { CheckCircle, XCircle, Search, Filter } from 'lucide-react';

const { Title, Text } = Typography;

export default function HiringDecisionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const { token } = theme.useToken();

  const candidates = [
    { id: 1, name: 'Sarah Jenkins', role: 'Senior Frontend Engineer', status: 'Pending Decision', score: 4.8, avgScore: 4.5, reviewers: 3 },
    { id: 2, name: 'David Lee', role: 'Backend Engineer', status: 'Offer Extended', score: 4.9, avgScore: 4.8, reviewers: 4 },
    { id: 3, name: 'Emma Wilson', role: 'Product Designer', status: 'Rejected', score: 3.2, avgScore: 3.5, reviewers: 2 },
  ];

  const columns = [
    {
      title: 'Candidate',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={`https://i.pravatar.cc/150?u=${record.id}`} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
          <Text strong>{text}</Text>
        </div>
      )
    },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    {
      title: 'Avg Rating',
      dataIndex: 'avgScore',
      key: 'avgScore',
      align: 'center',
      render: (score) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <Text strong>{score}</Text>
          <Text type="secondary">/ 5</Text>
        </div>
      )
    },
    {
      title: 'Reviewers',
      dataIndex: 'reviewers',
      key: 'reviewers',
      align: 'center',
      render: (revs) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', color: token.colorText, fontWeight: 500, padding: '2px 10px', borderRadius: '9999px', fontSize: '12px' }}>
          {revs}
        </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'warning';
        if (status === 'Offer Extended') color = 'success';
        if (status === 'Rejected') color = 'error';
        return <Tag color={color} style={{ margin: 0 }}>{status}</Tag>;
      }
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        record.status === 'Pending Decision' ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
             <Button danger size="small" icon={<XCircle size={14} />}>Reject</Button>
             <Button type="primary" size="small" style={{ backgroundColor: '#16a34a' }} icon={<CheckCircle size={14} />}>Extend Offer</Button>
          </div>
        ) : (
          <Button type="text" size="small">View Details</Button>
        )
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Hiring Decisions</Title>
        <Text type="secondary">Review feedback and make final offers.</Text>
      </div>

      <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', overflow: 'hidden' }} bodyStyle={{ padding: 0 }}>
        <div style={{ padding: '16px', borderBottom: `1px solid ${token.colorBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={['All', 'Pending', 'Offers', 'Rejected'].map(tab => ({ key: tab, label: tab }))}
            style={{ marginBottom: 0 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Input 
              prefix={<Search size={16} color={token.colorTextSecondary} />} 
              placeholder="Search candidates..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '256px' }}
            />
            <Button icon={<Filter size={16} />} />
          </div>
        </div>

        <Table 
          columns={columns} 
          dataSource={candidates}
          rowKey="id"
          pagination={false}
          style={{ margin: 0 }}
        />
      </Card>
    </div>
  );
}
