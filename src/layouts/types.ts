import type { ReactNode } from 'react';

export type AppNavItem = {
  key: string;
  icon?: ReactNode;
  label: string;
  description?: string;
  danger?: boolean;
};
