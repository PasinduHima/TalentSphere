import { Outlet } from 'react-router-dom';
import { Layout, theme } from 'antd';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const { Content } = Layout;

export default function AppLayout() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar />
      <Layout style={{ background: 'transparent' }}>
        <TopBar />
        <Content style={{ margin: '24px', overflow: 'initial' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
