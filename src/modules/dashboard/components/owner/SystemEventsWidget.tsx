import React from 'react';
import { Card, Flex, Typography } from 'antd';
import { CheckCircleOutlined, AlertOutlined, SolutionOutlined } from '@ant-design/icons';

const { Text } = Typography;

export interface SystemEvent {
  id: number;
  text: string;
  time: string;
  type: 'info' | 'success' | 'warning';
}

interface SystemEventsProps {
  events: SystemEvent[];
}

const getEventIcon = (type: SystemEvent['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />;
    case 'warning':
      return <AlertOutlined style={{ color: '#faad14', fontSize: 18 }} />;
    default:
      return <SolutionOutlined style={{ color: '#0052FF', fontSize: 18 }} />;
  }
};

export const SystemEventsWidget: React.FC<SystemEventsProps> = ({ events }) => (
  <Card title="Важливі системні події" variant="borderless">
    <Flex vertical gap="middle">
      {events.map((item) => (
        <Flex key={item.id} align="flex-start" gap="stretch">
          <div style={{ marginTop: 2 }}>{getEventIcon(item.type)}</div>
          <Flex vertical style={{ flex: 1 }}>
            <Text>{item.text}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {item.time}
            </Text>
          </Flex>
        </Flex>
      ))}
    </Flex>
  </Card>
);
