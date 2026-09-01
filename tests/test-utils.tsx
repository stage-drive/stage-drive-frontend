import { render, type RenderOptions } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { App as AntdApp, ConfigProvider } from 'antd';
import type { PropsWithChildren, ReactElement } from 'react';
import { baseApi } from '@/store/api/baseApi';

export function createTestStore() {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  });
}

export type TestStore = ReturnType<typeof createTestStore>;

interface ProvidersOptions {
  route?: string;
  store?: TestStore;
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'>, ProvidersOptions {}

function createWrapper({ route = '/', store }: ProvidersOptions) {
  const testStore = store ?? createTestStore();

  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <Provider store={testStore}>
        <ConfigProvider>
          <AntdApp>
            <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
          </AntdApp>
        </ConfigProvider>
      </Provider>
    );
  };
}

export function renderWithProviders(
  ui: ReactElement,
  { route, store, ...renderOptions }: RenderWithProvidersOptions = {}
) {
  const testStore = store ?? createTestStore();

  return {
    store: testStore,
    ...render(ui, {
      wrapper: createWrapper({ route, store: testStore }),
      ...renderOptions,
    }),
  };
}

export * from '@testing-library/react';
