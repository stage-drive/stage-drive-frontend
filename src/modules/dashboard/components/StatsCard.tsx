import type { ReactNode } from 'react';
import { Card, Flex, Statistic, theme } from 'antd';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  color?: string;
  precision?: number;
  suffix?: string;
}

export const StatsCard = ({ title, value, icon, color, precision, suffix }: StatsCardProps) => {
  const { token } = theme.useToken();
  const accent = color ?? token.colorPrimary;

  return (
    <Card
      style={{
        flex: 1,
        boxShadow:
          token.colorBgLayout === '#f8f9fb'
            ? '0 10px 28px rgba(3, 16, 43, 0.14)'
            : '0 12px 32px rgba(0, 0, 0, 0.42)',
      }}
      styles={{ body: { padding: 20 } }}
    >
      <Flex align="center" gap={16}>
        {icon ? (
          <Flex
            align="center"
            justify="center"
            style={{
              width: 48,
              height: 48,
              borderRadius: token.borderRadiusLG,
              background: accent,
              color: token.colorWhite,
              fontSize: 22,
              flex: 'none',
            }}
          >
            {icon}
          </Flex>
        ) : null}
        <Statistic title={title} value={value} precision={precision} suffix={suffix} />
      </Flex>
    </Card>
  );
};
