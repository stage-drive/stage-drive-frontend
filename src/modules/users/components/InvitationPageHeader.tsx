import React from 'react';
import { Button, Flex, Typography } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface InvitationPageHeaderProps {
  isFetching: boolean;
  onRefresh: () => void;
  onAddInvitation: () => void;
}

export const InvitationPageHeader: React.FC<InvitationPageHeaderProps> = ({
  isFetching,
  onRefresh,
  onAddInvitation,
}) => (
  <Flex align="center" justify="space-between" wrap gap={16}>
    <div>
      <Title level={2} style={{ margin: 0 }}>
        Користувачі
      </Title>
      <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
        Учасники та запрошення вашої автошколи
      </Paragraph>
    </div>
    <Flex gap={8}>
      <Button
        aria-label="Оновити список"
        icon={<ReloadOutlined />}
        onClick={onRefresh}
        loading={isFetching}
      />
      <Button type="primary" icon={<PlusOutlined />} onClick={onAddInvitation}>
        Додати учасника
      </Button>
    </Flex>
  </Flex>
);
