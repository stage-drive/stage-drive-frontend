import type { ReactNode } from 'react';
import { Avatar, Empty, Flex, Typography, theme } from 'antd';

const { Text } = Typography;

interface DashboardRecordProps {
  icon: ReactNode;
  iconColor: string;
  title: string;
  description?: string;
  extra?: ReactNode;
  divided?: boolean;
}

export const DashboardRecord = ({
  icon,
  iconColor,
  title,
  description,
  extra,
  divided = false,
}: DashboardRecordProps) => {
  const { token } = theme.useToken();

  return (
    <Flex
      align="center"
      gap={12}
      style={{
        padding: '12px 0',
        borderBottom: divided ? `1px solid ${token.colorSplit}` : undefined,
      }}
    >
      <Avatar icon={icon} style={{ backgroundColor: iconColor, flex: 'none' }} />
      <Flex vertical gap={2} style={{ flex: 1, minWidth: 0 }}>
        <Text strong>{title}</Text>
        {description ? <Text type="secondary">{description}</Text> : null}
      </Flex>
      {extra}
    </Flex>
  );
};

interface DashboardRecordListProps<T> {
  items: T[];
  emptyText: string;
  rowKey: (item: T) => string;
  renderItem: (item: T, divided: boolean) => ReactNode;
}

export const DashboardRecordList = <T,>({
  items,
  emptyText,
  rowKey,
  renderItem,
}: DashboardRecordListProps<T>) => {
  if (items.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={emptyText} />;
  }

  return (
    <Flex vertical>
      {items.map((item, index) => (
        <div key={rowKey(item)}>{renderItem(item, index < items.length - 1)}</div>
      ))}
    </Flex>
  );
};
