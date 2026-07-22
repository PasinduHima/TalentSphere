import React, { useState } from 'react';
import { Card, Typography, Table, Tag, Button, Input, Modal, Form, Select, Checkbox, theme, message, Popconfirm, Tooltip } from 'antd';
import { Shield, Plus, Search, Trash2, Edit2, Users, Eye } from 'lucide-react';

const { Title, Text } = Typography;

const PERMISSIONS_LIST = [
  { key: 'users.view', label: 'View Users', category: 'User Management' },
  { key: 'users.create', label: 'Create Users', category: 'User Management' },
  { key: 'users.edit', label: 'Edit Users', category: 'User Management' },
  { key: 'users.delete', label: 'Delete Users', category: 'User Management' },
  { key: 'jobs.view', label: 'View Jobs', category: 'Job Management' },
  { key: 'jobs.create', label: 'Create Jobs', category: 'Job Management' },
  { key: 'jobs.edit', label: 'Edit Jobs', category: 'Job Management' },
  { key: 'jobs.delete', label: 'Delete Jobs', category: 'Job Management' },
  { key: 'applications.view', label: 'View Applications', category: 'Applications' },
  { key: 'applications.review', label: 'Review Applications', category: 'Applications' },
  { key: 'applications.decide', label: 'Make Hiring Decisions', category: 'Applications' },
  { key: 'interviews.schedule', label: 'Schedule Interviews', category: 'Interviews' },
  { key: 'interviews.feedback', label: 'Submit Feedback', category: 'Interviews' },
  { key: 'analytics.view', label: 'View Analytics', category: 'Analytics' },
  { key: 'system.settings', label: 'System Settings', category: 'System' },
  { key: 'system.monitoring', label: 'System Monitoring', category: 'System' },
];

const INITIAL_ROLES = [
  {
    id: '1',
    name: 'Administrator',
    description: 'Full system access with all permissions.',
    usersCount: 2,
    type: 'System',
    permissions: PERMISSIONS_LIST.map(p => p.key),
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Recruiter',
    description: 'Manage job postings, review candidates, and schedule interviews.',
    usersCount: 8,
    type: 'System',
    permissions: ['jobs.view', 'jobs.create', 'jobs.edit', 'applications.view', 'applications.review', 'interviews.schedule', 'interviews.feedback'],
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: '3',
    name: 'Hiring Manager',
    description: 'Review shortlisted candidates and make hiring decisions.',
    usersCount: 12,
    type: 'System',
    permissions: ['applications.view', 'applications.review', 'applications.decide', 'interviews.feedback', 'jobs.view'],
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: '4',
    name: 'Candidate',
    description: 'Apply to jobs, track applications, and manage profile.',
    usersCount: 156,
    type: 'System',
    permissions: ['jobs.view', 'applications.view'],
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: '5',
    name: 'Senior Recruiter',
    description: 'Extended recruiter permissions with analytics access.',
    usersCount: 3,
    type: 'Custom',
    permissions: ['jobs.view', 'jobs.create', 'jobs.edit', 'jobs.delete', 'applications.view', 'applications.review', 'interviews.schedule', 'interviews.feedback', 'analytics.view'],
    createdAt: '2026-03-20T14:30:00Z',
  },
  {
    id: '6',
    name: 'Department Lead',
    description: 'View department analytics and oversee hiring processes.',
    usersCount: 5,
    type: 'Custom',
    permissions: ['jobs.view', 'applications.view', 'applications.review', 'applications.decide', 'analytics.view'],
    createdAt: '2026-05-12T09:15:00Z',
  },
];

export default function RolesPermissionsPage() {
  const { token } = theme.useToken();
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewRole, setViewRole] = useState(null);
  const [form] = Form.useForm();

  const filteredRoles = roles.filter(r =>
    !searchTerm || r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (values) => {
    const newRole = {
      id: String(Date.now()),
      name: values.name,
      description: values.description,
      usersCount: 0,
      type: 'Custom',
      permissions: values.permissions || [],
      createdAt: new Date().toISOString(),
    };
    setRoles([...roles, newRole]);
    message.success(`Role "${values.name}" created.`);
    setModalOpen(false);
    form.resetFields();
  };

  const handleDelete = (roleId) => {
    setRoles(roles.filter(r => r.id !== roleId));
    message.success('Role deleted.');
  };

  const handleViewPermissions = (role) => {
    setViewRole(role);
    setViewModalOpen(true);
  };

  // Group permissions by category
  const groupedPermissions = PERMISSIONS_LIST.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {});

  const columns = [
    {
      title: 'Role',
      key: 'role',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: record.type === 'System' ? '#eef2ff' : '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shield size={18} color={record.type === 'System' ? token.colorPrimary : '#d97706'} />
          </div>
          <div>
            <Text strong style={{ display: 'block', fontSize: '14px' }}>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.description}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => <Tag color={type === 'System' ? 'blue' : 'gold'} style={{ margin: 0 }}>{type}</Tag>,
    },
    {
      title: 'Users',
      dataIndex: 'usersCount',
      key: 'users',
      width: 90,
      render: (count) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600, fontSize: '13px', color: token.colorText }}>
          <Users size={14} color={token.colorTextSecondary} /> {count}
        </span>
      ),
    },
    {
      title: 'Permissions',
      key: 'permissions',
      width: 120,
      render: (_, record) => (
        <span style={{ fontWeight: 500, fontSize: '13px', color: token.colorTextSecondary }}>
          {record.permissions.length} / {PERMISSIONS_LIST.length}
        </span>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => <span style={{ color: token.colorTextSecondary, fontSize: '13px' }}>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      align: 'right',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
          <Tooltip title="View Permissions">
            <Button type="text" size="small" icon={<Eye size={16} color={token.colorTextSecondary} />} onClick={() => handleViewPermissions(record)} />
          </Tooltip>
          {record.type === 'Custom' && (
            <Popconfirm title={`Delete "${record.name}" role?`} onConfirm={() => handleDelete(record.id)} okText="Delete" okButtonProps={{ danger: true }}>
              <Button type="text" size="small" icon={<Trash2 size={16} color="#ef4444" />} />
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Roles & Permissions</Title>
          <Text type="secondary" style={{ marginTop: '4px', display: 'block' }}>Manage user roles and their associated permissions.</Text>
        </div>
        <Button type="primary" icon={<Plus size={16} />} onClick={() => setModalOpen(true)}>Create Role</Button>
      </div>

      <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', overflow: 'hidden' }} bodyStyle={{ padding: 0 }}>
        <div style={{ padding: '16px', borderBottom: `1px solid ${token.colorBorder}` }}>
          <Input
            prefix={<Search size={16} color={token.colorTextSecondary} />}
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '320px' }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filteredRoles}
          rowKey="id"
          pagination={{
            showTotal: (total, range) => <span style={{ color: token.colorTextSecondary }}>Showing {range[0]} to {range[1]} of {total} roles</span>,
            style: { padding: '16px 24px', margin: 0 },
          }}
        />
      </Card>

      {/* Create Role Modal */}
      <Modal title="Create New Role" open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} destroyOnClose width={600}>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="name" label="Role Name" rules={[{ required: true, message: 'Role name is required' }]}>
            <Input placeholder="e.g. Content Manager" />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Description is required' }]}>
            <Input.TextArea placeholder="Brief description of this role's purpose" rows={2} />
          </Form.Item>
          <Form.Item name="permissions" label="Permissions">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.entries(groupedPermissions).map(([category, perms]) => (
                <div key={category}>
                  <Text strong style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: token.colorTextSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{category}</Text>
                  <Checkbox.Group style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }} options={perms.map(p => ({ label: p.label, value: p.key }))} />
                </div>
              ))}
            </div>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button onClick={() => setModalOpen(false)} style={{ marginRight: '8px' }}>Cancel</Button>
            <Button type="primary" htmlType="submit">Create Role</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Permissions Modal */}
      <Modal title={`${viewRole?.name} — Permissions`} open={viewModalOpen} onCancel={() => setViewModalOpen(false)} footer={<Button onClick={() => setViewModalOpen(false)}>Close</Button>} width={500}>
        {viewRole && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Text type="secondary">{viewRole.description}</Text>
            {Object.entries(groupedPermissions).map(([category, perms]) => {
              const granted = perms.filter(p => viewRole.permissions.includes(p.key));
              if (granted.length === 0) return null;
              return (
                <div key={category}>
                  <Text strong style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: token.colorTextSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{category}</Text>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {granted.map(p => (
                      <Tag key={p.key} color="blue" style={{ margin: 0 }}>{p.label}</Tag>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
}
