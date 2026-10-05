import React from 'react';
import { Input } from 'antd';
import type { InputProps } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';

export const PhoneInput: React.FC<InputProps> = (props) => (
  <Input
    {...props}
    type="tel"
    inputMode="tel"
    autoComplete="tel"
    prefix={props.prefix ?? <PhoneOutlined />}
    placeholder={props.placeholder ?? '+380 (XX) XXX-XX-XX'}
  />
);
