# Stage Drive — CRM / LMS для автошколи

Сучасна вебплатформа для автоматизації адміністративних і навчальних процесів автошколи. Проєкт поєднує CRM-функціональність і LMS-логіку для роботи з учнями, групами, розкладом, практикою, теорією, тестами та оплатами.

## Технології

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Ant Design](https://ant.design/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- [React Router](https://reactrouter.com/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## Швидкий старт

0. Спочатку клонуйте репозиторій:

```bash
git clone https://github.com/stage-drive/stage-drive-frontend.git
```

1. Встановіть залежності:

```bash
npm install
```

2. Запустіть проект у режимі розробки:

```bash
npm run dev
```

3. Зберіть продакшн-версію:

```bash
npm run build
```

4. Перевірте код лінтером та форматуванням:

```bash
npm run lint
npm run format
```

5. Запустіть тести:

```bash
npm test
```

## Структура проєкту

Основні папки проекту:

```bash
src/
├── app/
│   ├── App.tsx
│   ├── AuthErrorListener.tsx
│   └── router/
│       ├── AppRoutes.tsx
│       ├── ProtectedRoute.tsx
│       ├── roleHome.ts
│       └── useAuthSession.ts
├── assets/
│   ├── fonts/
│   ├── icons/
│   └── images/
├── layouts/
│   ├── BaseLayout.tsx
│   ├── OwnerLayout.tsx
│   ├── AdminLayout.tsx
│   ├── TeacherLayout.tsx
│   ├── InstructorLayout.tsx
│   └── StudentLayout.tsx
├── modules/
│   ├── auth/
│   │   ├── components/
│   │   └── pages/
│   ├── cars/
│   │   ├── components/
│   │   └── pages/
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── StatsCard.tsx
│   │   │   └── DashboardWidget.tsx
│   │   └── pages/
│   │       ├── OwnerDashboardPage.tsx
│   │       ├── AdminDashboardPage.tsx
│   │       ├── TeacherDashboardPage.tsx
│   │       ├── InstructorDashboardPage.tsx
│   │       └── StudentDashboardPage.tsx
│   ├── groups/
│   │   ├── components/
│   │   └── pages/
│   ├── invitations/
│   │   ├── components/
│   │   └── pages/
│   ├── notifications/
│   │   ├── components/
│   │   └── pages/
│   ├── payments/
│   │   ├── components/
│   │   └── pages/
│   ├── practice/
│   │   ├── components/
│   │   └── pages/
│   ├── profile/
│   │   ├── components/
│   │   └── pages/
│   ├── schedule/
│   │   ├── components/
│   │   └── pages/
│   ├── students/
│   │   ├── components/
│   │   └── pages/
│   ├── tests/
│   │   ├── components/
│   │   └── pages/
│   └── theory/
│       ├── components/
│       └── pages/
├── shared/
│   ├── components/
│   └── utils/
├── store/
│   ├── store.ts
│   └── api/
│       ├── baseApi.ts
│       ├── types.ts
│       └── endpoints/
│           ├── authApi.ts
│           ├── dashboardApi.ts
│           ├── invitationsApi.ts
│           └── studentsApi.ts
├── styles/
│   └── antdTheme.ts
├── App.css
├── index.css
└── main.tsx
```

```bash
tests/
├── setup.ts
├── test-utils.tsx
├── app/
│   └── router/
│       └── ProtectedRoute.test.tsx
├── modules/
│   ├── auth/
│   │   ├── components/
│   │   └── pages/
│   ├── dashboard/
│   │   └── components/
│   ├── invitations/
│   │   └── pages/
│   └── profile/
│       └── pages/
└── shared/
    └── utils/
        └── ukrainianPhone.test.ts
```

### Як читати цю структуру

- `app/` — корінь застосунку, маршрути, сесія та слухач помилок авторизації.
- `layouts/` — каркас сторінки. `BaseLayout` — спільне меню і шапка, решта файлів — варіанти для Owner, Admin, Teacher, Instructor та Student.
- `modules/` — сторінки і компоненти за функціями. У кожному модулі є `pages/` і `components/`. Порожні папки — місце для екранів, яких ще немає.
- `shared/` — компоненти й утиліти, які потрібні в кількох модулях.
- `store/` — Redux store і запити до API через RTK Query.
- `styles/` — тема Ant Design.
- `tests/` — unit-тести. Структура папок повторює `src/`.

> `layout` відповідає за каркас сторінки, а `module` — за вміст і функціональність.

## Важливі нотатки

- Імпорти з `src/` пишіть через аліас `@/`, а не через довгі відносні шляхи на кшталт `../../../`. Аліас вказує на папку `src`, розширення файлу не додавайте.

```ts
import { PhoneInput } from '@/shared/components/PhoneInput';
```

- Глобальні стилі Ant Design підключені в [src/main.tsx](src/main.tsx).
- Базова конфігурація RTK Query знаходиться в [src/store/api/baseApi.ts](src/store/api/baseApi.ts).
- Redux store налаштований у [src/store/store.ts](src/store/store.ts).
- Маршрутизація описана в [src/app/router/AppRoutes.tsx](src/app/router/AppRoutes.tsx).

## Скрипти

- `npm run dev` — запуск dev-сервера
- `npm run build` — production build
- `npm run lint` — перевірка ESLint
- `npm run format` — форматування Prettier
- `npm run preview` — попередній перегляд збірки
- `npm test` — запуск unit-тестів один раз
- `npm run test:watch` — тести в watch-режимі
- `npm run test:coverage` — тести зі звітом покриття

## Тестування

Використовується [Vitest](https://vitest.dev/) і [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

- Конфігурація — `vite.config.ts`
- Глобальний setup (jsdom, matchMedia, очищення `localStorage`) — `tests/setup.ts`
- Рендер із Redux, Ant Design `App` і `MemoryRouter` — `tests/test-utils.tsx`

Тести лежать у `tests/` і повторюють структуру `src/`. Наприклад, `src/modules/auth/components/LoginForm.tsx` → `tests/modules/auth/components/LoginForm.test.tsx`.

Для компонентів із роутером, store або `App.useApp()` використовуйте `renderWithProviders` з `tests/test-utils.tsx`. Для простих UI-компонентів достатньо `render`.

## Git workflow

### Основні гілки

- `main` — продакшн-версія, стабільний релізний код.
- `develop` — основна гілка розробки, сюди зливається готовий функціонал.

### Робочі гілки

- `feature/*` — нові фічі та функціонал
- `fix/*` — виправлення помилок
- `bugfix/*` - виправлення багу від QA (за окремою таскою)
- `refactor/*` — рефакторинг без зміни поведінки
- `chore/*` — технічні зміни, конфігурації, підтримка проєкту

### Правило для всіх

Порядок роботи такий:

1. Створити нову гілку від `dev`.
2. Розробляти задачу в гілці типу `feature/...`, `fix/...` або `refactor/...`.
3. Після завершення — відкрити Pull Request у `dev`.
4. Мержаєте його (без апрувів) і чекаєте автоматичного деплою на dev-сервер.
5. Заходьте на dev-сайт і перевіряєте, що ваш функціонал працює і віддаєте задачу тестувальникам (QA).
8. Якщо під час тестування виявили помилку повертаєтесь і проходите той самий шлях
9. Коли весь проект готовий и все перевырено cтворюєте  Pull Request -> main.

### 1. develop  -> 3. main

Злиття в main: PR у main може бути злитий тільки після approval іншого frontend-розробника. Автор PR не виконує merge у main власного PR без необхідного approval.

### Схема

```bash
main
├── feature/AUTH-01-login
├── feature/DASH-01-dashboard
├── feature/STU-12-students-list
├── feature/GRP-05-groups
├── feature/CAR-03-cars
├── feature/SCH-05-create-lesson
└── ...
```

Перед PR рекомендується виконати

```bash
npm run lint
npm test
npm run build
```

### Git cheat sheet

```bash
# Оновити develop і перейти на нього
git fetch origin
git checkout develop
git pull origin develop

# Створити нову feature-гілку від develop
git checkout -b feature/"назва"

# Перевірити статус
git status

# Додати зміни до коміту
git add .

# Зробити коміт
git commit -m "feat: опис коміту"

# Вивантажити гілку на GitHub
git push -u origin feature/"назва"

```

Після цього відкрийте перший Pull Request у гілку develop.

### ClickUp → GitHub

Кожна задача розробника створюється та ведеться в ClickUp.

ID задачі ClickUp використовується у назві Git-гілки та Pull Request.

Формат гілки:

feature/<CLICKUP-ID>-<short-description>

Наприклад:
feature/AUTH-01-login
feature/STU-12-students-list
feature/SCH-05-create-lesson

Pull Request також повинен містити ID задачі ClickUp.

## Корисні посилання

- [Продакшн](https://stage-drive-backend-test-910081714151.us-central1.run.app/login)
- [Swagger](https://stage-drive-backend-test-910081714151.us-central1.run.app/api/docs)
- [Документація React](https://react.dev/learn)
- [Документація Vite](https://vite.dev/guide/)
- [Документація Ant Design](https://ant.design/docs/react/introduce)
- [Документація Redux Toolkit](https://redux-toolkit.js.org/introduction/getting-started)
- [Документація React Router](https://reactrouter.com/start/library/installation)
