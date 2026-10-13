import type { ReactNode } from 'react';
import { Col, type ColProps } from 'antd';

export const DashboardCol = ({ children, style, ...rest }: ColProps) => (
  <Col {...rest} style={{ display: 'flex', ...style }}>
    <div style={{ display: 'flex', flex: 1, minWidth: 0 }}>{children as ReactNode}</div>
  </Col>
);
