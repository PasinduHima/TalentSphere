import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { router } from './router';
import { useAuthStore } from './store/authStore';

function App() {
  const refreshCurrentUser = useAuthStore((state) => state.refreshCurrentUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCurrentUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
