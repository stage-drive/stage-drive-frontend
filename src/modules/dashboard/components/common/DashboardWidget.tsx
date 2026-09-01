import React from 'react';
import { Card } from 'antd';

interface DashboardWidgetProps {
  title: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
  loading?: boolean;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  extra,
  children,
  loading = false,
}) => (
  <Card title={title} extra={extra} loading={loading} variant="borderless">
    {children}
  </Card>
);
