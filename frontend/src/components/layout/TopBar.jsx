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
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      padding: '0 32px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(255,255,255,0.3)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
      height: '80px',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ flex: 1, maxWidth: '600px' }}>
        <Input 
          size="large"
          placeholder="Search jobs, companies, skills..." 
          prefix={<Search size={20} color="#64748b" style={{ marginRight: '8px' }} />}
          style={{ borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.8)' }}
        />
      </div>

      <Space size={24} align="center">
        <Badge dot offset={[-4, 4]}>
          <div style={{ cursor: 'pointer', padding: '10px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
            <Bell size={20} color="#475569" />
          </div>
        </Badge>
        
        <div style={{ width: '1px', height: '32px', backgroundColor: '#e2e8f0' }}></div>

        <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '6px 12px', borderRadius: '9999px', backgroundColor: '#fff', border: '1px solid #e2e8f0', transition: 'all 0.2s' }}>
            <Avatar 
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=random`} 
              size={36}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text style={{ fontWeight: 600, color: '#0f172a', lineHeight: 1 }}>{user?.name}</Text>
              <Text style={{ fontSize: '11px', color: '#64748b', textTransform: 'capitalize', marginTop: '4px', fontWeight: 500 }}>
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
