import { Layout, Input, Badge, Dropdown, Avatar, Space, Typography } from 'antd';
import { useAuthStore } from '../../store/authStore';
import { Bell, Search, ChevronDown } from 'lucide-react';

const { Header } = Layout;
const { Text } = Typography;

export default function TopBar() {
  const { user } = useAuthStore();

  const userMenuItems = [
    { key: '1', label: 'Profile' },
    { key: '2', label: 'Settings' }
  ];

  return (
    <Header style={{ 
      background: '#fff', 
      padding: '0 32px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      borderBottom: '1px solid #e2e8f0',
      height: '80px',
      zIndex: 10
    }}>
      <div style={{ flex: 1, maxWidth: '600px' }}>
        <Input 
          size="large"
          placeholder="Search jobs, companies, skills..." 
          prefix={<Search size={20} color="#64748b" style={{ marginRight: '8px' }} />}
          style={{ borderRadius: '8px' }}
        />
      </div>

      <Space size={24} align="center">
        <Badge dot offset={[-4, 4]}>
          <div style={{ cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={24} color="#64748b" />
          </div>
        </Badge>
        
        <div style={{ width: '1px', height: '32px', backgroundColor: '#e2e8f0' }}></div>

        <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}>
            <Avatar 
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`} 
              size={40}
              style={{ border: '1px solid #e2e8f0' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text style={{ fontWeight: 600, color: '#0f172a', lineHeight: 1 }}>{user?.name}</Text>
              <Text style={{ fontSize: '12px', color: '#64748b', textTransform: 'capitalize', marginTop: '4px' }}>
                {user?.role?.replace('_', ' ')}
              </Text>
            </div>
            <ChevronDown size={16} color="#64748b" style={{ marginLeft: '4px' }} />
          </div>
        </Dropdown>
      </Space>
    </Header>
  );
}
