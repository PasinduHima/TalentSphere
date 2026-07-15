import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Typography, theme } from 'antd';
import { useAuthStore } from '../../store/authStore';
import { SIDEBAR_NAV } from '../../lib/constants';
import * as Icons from 'lucide-react';

const { Sider } = Layout;
const { Text } = Typography;

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const navItems = user ? SIDEBAR_NAV[user.role] : [];

  const items = navItems.map((item) => {
    const IconComponent = Icons[item.icon] || Icons.Circle;
    return {
      key: item.path,
      icon: <IconComponent size={18} />,
      label: item.label,
    };
  });

  return (
    <Sider
      width={280}
      theme="light"
      style={{
        borderRight: '1px solid #e2e8f0',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/Logo.svg" alt="TalentSphere AI" style={{ width: '150px', height: 'auto', objectFit: 'contain' }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            onClick={({ key }) => navigate(key)}
            items={items}
            style={{ borderRight: 0, padding: '0 12px' }}
          />
        </div>

        <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0' }}>
          <Menu
            mode="inline"
            selectable={false}
            style={{ borderRight: 0 }}
            items={[
              {
                key: 'settings',
                icon: <Icons.Settings size={18} />,
                label: 'Settings',
              },
              {
                key: 'logout',
                icon: <Icons.LogOut size={18} />,
                label: 'Logout',
                onClick: logout,
              },
            ]}
          />
        </div>
      </div>
    </Sider>
  );
}
