import { Flex, Progress, Typography } from 'antd';

const { Text } = Typography;

interface MetricListItem {
  label: string;
  value: number;
  color?: string;
}

interface MetricListProps {
  items: MetricListItem[];
  total?: number;
}

export const MetricList = ({ items, total }: MetricListProps) => (
  <Flex vertical gap={16}>
    {items.map((item) => (
      <Flex key={item.label} vertical gap={6}>
        <Flex justify="space-between" align="center" gap={12}>
          <Text>{item.label}</Text>
          <Text strong>{item.value}</Text>
        </Flex>
        <Progress
          percent={total && total > 0 ? Math.round((item.value / total) * 100) : 0}
          showInfo={false}
          strokeColor={item.color}
          size="small"
        />
      </Flex>
    ))}
  </Flex>
);
