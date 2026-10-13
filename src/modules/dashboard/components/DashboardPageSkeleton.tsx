import { Card, Col, Flex, Row, Skeleton } from 'antd';

export const DashboardPageSkeleton = ({ cards = 4 }: { cards?: number }) => {
  const span = cards === 2 ? 12 : cards === 3 ? 8 : 6;

  return (
    <Flex vertical gap={24}>
      <Flex vertical gap={8}>
        <Skeleton.Input active style={{ width: 280, height: 32 }} />
        <Skeleton.Input active size="small" style={{ width: 180 }} />
      </Flex>
      <Row gutter={[16, 16]}>
        {Array.from({ length: cards }, (_, index) => (
          <Col key={index} xs={24} sm={12} lg={span}>
            <Card>
              <Skeleton active title={false} paragraph={{ rows: 1 }} />
            </Card>
          </Col>
        ))}
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card>
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
        </Col>
      </Row>
    </Flex>
  );
};
