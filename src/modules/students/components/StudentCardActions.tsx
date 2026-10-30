import { Button, Flex, Tooltip } from 'antd';
import {
  CarOutlined,
  DeleteOutlined,
  EditOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import type { StudentCard } from '@/store/api/endpoints/studentsApi';
import {
  canArchiveStudent,
  canAssignGroup,
  canGrantPracticeAccess,
} from '@/modules/students/utils/studentActions';

interface StudentCardActionsProps {
  card: StudentCard;
  isArchiving?: boolean;
  onEdit: () => void;
  onAssignGroup: () => void;
  onPracticeAccess: () => void;
  onArchive: () => void;
}

export const StudentCardActions = ({
  card,
  isArchiving,
  onEdit,
  onAssignGroup,
  onPracticeAccess,
  onArchive,
}: StudentCardActionsProps) => {
  const assignGroup = canAssignGroup(card);
  const practiceAccess = canGrantPracticeAccess(card);
  const archive = canArchiveStudent(card);

  return (
    <Flex gap={8} wrap>
      <Button icon={<EditOutlined />} onClick={onEdit}>
        Редагувати
      </Button>
      <Tooltip title={assignGroup.enabled ? undefined : assignGroup.reason}>
        <span>
          <Button
            icon={<TeamOutlined />}
            disabled={!assignGroup.enabled}
            onClick={onAssignGroup}
          >
            Призначити групу
          </Button>
        </span>
      </Tooltip>
      <Tooltip title={practiceAccess.enabled ? undefined : practiceAccess.reason}>
        <span>
          <Button
            icon={<CarOutlined />}
            disabled={!practiceAccess.enabled}
            onClick={onPracticeAccess}
          >
            Відкрити доступ до практики
          </Button>
        </span>
      </Tooltip>
      <Tooltip title={archive.enabled ? undefined : archive.reason}>
        <span>
          <Button
            danger
            icon={<DeleteOutlined />}
            disabled={!archive.enabled}
            loading={isArchiving}
            onClick={onArchive}
          >
            Архівувати
          </Button>
        </span>
      </Tooltip>
    </Flex>
  );
};
