import React from 'react';
import { Card, Statistic } from 'antd';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: string;
  precision?: number;
  suffix?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color,
  precision,
  suffix,
}) => (
  <Card variant="borderless" styles={{ body: { padding: '20px 24px' } }}>
    <Statistic
      title={title}
      value={value}
      prefix={icon}
      styles={{ content: { color } }}
      precision={precision}
      suffix={suffix}
    />
  </Card>
);
