import React from 'react';
import { Button, Flex } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';

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
  <Flex align="center" justify="flex-end" wrap gap={8}>
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
);
