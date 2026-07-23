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
          colorPrimary: '#4f46e5',
          borderRadius: 8,
          fontFamily: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
          colorBgContainer: '#ffffff',
          colorText: '#0f172a',
          colorTextSecondary: '#64748b',
          colorBorder: '#e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        },
        components: {
          Button: {
            controlHeight: 40,
            controlHeightLG: 48,
            borderRadius: 8,
            fontWeight: 500,
            primaryColor: '#ffffff',
            colorPrimaryHover: '#6366f1',
            colorPrimaryActive: '#4338ca',
            defaultColor: '#0f172a',
            defaultBorderColor: '#e2e8f0',
            defaultHoverColor: '#4f46e5',
            defaultHoverBorderColor: '#4f46e5',
            defaultActiveBorderColor: '#3730a3',
            defaultActiveColor: '#3730a3',
          },
          Input: {
            controlHeight: 40,
            controlHeightLG: 48,
            borderRadius: 8,
            colorBgContainer: '#f8fafc',
            colorBorder: '#e2e8f0',
          },
          Card: {
            borderRadiusLG: 16,
            boxShadowTertiary: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
          },
          Table: {
            headerBg: '#f8fafc',
            headerColor: '#475569',
            borderRadiusLG: 16,
            headerBorderRadius: 16,
          },
          Menu: {
            itemBorderRadius: 8,
            itemMarginInline: 12,
            activeBarWidth: 0,
          }
        }
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
