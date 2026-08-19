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

## Швидкий старт

0. Спочатку клонуйте репозиторій:

```bash
git clone <ссилка-на-репозиторій>
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

## Структура проєкту

Основні папки проекту:

```bash
src/
├── app/
│   ├── App.tsx
│   ├── providers/
│   └── router/
│       └── AppRoutes.tsx
├── assets/
├── layouts/
│   ├── OwnerLayout/
│   │   ├── OwnerLayout.tsx
│   │   └── OwnerSidebar.tsx
│   │
│   ├── AdminLayout/
│   │   ├── AdminLayout.tsx
│   │   └── AdminSidebar.tsx
│   │
│   ├── TeacherLayout/
│   ├── InstructorLayout/
│   └── StudentLayout/
├── modules/
│   ├── auth/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── ...
│   ├── cars/
│   ├── dashboard/
│   │   ├── pages/
│   │   │   ├── OwnerDashboardPage.tsx
│   │   │   ├── AdminDashboardPage.tsx
│   │   │   ├── TeacherDashboardPage.tsx
│   │   │   ├── InstructorDashboardPage.tsx
│   │   │   └── StudentDashboardPage.tsx
│   │   │
│   │   └── components/
│   │       ├── StatsCard.tsx
│   │       ├── DashboardWidget.tsx
│   │       └── ...
│   ├── groups/
│   ├── notifications/
│   ├── payments/
│   ├── practice/
│   ├── profile/
│   ├── schedule/
│   ├── students/
│   ├── tests/
│   ├── theory/
│   └── users/
├── shared/
├── store/
│   ├── api/
│   │   ├── baseApi.ts
│   │   └── endpoints/
│   │       ├── authApi.ts
│   │       ├── studentsApi.ts
│   │       ├── groupsApi.ts
│   │       ├── paymentsApi.ts
│   │       └── scheduleApi.ts
│   ├── slices/
│   ├── store.ts
│   └── ...
├── styles/
├── index.css
├── main.tsx
└── ...
```

### Як читати цю структуру

- `app/` — базові налаштування проєкту, маршрути, провайдери.
- `layouts/` — рольові шаблони сторінок: Sidebar, Header та загальна структура інтерфейсу для Owner, Admin, Teacher, Instructor та Student
- `modules/` — сама логіка сторінок і функціональних блоків.
- `shared/` — компоненти, типи та утиліти, які використовуються в кількох місцях.
- `store/` — глобальний стан, Redux slices та API через RTK Query.
- `styles/` — глобальні стилі та тема застосунку.

> `layout` відповідає за каркас сторінки, а `module` — за вміст і функціональність.

## Важливі нотатки

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

## Git workflow

### Основні гілки

- `main` — продакшн-версія, стабільний релізний код.
- `develop` — основна гілка розробки, сюди зливається готовий функціонал.

### Робочі гілки

- `feature/*` — нові фічі та функціонал
- `fix/*` — виправлення помилок
- `refactor/*` — рефакторинг без зміни поведінки
- `chore/*` — технічні зміни, конфігурації, підтримка проєкту

### Правило для всіх

Ніхто не працює напряму в `main` або `develop`.

Порядок роботи такий:

1. Створити нову гілку від `develop`.
2. Розробляти задачу в гілці типу `feature/...`, `fix/...` або `refactor/...`.
3. Після завершення — відкрити Pull Request у `develop`.
4. Після перевірки та схвалення — виконати злиття в `develop`.
5. Коли версія готова до релізу — зробити Pull Request з `develop` у `main`.

PR може бути злитий після approval іншого frontend-розробника. Автор PR не виконує merge власного PR без необхідного approval.

### Схема

```bash
develop
├── feature/AUTH-01-login
├── feature/DASH-01-dashboard
├── feature/STU-12-students-list
├── feature/GRP-05-groups
├── feature/CAR-03-cars
├── feature/SCH-05-create-lesson
└── ...
```

### Важливо

- Не комітити напряму в `main` і `develop`.
- Усі зміни йдуть через окремі гілки та Pull Request.
- Спочатку: `feature → develop`
- Потім: `develop → main`

Перед PR рекомендується виконати 
```bash
npm run lint
npm run build.

### Git cheat sheet

```bash
# Перейти на develop
git checkout develop

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

# Обновити локальний develop
git checkout develop
git pull origin develop

```

Після цього відкрийте Pull Request у `develop`.

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

- [Документація React](https://react.dev/learn)
- [Документація Vite](https://vite.dev/guide/)
- [Документація Ant Design](https://ant.design/docs/react/introduce)
- [Документація Redux Toolkit](https://redux-toolkit.js.org/introduction/getting-started)
- [Документація React Router](https://reactrouter.com/start/library/installation)
