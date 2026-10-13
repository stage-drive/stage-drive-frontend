import type { CSSProperties, FC, ReactNode } from 'react';
import { Col, Flex, Image, Row, Typography, theme } from 'antd';

const { Title, Paragraph } = Typography;

interface AuthSplitLayoutProps {
  imageSrc: string;
  heroTitle: ReactNode;
  heroDescription: string;
  heroTitleStyle?: CSSProperties;
  heroDescriptionStyle?: CSSProperties;
  contentMaxWidth?: number;
  contentPadding?: CSSProperties['padding'];
  children: ReactNode;
}

const titleStyle: CSSProperties = {
  margin: '0 0 16px',
  color: '#fff',
  fontSize: 40,
  lineHeight: 1.15,
};

const descriptionStyle: CSSProperties = {
  maxWidth: 400,
  margin: 0,
  color: '#fff',
  fontSize: 16,
  lineHeight: 1.5,
};

export const AuthSplitLayout: FC<AuthSplitLayoutProps> = ({
  imageSrc,
  heroTitle,
  heroDescription,
  heroTitleStyle,
  heroDescriptionStyle,
  contentMaxWidth = 380,
  contentPadding = '28px clamp(20px, 4vw, 48px)',
  children,
}) => {
  const { token } = theme.useToken();

  return (
    <Flex
      align="center"
      justify="center"
      style={{
        width: '100%',
        height: '100vh',
        boxSizing: 'border-box',
        overflow: 'hidden',
        background: token.colorBgLayout,
      }}
    >
    <Row
      align="stretch"
      style={{
        width: '100%',
        maxWidth: 1200,
        height: 'min(calc(100vh - 48px), 760px)',
        overflow: 'hidden',
        borderRadius: 16,
        background: token.colorBgContainer,
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Col xs={0} md={12} style={{ position: 'relative', overflow: 'hidden' }}>
        <Image
          src={imageSrc}
          alt="Автошкола"
          preview={false}
          styles={{ root: { position: 'absolute', inset: 0, width: '100%', height: '100%' } }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.75) 100%)',
          }}
        />
        <Flex
          vertical
          justify="space-between"
          style={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            boxSizing: 'border-box',
            padding: 40,
          }}
        >
          <Image
            src="/images/logofull.png"
            alt="Advance"
            preview={false}
            width={140}
            style={{ height: 'auto' }}
          />
          <Flex vertical>
            <Title level={1} style={{ ...titleStyle, ...heroTitleStyle }}>
              {heroTitle}
            </Title>
            <Paragraph style={{ ...descriptionStyle, ...heroDescriptionStyle }}>
              {heroDescription}
            </Paragraph>
          </Flex>
        </Flex>
      </Col>

      <Col
        xs={24}
        md={12}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: contentPadding,
          background: token.colorBgContainer,
        }}
      >
        <Flex vertical style={{ width: '100%', maxWidth: contentMaxWidth }}>
          {children}
        </Flex>
      </Col>
    </Row>
  </Flex>
  );
};
