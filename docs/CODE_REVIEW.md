# Code Review — WindowForLife

**Дата:** 2026-03-18
**Ветка:** develop
**Коммит с исправлениями:** db88ab2

---

## Обзор

Проведён полный код ревью проекта: backend, frontend, shared-пакет, nginx-конфиг.
Выявлено 27 проблем разной степени серьёзности. Критические и важные — исправлены.

---

## Исправленные проблемы

### Критические (исправлены)

| # | Проблема | Файл | Что сделано |
|---|----------|------|-------------|
| 1 | Нет graceful shutdown | `backend/src/server.ts` | Добавлена обработка SIGTERM/SIGINT с таймаутом 10с на завершение |
| 2 | Нет таймаутов на Telegram API | `backend/src/services/telegram.ts` | Добавлен `withTimeout()` через `Promise.race` (10с) |
| 3 | Небезопасный парсинг ответа API | `frontend/src/lib/api.ts` | Обработка сетевых ошибок (fetch fail) и невалидного JSON (пустое тело) |
| 4 | Placeholder в политике конфиденциальности | `frontend/src/components/PrivacyModal.tsx` | Удалён текст "Шаблон... Подлежит замене" |

### Важные (исправлены)

| # | Проблема | Файл | Что сделано |
|---|----------|------|-------------|
| 5 | Нет CSP/Permissions-Policy в nginx | `nginx/windowforlife.conf` | Добавлены заголовки CSP (с whitelist для Яндекс.Метрики и Карт) и Permissions-Policy |
| 6 | Нет валидации содержимого имён | `packages/shared/src/schemas/order.schema.ts` | Добавлен regex `/^[а-яА-ЯёЁa-zA-Z\s\-']+$/` для firstName/lastName |
| 7 | `as string` для env-переменных без проверки | Header, Footer, MobileMenu, PrivacyModal | Заменено на `\|\| ''` — безопасный fallback при отсутствии переменной |
| 8 | Хрупкий путь к `.env` через `__dirname` | `backend/src/config/env.ts` | Заменён на `process.cwd()` — работает и в dev, и после сборки |
| 12 | Утечка setTimeout в MobileMenu | `frontend/src/components/layout/MobileMenu.tsx` | Таймеры собираются в ref и очищаются при размонтировании |
| 13 | Неполная очистка номера в `tel:` ссылках | Header, Footer, MobileMenu, Contacts, FAQ | `.replace(/\s/g, '')` → `.replace(/[^\d+]/g, '')` — убирает скобки и дефисы |
| 16 | Нет retry при отправке формы | `frontend/src/hooks/useSubmitOrder.ts` | `retry: 0` → `retry: 1` |

### Обновлена документация

| Файл | Что изменено |
|------|-------------|
| `CLAUDE.md` | Добавлены: требования Node.js/npm, отсутствие тестов/линтера, указание CommonJS/ESM, UI-библиотеки, backend path aliases |

---

## Оставшиеся проблемы (не исправлены)

### Важные (рекомендуется исправить)

| # | Проблема | Файл | Рекомендация |
|---|----------|------|-------------|
| 9 | Нет логирования с requestId | `backend/src/routes/orders.ts` | Добавить генерацию уникального ID запроса для отслеживания ошибок |
| 10 | Не проверяется ответ Telegram API | `backend/src/services/telegram.ts` | Проверять успешность отправки, логировать message_id |
| 11 | `escapeHtml()` написан вручную | `backend/src/services/telegram.ts` | Рассмотреть библиотеку `he` или `html-escaper` |
| 14 | Нет focus trap в PrivacyModal | `frontend/src/components/PrivacyModal.tsx` | Добавить focus-trap для доступности (a11y) |
| 15 | Нет code splitting | `frontend/src/App.tsx` | `React.lazy()` для Gallery, Contacts (тяжёлые зависимости) |
| 17 | `sashTypes` без max и дедупликации | `packages/shared/src/schemas/order.schema.ts` | `.max(4)` и `.refine()` для уникальности |
| 18 | `legacy-peer-deps=true` в `.npmrc` | `.npmrc` | Проверить и удалить, если конфликтов нет |
| 19 | `build:prod` скрипт некорректен | `package.json` | Использовать `--workspace=` для всех пакетов |

### Незначительные

| # | Проблема | Файл | Рекомендация |
|---|----------|------|-------------|
| 20 | Нет `aria-label` на кнопках | Gallery, Products | Добавить для скринридеров |
| 21 | Нет счётчика символов в textarea | OrderForm | Показывать "N/500" рядом с полем комментария |
| 22 | Нет `fetchPriority="high"` для Hero | Hero.tsx | Ускорит LCP (Largest Contentful Paint) |
| 23 | ProductCard без `React.memo` | Products.tsx | Обернуть для предотвращения лишних перерендеров |
| 24 | Нет skeleton для изображений | Gallery.tsx | Добавить placeholder при загрузке |
| 25 | `type: Function` для Яндекс.Метрики | main.tsx | Создать типизированный интерфейс для `window.ym` |
| 26 | Нет директории `logs/` для PM2 | ecosystem.config.js | Создавать при деплое или настроить PM2 |
| 27 | API без версионирования | routes/orders.ts | `/api/v1/orders` для будущей совместимости |

---

## Пре-существующие проблемы конфигурации

**Backend `typecheck` падает** из-за TS6059 (`rootDir` в `tsconfig.json` не включает shared-пакет). Build работает корректно через `tsconfig.build.json`. Для исправления typecheck нужно либо:
- Убрать `rootDir` из `tsconfig.json` и добавить `composite: true`
- Либо использовать `--project tsconfig.build.json` для typecheck

---

## Затронутые файлы (коммит db88ab2)

```
CLAUDE.md
backend/src/config/env.ts
backend/src/server.ts
backend/src/services/telegram.ts
frontend/src/components/PrivacyModal.tsx
frontend/src/components/layout/Footer.tsx
frontend/src/components/layout/Header.tsx
frontend/src/components/layout/MobileMenu.tsx
frontend/src/components/sections/Contacts.tsx
frontend/src/components/sections/FAQ.tsx
frontend/src/hooks/useSubmitOrder.ts
frontend/src/lib/api.ts
nginx/windowforlife.conf
packages/shared/src/schemas/order.schema.ts
```
