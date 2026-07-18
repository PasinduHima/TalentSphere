import React, { useEffect, useState } from 'react';
import { Card, Button, Input, Tag, Table, Typography, theme, Modal, Form, Select, message, Popconfirm } from 'antd';
import { Search, UserPlus, Trash2 } from 'lucide-react';
import { adminApi } from '../../../lib/api/admin';
import { getApiErrorMessage } from '../../../lib/apiClient';

const { Title, Text } = Typography;

const ROLE_OPTIONS = [
  { value: 'Candidate', label: 'Candidate' },
  { value: 'Recruiter', label: 'Recruiter' },
  { value: 'HiringManager', label: 'Hiring Manager' },
  { value: 'Admin', label: 'Admin' },
];

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [page, setPage] = useState(1);

  const loadUsers = async (pageNumber = page) => {
    setLoading(true);
    try {
      const result = await adminApi.getUsers({ page: pageNumber, pageSize: 10 });
      setUsers(result.items);
      setTotalCount(result.totalCount);
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to load users.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(1);
    adminApi.getDepartments().then(setDepartments).catch(() => {});
  }, []);

  const handleCreate = async (values) => {
    setCreating(true);
    try {
      await adminApi.createUser(values);
      message.success('User created.');
      setModalOpen(false);
      form.resetFields();
      loadUsers(1);
      setPage(1);
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to create user.'));
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await adminApi.deleteUser(userId);
      message.success('User deleted.');
      loadUsers(page);
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to delete user.'));
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin': return 'blue';
      case 'HiringManager': return 'green';
      case 'Recruiter': return 'gold';
      default: return 'default';
    }
  };

  const filteredUsers = users.filter((u) =>
    !searchTerm || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#eef2ff', color: token.colorPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>
            {record.firstName[0]}{record.lastName[0]}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: token.colorText }}>{record.firstName} {record.lastName}</div>
            <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Tag color={getRoleBadgeColor(role)} style={{ fontWeight: 500, margin: 0 }}>{ROLE_OPTIONS.find(r => r.value === role)?.label || role}</Tag>,
    },
    {
      title: 'Department',
      dataIndex: 'departmentName',
      key: 'department',
      render: (dept) => <span style={{ color: token.colorText }}>{dept || '-'}</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'Active' ? 'success' : 'default'} style={{ margin: 0 }}>{status}</Tag>
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLoginAt',
      key: 'lastLoginAt',
      render: (login) => <span style={{ color: token.colorTextSecondary, fontSize: '12px' }}>{login ? new Date(login).toLocaleString() : 'Never'}</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Popconfirm title="Delete this user?" onConfirm={() => handleDelete(record.id)} okText="Delete" okButtonProps={{ danger: true }}>
          <Button type="text" icon={<Trash2 size={16} color="#ef4444" />} />
        </Popconfirm>
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
        <Button type="primary" icon={<UserPlus size={16} />} onClick={() => setModalOpen(true)}>Add User</Button>
      </div>

      <Card bordered={false} style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', overflow: 'hidden' }} bodyStyle={{ padding: 0 }}>
        <div style={{ padding: '16px', borderBottom: `1px solid ${token.colorBorder}` }}>
          <Input
            prefix={<Search size={16} color={token.colorTextSecondary} />}
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '320px' }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{
            total: totalCount,
            current: page,
            pageSize: 10,
            onChange: (p) => { setPage(p); loadUsers(p); },
            showTotal: (total, range) => <span style={{ color: token.colorTextSecondary }}>Showing {range[0]} to {range[1]} of {total} users</span>,
            style: { padding: '16px 24px', margin: 0 }
          }}
        />
      </Card>

      <Modal title="Add User" open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Temporary Password" rules={[{ required: true, min: 8, message: 'At least 8 characters' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select options={ROLE_OPTIONS} />
          </Form.Item>
          <Form.Item name="departmentId" label="Department">
            <Select allowClear options={departments.map((d) => ({ value: d.id, label: d.name }))} placeholder="No department" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button onClick={() => setModalOpen(false)} style={{ marginRight: '8px' }}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={creating}>Create User</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
