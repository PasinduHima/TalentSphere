import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { router } from './router';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#21408e',
          borderRadius: 6,
          fontFamily: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
          colorBgContainer: '#ffffff',
          colorText: '#1e293b',
          colorTextSecondary: '#64748b',
          colorBorder: '#e2e8f0',
        },
        components: {
          Button: {
            controlHeight: 40,
            controlHeightLG: 48,
            borderRadius: 6,
            fontWeight: 500,
          },
          Input: {
            controlHeight: 40,
            controlHeightLG: 48,
            borderRadius: 6,
          },
          Card: {
            borderRadiusLG: 12,
          },
          Table: {
            headerBg: '#f8fafc',
            headerColor: '#64748b',
            borderRadiusLG: 12,
          }
        }
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
