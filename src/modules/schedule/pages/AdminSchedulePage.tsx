import { Alert, Flex, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export const AdminSchedulePage = () => (
  <Flex vertical gap={16}>
    <Title level={3} style={{ margin: 0 }}>
      Розклад
    </Title>
    <Alert
      type="info"
      showIcon
      title="Повний календар автошколи ще не можна завантажити"
      description="Бекенд поки приймає лише редагування і перенесення вже створеного заняття. Списку занять, створення, скасування і перемикання день/тиждень/місяць у API немає."
    />
    <Paragraph type="secondary" style={{ margin: 0 }}>
      Викладач може редагувати і переносити свої найближчі теоретичні заняття. Інструктор — свої
      практичні. Студент бачить власні найближчі заняття.
    </Paragraph>
  </Flex>
);
