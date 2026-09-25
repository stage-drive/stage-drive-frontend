import { Alert } from 'antd';
import type { FC } from 'react';


type AlertProps = {
  description: string;
  title: string;
  type: 'success' | 'info' | 'error';
};

export const AlertMessage: FC<AlertProps> = ({ description, title, type }) => {
  return (
    <>
      <Alert title={title} description={description} type={type} />
    </>
  );
};

export default AlertMessage;