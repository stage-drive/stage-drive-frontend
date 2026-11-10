import { Alert, Button, Card, Descriptions, Empty, Flex, Skeleton, Typography } from 'antd';
import { StudentCardHeader } from '@/modules/students/components/StudentCardHeader';
import { TRAINING_STATUS_LABELS, TRANSMISSION_LABELS } from '@/modules/students/constants';
import { useGetStudentDashboardQuery } from '@/store/api/endpoints/dashboardApi';
import { useGetMyStudentProfileQuery } from '@/store/api/endpoints/studentsApi';

const { Text, Title } = Typography;

export const MyLearningPage = () => {
  const { data: card, isLoading, isError, refetch } = useGetMyStudentProfileQuery();
  const { data: dashboard } = useGetStudentDashboardQuery();

  if (isLoading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 6 }} />
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

  const profile = card.student;
  const group = dashboard?.groups.find((item) => item.id === profile?.groupId);
  const practiceCar = profile?.car;

  return (
    <Flex vertical gap={24}>
      <Title level={3} style={{ margin: 0 }}>
        Моє навчання
      </Title>

      {!profile?.groupId ? (
        <Alert
          type="info"
          showIcon
          title="Вас ще не додано до навчальної групи."
          description="Теоретичний курс і тести закриті, доки вас не додадуть до групи з призначеним курсом."
        />
      ) : null}

      <Card>
        <Flex vertical gap={20}>
          <StudentCardHeader card={card} />
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Навчальна група">
              {group?.name ??
                (profile?.groupId ? (
                  'Групу призначено'
                ) : (
                  <Text type="secondary">Навчальну групу не призначено</Text>
                ))}
            </Descriptions.Item>
            <Descriptions.Item label="Статус навчання">
              {profile ? TRAINING_STATUS_LABELS[profile.trainingStatus] : '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Категорія">
              {profile?.category ?? '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Коробка передач">
              {profile?.transmission ? TRANSMISSION_LABELS[profile.transmission] : '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Інструктор">
              {profile?.instructorId ? (
                'Інструктора призначено'
              ) : (
                <Text type="secondary">Інструктора не призначено</Text>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Автомобіль">
              {practiceCar ? (
                `${practiceCar.plateNumber} · ${practiceCar.category} · ${TRANSMISSION_LABELS[practiceCar.transmission]}`
              ) : (
                <Text type="secondary">Автомобіль не призначено</Text>
              )}
            </Descriptions.Item>
          </Descriptions>
          <Empty description="Прогрес теорії, тести, відвідуваність і оплати з’являться після підключення цих модулів" />
        </Flex>
      </Card>
    </Flex>
  );
};
