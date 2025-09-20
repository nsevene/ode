# Мастер-промпт для полной пересборки B2B-портала ODPortal

Твоя роль: Ты — ведущий Full-stack разработчик, которому поручено с нуля пересобрать B2B-портал ODPortal. Твоя главная задача — писать чистый, эффективный, масштабируемый и хорошо документированный код на React (Vite + TypeScript) и Supabase.

Главный принцип: Мы не исправляем старый код. Мы пишем новый, используя старый проект (_legacy_lovable_project) ИСКЛЮЧИТЕЛЬНО как дизайн-референс и источник ассетов (изображения, стили, тексты). Если у тебя возникают трудности с пониманием задачи по верстке или дизайну, обратись к соответствующим файлам в _legacy_lovable_project для визуальной наглядности и контекста.

Методология работы: "Планируй, затем выполняй"
Прежде чем написать хотя бы одну строку кода приложения, ты должен подготовить свое рабочее пространство и план. Это критически важно для сохранения контекста на протяжении всего проекта.

## Детальный пошаговый план реализации

### Фаза 0: Подготовка к пересборке ("The Great Reset")

#### Шаг 0.1: Архивация старого проекта
- **Файлы для создания/изменения:**
  - Создать папку `_legacy_lovable_project/`
  - Переместить все файлы кроме: `supabase/`, `.git/`, `REFACTORING_PLAN.md`, `DEVELOPMENT_LOG.md`
  - Сохранить структуру legacy проекта для референса

#### Шаг 0.2: Инициализация нового B2B-портала
- **Файлы для создания:**
  - `package.json` - новая конфигурация с Vite + TypeScript
  - `vite.config.ts` - конфигурация Vite
  - `tsconfig.json` - конфигурация TypeScript
  - `tailwind.config.ts` - конфигурация Tailwind CSS
  - `src/main.tsx` - точка входа приложения
  - `src/App.tsx` - корневой компонент
  - `src/index.css` - глобальные стили
  - `src/vite-env.d.ts` - типы Vite

#### Шаг 0.3: Установка базовых зависимостей
- **Зависимости для установки:**
  - `react`, `react-dom`
  - `react-router-dom` - для роутинга
  - `zustand` - для state management
  - `tailwindcss` - для стилизации
  - `@supabase/supabase-js` - для работы с Supabase
  - `react-helmet-async` - для SEO
  - `@types/node` - типы для Node.js

#### Шаг 0.4: Создание базовой структуры папок
- **Папки для создания:**
  - `src/components/` - переиспользуемые компоненты
  - `src/pages/` - страницы приложения
  - `src/hooks/` - кастомные хуки
  - `src/store/` - Zustand store
  - `src/lib/` - утилиты и конфигурация
  - `src/features/` - функциональные модули
  - `src/assets/` - статические ресурсы
  - `src/types/` - TypeScript типы

### Фаза 1: B2B Demo-портал и сбор заявок (Публичный MVP)

#### Шаг 1.1: Создание публичных страниц
- **Файлы для создания:**
  - `src/pages/HomePage.tsx` - главная страница
  - `src/pages/AboutPage.tsx` - о портале
  - `src/pages/TenantOpportunitiesPage.tsx` - возможности для арендаторов
  - `src/pages/InvestorOpportunitiesPage.tsx` - возможности для инвесторов
  - `src/components/layout/Header.tsx` - шапка сайта
  - `src/components/layout/Footer.tsx` - подвал сайта
  - `src/components/layout/Layout.tsx` - общий лейаут

#### Шаг 1.2: Demo Walkthrough
- **Файлы для создания:**
  - `src/pages/DemoPage.tsx` - страница демо-тура
  - `src/components/demo/DemoDashboard.tsx` - демо дашборда
  - `src/components/demo/DemoPortal.tsx` - демо портала
  - `src/data/mockData.ts` - моковые данные для демо
  - `src/components/demo/DemoStep.tsx` - компонент шага демо

#### Шаг 1.3: Формы заявок для арендаторов
- **Файлы для создания:**
  - `src/pages/TenantApplicationPage.tsx` - страница заявки арендатора
  - `src/components/forms/TenantApplicationForm.tsx` - форма заявки
  - `src/hooks/useTenantApplication.ts` - логика формы
  - `src/types/tenant.ts` - типы для арендаторов

#### Шаг 1.4: Инвесторские формы
- **Файлы для создания:**
  - `src/pages/InvestorContactPage.tsx` - страница контакта инвестора
  - `src/components/forms/InvestorContactForm.tsx` - форма контакта
  - `src/hooks/useInvestorContact.ts` - логика формы
  - `src/types/investor.ts` - типы для инвесторов

### Фаза 2: Закрытая часть портала (Core B2B)

#### Шаг 2.1: Аутентификация и роли
- **Файлы для создания:**
  - `src/lib/supabase.ts` - конфигурация Supabase
  - `src/hooks/useAuth.ts` - хук для аутентификации
  - `src/components/auth/LoginForm.tsx` - форма входа
  - `src/components/auth/ProtectedRoute.tsx` - защищенный роут
  - `src/types/auth.ts` - типы для аутентификации
  - `src/store/authStore.ts` - store для аутентификации

#### Шаг 2.2: Admin панель (MVP)
- **Файлы для создания:**
  - `src/pages/admin/DashboardPage.tsx` - админ дашборд
  - `src/pages/admin/ApplicationsPage.tsx` - управление заявками
  - `src/pages/admin/UsersPage.tsx` - управление пользователями
  - `src/components/admin/ApplicationsTable.tsx` - таблица заявок
  - `src/components/admin/UsersTable.tsx` - таблица пользователей
  - `src/hooks/useApplications.ts` - логика заявок
  - `src/hooks/useUsers.ts` - логика пользователей

#### Шаг 2.3: Полный Data Room
- **Файлы для создания:**
  - `src/pages/DataRoomPage.tsx` - страница Data Room
  - `src/components/dataroom/FileExplorer.tsx` - файловый менеджер
  - `src/components/dataroom/FileUpload.tsx` - загрузка файлов
  - `src/components/dataroom/FolderTree.tsx` - дерево папок
  - `src/hooks/useDataRoom.ts` - логика Data Room
  - `src/types/dataroom.ts` - типы для Data Room

### Фаза 3: Продвинутый функционал и подготовка к B2C

#### Шаг 3.1: Разработка API для B2C
- **Файлы для создания:**
  - `supabase/functions/get-public-menu/index.ts` - API для публичного меню
  - `supabase/functions/get-public-events/index.ts` - API для публичных событий
  - `supabase/functions/create-booking/index.ts` - API для создания бронирований
  - `src/lib/api.ts` - клиентские функции для API
  - `src/types/api.ts` - типы для API

#### Шаг 3.2: Управление геймификацией
- **Файлы для создания:**
  - `src/pages/admin/GamificationPage.tsx` - управление геймификацией
  - `src/components/admin/TasteAlleyManager.tsx` - управление Taste Alley
  - `src/components/admin/CompassManager.tsx` - управление Compass
  - `src/components/admin/PassportManager.tsx` - управление Passport
  - `src/hooks/useGamification.ts` - логика геймификации

### Фаза 4: Рост и Оптимизация

#### Шаг 4.1: SEO + GA4
- **Файлы для создания:**
  - `src/components/seo/SEOHead.tsx` - компонент для SEO
  - `src/lib/analytics.ts` - конфигурация GA4
  - `src/hooks/useAnalytics.ts` - хук для аналитики
  - `src/lib/seo.ts` - утилиты для SEO

#### Шаг 4.2: A/B тесты
- **Файлы для создания:**
  - `src/lib/abTesting.ts` - конфигурация A/B тестов
  - `src/hooks/useABTest.ts` - хук для A/B тестов
  - `src/components/ab/ABTestWrapper.tsx` - обертка для A/B тестов