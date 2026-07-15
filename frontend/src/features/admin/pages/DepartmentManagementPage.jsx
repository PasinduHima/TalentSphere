import React from 'react';
import { Card, Button, Typography, Row, Col, theme } from 'antd';
import { Building2, Users, MoreHorizontal, Plus } from 'lucide-react';

const { Title, Text } = Typography;

export default function DepartmentManagementPage() {
  const { token } = theme.useToken();
  const departments = [
    { id: 1, name: 'Engineering', head: 'Alex Johnson', employees: 145, openRoles: 12, budget: 'On Track' },
    { id: 2, name: 'Product', head: 'Sarah Connor', employees: 42, openRoles: 3, budget: 'At Risk' },
    { id: 3, name: 'Design', head: 'Priya Patel', employees: 28, openRoles: 5, budget: 'On Track' },
    { id: 4, name: 'Human Resources', head: 'Maria Garcia', employees: 15, openRoles: 2, budget: 'On Track' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Departments</Title>
          <Text type="secondary" style={{ marginTop: '4px', display: 'block' }}>Manage organization structure and department heads.</Text>
        </div>
        <Button type="primary" icon={<Plus size={16} />}>Add Department</Button>
      </div>

      <Row gutter={[24, 24]}>
        {departments.map(dept => (
          <Col xs={24} md={12} lg={8} key={dept.id}>
            <Card 
              bordered={false} 
              style={{ borderRadius: '12px', border: `1px solid ${token.colorBorder}`, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', transition: 'box-shadow 0.2s', cursor: 'pointer' }} 
              bodyStyle={{ padding: '24px' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0,0,0,0.05)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ backgroundColor: '#eef2ff', padding: '12px', borderRadius: '8px' }}>
                  <Building2 size={24} color={token.colorPrimary} />
                </div>
                <Button type="text" icon={<MoreHorizontal size={20} color={token.colorTextSecondary} />} />
              </div>
              
              <Title level={4} style={{ margin: '0 0 4px 0', fontWeight: 700 }}>{dept.name}</Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>Head: <Text strong>{dept.head}</Text></Text>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingTop: '16px', borderTop: `1px solid ${token.colorBorder}` }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: token.colorTextSecondary, fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                    <Users size={14} /> Employees
                  </div>
                  <Text strong style={{ fontSize: '16px' }}>{dept.employees}</Text>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: token.colorTextSecondary, fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                    Open Roles
                  </div>
                  <Text strong style={{ fontSize: '16px', color: token.colorPrimary }}>{dept.openRoles}</Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
