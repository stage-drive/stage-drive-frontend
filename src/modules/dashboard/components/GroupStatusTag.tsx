import { Tag } from 'antd';

const GROUP_STATUS = {
  PLANNED: { color: 'processing', label: 'Запланована' },
  ACTIVE: { color: 'success', label: 'Активна' },
  COMPLETED: { color: 'default', label: 'Завершена' },
  ARCHIVED: { color: 'default', label: 'Архів' },
} as const;

interface GroupStatusTagProps {
  status: keyof typeof GROUP_STATUS;
}

export const GroupStatusTag = ({ status }: GroupStatusTagProps) => (
  <Tag color={GROUP_STATUS[status].color}>{GROUP_STATUS[status].label}</Tag>
);
