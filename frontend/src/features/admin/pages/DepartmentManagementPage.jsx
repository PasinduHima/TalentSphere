import React, { useEffect, useState } from 'react';
import { Card, Button, Typography, Row, Col, theme, Modal, Form, Input, Select, message, Popconfirm, Spin, Empty } from 'antd';
import { Building2, Users, Briefcase, Plus, Trash2 } from 'lucide-react';
import { adminApi } from '../../../lib/api/admin';
import { getApiErrorMessage } from '../../../lib/apiClient';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function DepartmentManagementPage() {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [orgForm] = Form.useForm();

  const [departments, setDepartments] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [orgModalOpen, setOrgModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([adminApi.getDepartments(), adminApi.getOrganizations()])
      .then(([depts, orgs]) => { setDepartments(depts); setOrganizations(orgs); })
      .catch((err) => message.error(getApiErrorMessage(err, 'Failed to load departments.')))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreateOrg = async (values) => {
    setSaving(true);
    try {
      await adminApi.createOrganization(values);
      message.success('Organization created.');
      setOrgModalOpen(false);
      orgForm.resetFields();
      load();
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to create organization.'));
    } finally {
      setSaving(false);
    }
  };

  const handleCreateDepartment = async (values) => {
    setSaving(true);
    try {
      await adminApi.createDepartment(values);
      message.success('Department created.');
      setModalOpen(false);
      form.resetFields();
      load();
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to create department.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminApi.deleteDepartment(id);
      message.success('Department deleted.');
      load();
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to delete department.'));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Departments</Title>
          <Text type="secondary" style={{ marginTop: '4px', display: 'block' }}>Manage organization structure and departments.</Text>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button onClick={() => setOrgModalOpen(true)}>New Organization</Button>
          <Button type="primary" icon={<Plus size={16} />} onClick={() => setModalOpen(true)} disabled={organizations.length === 0}>Add Department</Button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px 0' }}><Spin size="large" /></div>
      ) : departments.length === 0 ? (
        <Empty description={organizations.length === 0 ? 'Create an organization first, then add departments.' : 'No departments yet'} style={{ padding: '48px 0' }} />
      ) : (
        <Row gutter={[24, 24]}>
          {departments.map(dept => (
            <Col xs={24} md={12} lg={8} key={dept.id}>
              <Card
                bordered={false}
                style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}
                bodyStyle={{ padding: '24px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ backgroundColor: '#eef2ff', padding: '12px', borderRadius: '8px' }}>
                    <Building2 size={24} color={token.colorPrimary} />
                  </div>
                  <Popconfirm title="Delete this department?" onConfirm={() => handleDelete(dept.id)} okText="Delete" okButtonProps={{ danger: true }}>
                    <Button type="text" icon={<Trash2 size={16} color="#ef4444" />} />
                  </Popconfirm>
                </div>

                <Title level={4} style={{ margin: '0 0 4px 0', fontWeight: 700 }}>{dept.name}</Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>{dept.organizationName}</Text>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingTop: '16px', borderTop: `1px solid ${token.colorBorder}` }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: token.colorTextSecondary, fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                      <Users size={14} /> Users
                    </div>
                    <Text strong style={{ fontSize: '16px' }}>{dept.userCount}</Text>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: token.colorTextSecondary, fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                      <Briefcase size={14} /> Open Roles
                    </div>
                    <Text strong style={{ fontSize: '16px', color: token.colorPrimary }}>{dept.jobCount}</Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal title="Add Department" open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleCreateDepartment}>
          <Form.Item name="name" label="Department Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Engineering" />
          </Form.Item>
          <Form.Item name="organizationId" label="Organization" rules={[{ required: true }]} initialValue={organizations[0]?.id}>
            <Select options={organizations.map((o) => ({ value: o.id, label: o.name }))} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea autoSize={{ minRows: 3 }} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button onClick={() => setModalOpen(false)} style={{ marginRight: '8px' }}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={saving}>Create</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="New Organization" open={orgModalOpen} onCancel={() => setOrgModalOpen(false)} footer={null} destroyOnClose>
        <Form form={orgForm} layout="vertical" onFinish={handleCreateOrg}>
          <Form.Item name="name" label="Organization Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. TalentSphere Inc." />
          </Form.Item>
          <Form.Item name="industry" label="Industry">
            <Input />
          </Form.Item>
          <Form.Item name="website" label="Website">
            <Input />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button onClick={() => setOrgModalOpen(false)} style={{ marginRight: '8px' }}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={saving}>Create</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
