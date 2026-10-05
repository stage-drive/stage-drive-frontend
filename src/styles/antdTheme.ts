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
      darkItemHoverColor: '#ffffff',
      darkItemHoverBg: 'rgba(51, 116, 255, 0.28)',
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
      controlHeight: 40,
      controlHeightLG: 40,
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
      controlHeight: 40,
    },
    // Настройки модальных окон (Modal)
    Modal: {
      colorPrimary: '#0052FF',
      borderRadius: 8,
    },
    // Настройки уведомлений (Notification)
    Notification: {
      colorPrimary: '#0052FF',
      borderRadius: 8,
    },
    // Настройки сообщений (Message)
    Message: {
      colorPrimary: '#0052FF',
      borderRadius: 8,
    },
    // Настройки селекторов (Select)
    Select: {
      colorPrimary: '#0052FF',
      borderRadius: 8,
      controlHeight: 40,
    },
    // Настройки переключателей (Switch)
    Switch: {
      colorPrimary: '#0052FF',
      borderRadius: 8,
    },
    // Настройки чекбоксов (Checkbox)
    Checkbox: {
      colorPrimary: '#0052FF',
      borderRadius: 8,
    },
    // Настройки радиокнопок (Radio)
    Radio: {
      colorPrimary: '#0052FF',
      borderRadius: 8,
    },
    // Настройки прогресс-баров (Progress)
    Progress: {
      colorPrimary: '#0052FF',
      borderRadius: 8,
    },
    // Настройки слайдеров (Slider)
    Slider: {
      colorPrimary: '#0052FF',
      borderRadius: 8,
    },
    // Настройки вкладок (Tabs)
    Tabs: {
      colorPrimary: '#0052FF',
      borderRadius: 8,
    },
    // Настройки таблиц (Table)
    Table: {
      colorPrimary: '#0052FF',
      borderRadius: 8,
    },
    // Настройки календарей (Calendar)
    Calendar: {
      colorPrimary: '#0052FF',
      borderRadius: 8,
    },
    // Настройки выпадающих списков (Dropdown)
    Dropdown: {
      colorPrimary: '#0052FF',
      borderRadius: 8,
    },
    // Настройки тултипов (Tooltip)
    Tooltip: {
      colorPrimary: '#0052FF',
      borderRadius: 8,
    },
    // Настройки спиннеров (Spin)
    Spin: {
      colorPrimary: '#0052FF',
      borderRadius: 8,
    },
    // Настройки аватаров (Avatar)
    Avatar: {
      colorPrimary: '#0052FF',
      borderRadius: 8,
    },
    // Настройки тегов (Tag)
    Tag: {
      colorPrimary: '#0052FF',
      borderRadius: 8,
    },
    // Настройки хлебных крошек (Breadcrumb)
    Breadcrumb: {
      colorPrimary: '#0052FF',
      borderRadius: 8,
    },
  },
};
