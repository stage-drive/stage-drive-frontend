import { Alert, Button, Card, Empty, Flex, Skeleton, Typography } from 'antd';
import { useGetMyStudentProfileQuery } from '@/store/api/endpoints/studentsApi';

const { Title } = Typography;

type StudySection = 'theory' | 'tests' | 'practice';

const SECTION_TITLES: Record<StudySection, string> = {
  theory: 'Теоретичний курс',
  tests: 'Тести',
  practice: 'Практичні заняття',
};

interface StudentStudySectionPageProps {
  section: StudySection;
}

export const StudentStudySectionPage = ({ section }: StudentStudySectionPageProps) => {
  const { data: card, isLoading, isError, refetch } = useGetMyStudentProfileQuery();
  const profile = card?.student;
  const blocked =
    section === 'practice' ? !profile?.instructorId : !profile?.groupId;

  if (isLoading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 3 }} />
      </Card>
    );
  }

  if (isError || !card) {
    return (
      <Alert
        type="error"
        showIcon
        title="Не вдалося завантажити дані навчання"
        action={
          <Button type="link" size="small" onClick={() => void refetch()}>
            Спробувати ще
          </Button>
        }
      />
    );
  }

  return (
    <Flex vertical gap={16}>
      <Title level={3} style={{ margin: 0 }}>
        {SECTION_TITLES[section]}
      </Title>
      {blocked ? (
        <Alert
          type="info"
          showIcon
          title={
            section === 'practice'
              ? 'Допуск до практики ще не відкрито.'
              : 'Вас ще не додано до навчальної групи.'
          }
          description={
            section === 'practice'
              ? 'Розділ відкриється після того, як адміністратор призначить інструктора та автомобіль.'
              : 'Теоретичний курс і тести закриті, доки вас не додадуть до групи з призначеним курсом.'
          }
        />
      ) : (
        <Card>
          <Empty
            description={
              section === 'practice'
                ? 'Історія практичних занять з’явиться після підключення модуля практики'
                : 'Матеріали з’являться після підключення цього модуля'
            }
          />
        </Card>
      )}
    </Flex>
  );
};
