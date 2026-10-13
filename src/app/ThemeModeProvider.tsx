import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import { getAntdTheme, type ThemeMode } from '@/styles/antdTheme';

const STORAGE_KEY = 'theme-mode';

interface ThemeModeContextValue {
  mode: ThemeMode;
  setDarkTheme: (dark: boolean) => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

const readThemeMode = (): ThemeMode => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(readThemeMode);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Theme still applies for this visit when storage is blocked.
    }
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      setDarkTheme: (dark) => setMode(dark ? 'dark' : 'light'),
    }),
    [mode],
  );

  const themeConfig = useMemo(() => getAntdTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = (): ThemeModeContextValue => {
  const context = useContext(ThemeModeContext);
  return context ?? { mode: 'light', setDarkTheme: () => {} };
};
