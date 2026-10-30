import { Avatar, Flex, Space, Tag, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { formatUkrainianPhone } from '@/shared/utils/ukrainianPhone';
import { resolveMediaUrl } from '@/shared/utils/resolveMediaUrl';
import type { StudentCard } from '@/store/api/endpoints/studentsApi';
import {
  ACCOUNT_STATUS_COLORS,
  ACCOUNT_STATUS_LABELS,
  TRAINING_STATUS_COLORS,
  TRAINING_STATUS_LABELS,
  TRANSMISSION_LABELS,
} from '@/modules/students/constants';

const { Title, Text } = Typography;

interface StudentCardHeaderProps {
  card: StudentCard;
}

export const StudentCardHeader = ({ card }: StudentCardHeaderProps) => {
  const trainingStatus = card.student?.trainingStatus;
  const category = card.student?.category;
  const transmission = card.student?.transmission;

  return (
    <Flex align="flex-start" gap={16} wrap>
      <Avatar size={72} src={resolveMediaUrl(card.avatarUrl)} icon={<UserOutlined />} />
      <Flex vertical gap={8} style={{ minWidth: 0, flex: 1 }}>
        <Title level={3} style={{ margin: 0 }}>
          {card.lastName} {card.firstName}
        </Title>
        <Space size={[8, 8]} wrap>
          <Text type="secondary">{card.email}</Text>
          {card.phone ? <Text type="secondary">{formatUkrainianPhone(card.phone)}</Text> : null}
        </Space>
        <Space size={[8, 8]} wrap>
          <Tag color={ACCOUNT_STATUS_COLORS[card.status]}>
            Акаунт: {ACCOUNT_STATUS_LABELS[card.status]}
          </Tag>
          {trainingStatus ? (
            <Tag color={TRAINING_STATUS_COLORS[trainingStatus]}>
              Навчання: {TRAINING_STATUS_LABELS[trainingStatus]}
            </Tag>
          ) : (
            <Tag>Навчання: —</Tag>
          )}
          <Tag>
            {category ?? '—'} / {transmission ? TRANSMISSION_LABELS[transmission] : '—'}
          </Tag>
        </Space>
      </Flex>
    </Flex>
  );
};
