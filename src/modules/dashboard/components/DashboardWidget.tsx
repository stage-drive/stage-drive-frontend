import type { ReactNode } from 'react';
import { Card, theme } from 'antd';

interface DashboardWidgetProps {
  title: string;
  extra?: ReactNode;
  children: ReactNode;
  loading?: boolean;
}

export const DashboardWidget = ({
  title,
  extra,
  children,
  loading = false,
}: DashboardWidgetProps) => {
  const { token } = theme.useToken();

  return (
    <Card
      title={title}
      extra={extra}
      loading={loading}
      style={{
        flex: 1,
        width: '100%',
        boxShadow:
          token.colorBgLayout === '#f8f9fb'
            ? '0 10px 28px rgba(3, 16, 43, 0.14)'
            : '0 12px 32px rgba(0, 0, 0, 0.42)',
      }}
    >
      {children}
    </Card>
  );
};
