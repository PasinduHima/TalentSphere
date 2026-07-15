import React, { useState } from 'react';
import { Card, Button, Input, Tag, Table, Typography, theme } from 'antd';
import { Search, Filter, MoreHorizontal, UserPlus, Shield, Key } from 'lucide-react';

const { Title, Text } = Typography;

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = theme.useToken();

  const users = [
    { id: 1, name: 'Alex Johnson', email: 'alex.j@example.com', role: 'Admin', department: 'Engineering', status: 'Active', lastLogin: '2 mins ago' },
    { id: 2, name: 'Maria Garcia', email: 'maria.g@example.com', role: 'Recruiter', department: 'HR', status: 'Active', lastLogin: '1 hour ago' },
    { id: 3, name: 'James Wilson', email: 'j.wilson@example.com', role: 'Hiring Manager', department: 'Product', status: 'Inactive', lastLogin: '3 days ago' },
    { id: 4, name: 'Sarah Jenkins', email: 'sarah.j@example.com', role: 'Candidate', department: '-', status: 'Active', lastLogin: 'Today, 10:45 AM' },
  ];

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'Admin': return 'blue';
      case 'Hiring Manager': return 'green';
      case 'Recruiter': return 'gold';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#eef2ff', color: token.colorPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>
            {record.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: token.colorText }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={getRoleBadgeColor(role)} style={{ fontWeight: 500, margin: 0 }}>
          {role}
        </Tag>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (dept) => <span style={{ color: token.colorText }}>{dept}</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'success' : 'default'} style={{ margin: 0 }}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (login) => <span style={{ color: token.colorTextSecondary, fontSize: '12px' }}>{login}</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: () => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
          <Button type="text" icon={<Key size={16} color={token.colorTextSecondary} />} />
          <Button type="text" icon={<MoreHorizontal size={16} color={token.colorTextSecondary} />} />
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>User Management</Title>
          <Text type="secondary" style={{ marginTop: '4px', display: 'block' }}>Manage system users, roles, and permissions.</Text>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button icon={<Shield size={16} />}>Roles</Button>
          <Button type="primary" icon={<UserPlus size={16} />}>Add User</Button>
        </div>
      </div>

      <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', overflow: 'hidden' }} bodyStyle={{ padding: 0 }}>
        <div style={{ padding: '16px', borderBottom: `1px solid ${token.colorBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Input 
              prefix={<Search size={16} color={token.colorTextSecondary} />} 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '320px' }}
            />
            <Button icon={<Filter size={16} />} />
          </div>
        </div>

        <Table 
          columns={columns} 
          dataSource={users} 
          rowKey="id" 
          pagination={{ 
            total: users.length, 
            showTotal: (total, range) => <span style={{ color: token.colorTextSecondary }}>Showing {range[0]} to {range[1]} of {total} users</span>,
            style: { padding: '16px 24px', margin: 0 }
          }} 
        />
      </Card>
    </div>
  );
}
