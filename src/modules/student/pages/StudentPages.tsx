import React from 'react';
import { Alert, Card, Typography } from 'antd';

const { Title, Text } = Typography;

interface StudentPageProps {
  title: string;
  description?: string;
}

export const StudentPageStub: React.FC<StudentPageProps> = ({ title, description }) => (
  <Card>
    <Title level={3} style={{ marginTop: 0 }}>
      {title}
    </Title>
    {description ? <Text type="secondary">{description}</Text> : null}
    <Alert
      type="info"
      showIcon
      message="Ця сторінка ще в розробці"
      description="Після готовності бекенду тут буде реальний контент для цього розділу."
      style={{ marginTop: 16 }}
    />
  </Card>
);
