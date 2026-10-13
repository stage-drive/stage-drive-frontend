import React from 'react';
import { Alert, Card, Typography } from 'antd';

const { Title, Text } = Typography;

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => (
  <Card>
    <Title level={3} style={{ marginTop: 0 }}>
      {title}
    </Title>
    {description ? <Text type="secondary">{description}</Text> : null}
    <Alert
      type="info"
      showIcon
      title="Ця сторінка ще в розробці"
      description="Після готовності бекенду тут буде реальний контент для цього розділу."
      style={{ marginTop: 16 }}
    />
  </Card>
);
