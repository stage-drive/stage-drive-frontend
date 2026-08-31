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
- `test` — середовище для тестування командою QA.
- `develop` — основна гілка розробки, сюди зливається готовий функціонал.

### Робочі гілки

- `feature/*` — нові фічі та функціонал
- `fix/*` — виправлення помилок
- `bugfix/*` - виправлення багу від QA (за окремою таскою)
- `refactor/*` — рефакторинг без зміни поведінки
- `chore/*` — технічні зміни, конфігурації, підтримка проєкту

### Правило для всіх

Порядок роботи такий:

1. Створити нову гілку від `main`.
2. Розробляти задачу в гілці типу `feature/...`, `fix/...` або `refactor/...`.
3. Після завершення — відкрити Pull Request у `develop`.
4. Мержаєте його (без апрувів) і чекаєте автоматичного деплою на dev-сервер.
5. Заходьте на dev-сайт і перевіряєте, що ваш функціонал працює.
6. Якщо на develop все працює чудово cтворюєте другий Pull Request з цієї ж фіча-гілки у `test`. Мержаєте його в test.
7. Перевіряєте базовий респонс додатку на test-середовищі і віддаєте задачу тестувальникам (QA). 
8. Якщо під час тестування виявили помилку повертаєтесь, якщо баг незначний — ви можете доправити його прямо в поточній фіча-гілці feature/..., а якщо це окрема задача від QA — створюєте нову гілку bugfix/<CLICKUP-ID>-<description> від `main` і проходите той самий шлях (develop -> test -> main)
9. Коли QA поставили "Approved" (Схвалено) cтворюєте третій Pull Request -> main.

### 1. develop -> 2. test -> 3. main

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
npm run build.
```

### Git cheat sheet

```bash
# Оновити main і перейти на нього
git fetch origin
git checkout main
git pull origin main

# Створити нову feature-гілку від main
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

- [Документація React](https://react.dev/learn)
- [Документація Vite](https://vite.dev/guide/)
- [Документація Ant Design](https://ant.design/docs/react/introduce)
- [Документація Redux Toolkit](https://redux-toolkit.js.org/introduction/getting-started)
- [Документація React Router](https://reactrouter.com/start/library/installation)
