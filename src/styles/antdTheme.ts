import type { ThemeConfig } from 'antd';

export const antdTheme: ThemeConfig = {
  // 1. Глобальные токены (применяются ко всем компонентам)
  token: {
    // Основной цвет приложения
    colorPrimary: '#0052FF',

    // Цвета ссылок
    colorLink: '#0052FF',
    colorLinkHover: '#3374FF',
    colorLinkActive: '#003ECC',

    // Состояния валидации (ошибки, успехи, предупреждения)
    colorError: '#f52629',
    colorSuccess: '#52C41A',
    colorWarning: '#FAAD14',
    colorInfo: '#0052FF',

    // Фон и границы
    borderRadius: 8, // Скругление кнопок, карточек, инпутов

    // Типографика
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  // 2. Токены конкретных компонентов
  components: {
    // Настройки Sidebar и Menu
    Menu: {
      darkItemColor: '#ffffff', // Белый цвет неактивных иконок и текста
      darkItemHoverColor: '#ffffff', // Белый при наведении
      darkItemSelectedBg: '#0052FF', // Синий фон активного пункта
      darkItemSelectedColor: '#ffffff', // Белый текст активного пункта
      darkItemBg: 'transparent',
    },

    // Настройки кнопок
    Button: {
      colorPrimary: '#0052FF',
      colorPrimaryHover: '#3374FF',
      colorPrimaryActive: '#003ECC',
      borderRadius: 8,
    },

    // Настройки шапки Layout
    Layout: {
      headerBg: '#ffffff',
      siderBg: '#03102B',
    },

    // Настройки полей ввода (Input)
    Input: {
      activeBorderColor: '#0052FF',
      hoverBorderColor: '#3374FF',
    },
  },
};
