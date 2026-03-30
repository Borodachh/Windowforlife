# WindowForLife — Лендинг

Одностраничный лендинг для компании по производству и монтажу окон ПВХ и алюминиевых конструкций.

## Стек

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend:** Node.js 20, Express, TypeScript, Zod
- **Интеграции:** Telegram Bot API, Яндекс.Карты, Яндекс.Метрика
- **Деплой:** Nginx, PM2, Let's Encrypt

---

## Локальная разработка

### Требования

- Node.js >= 20
- npm >= 9

### Установка

```bash
git clone <repo-url>
cd windowforlife
npm install
cp .env.example .env
```

Заполните `.env` реальными значениями (см. раздел «Переменные окружения»).

### Запуск

```bash
# Оба сервера одновременно (frontend :5173 + backend :3001)
npm run dev

# Или по отдельности:
npm run dev:frontend    # Frontend (localhost:5173)
npm run dev:backend     # Backend (localhost:3001)
```

В dev-режиме запросы `/api/*` с фронтенда проксируются на порт 3001 через Vite.

---

## Деплой на Beget VPS

### 1. Подготовка сервера

```bash
# Установите Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs

# Установите PM2 и Nginx
npm install -g pm2
sudo apt install -y nginx

# Установите certbot для SSL
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Клонирование и настройка

```bash
cd /var/www
git clone <repo-url> windowforlife
cd windowforlife

npm install

cp .env.example .env
nano .env   # заполните все переменные (особенно TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID)
```

### 3. Сборка

```bash
# Собрать всё (shared → frontend → backend)
npm run build

# Или по отдельности (порядок важен: shared — первым):
npm run build:shared      # → packages/shared/dist/
npm run build:frontend    # → frontend/dist/
npm run build:backend     # → backend/dist/server.js
```

### 4. Запуск через PM2

```bash
cd /var/www/windowforlife/backend
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup   # следуйте инструкциям в выводе команды
```

### 5. Настройка Nginx

```bash
sudo cp nginx/windowforlife.conf /etc/nginx/sites-available/windowforlife
sudo ln -s /etc/nginx/sites-available/windowforlife /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Обновите путь `root` в nginx-конфиге если нужно:
```nginx
root /var/www/windowforlife/frontend/dist;
```

### 6. SSL-сертификат

```bash
sudo certbot --nginx -d windowforlife.ru -d www.windowforlife.ru
```

### 7. Проверка

```bash
# Статус сервера
pm2 status

# Логи бэкенда
pm2 logs windowforlife-backend

# Тест API
curl https://windowforlife.ru/api/health
```

---

## Переменные окружения

Файл `.env` в корне проекта:

| Переменная | Где используется | Описание |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | backend | Токен бота от @BotFather |
| `TELEGRAM_CHAT_ID` | backend | ID чата/канала для заявок |
| `VITE_YANDEX_METRIKA_ID` | frontend | ID счётчика Яндекс.Метрики |
| `VITE_YANDEX_MAPS_API_KEY` | frontend | API-ключ Яндекс.Карт |
| `VITE_COMPANY_PHONE` | frontend | Телефон компании |
| `VITE_COMPANY_EMAIL` | frontend | Email компании |
| `VITE_COMPANY_WORK_HOURS` | frontend | Часы работы |
| `VITE_COMPANY_ADDRESS` | frontend | Адрес компании |
| `VITE_MAP_LATITUDE` | frontend | Широта для карты |
| `VITE_MAP_LONGITUDE` | frontend | Долгота для карты |
| `PORT` | backend | Порт сервера (по умолчанию 3001) |
| `CORS_ORIGIN` | backend | Разрешённый origin (https://windowforlife.ru) |

> **Важно:** переменные с префиксом `VITE_` доступны во фронтенде. Без префикса — только на бэкенде.

---

## Обновление сайта

```bash
cd /var/www/windowforlife
git pull
npm install
npm run build
pm2 restart windowforlife-backend
```

---

## Структура проекта

```
windowforlife/
├── packages/shared/      # Общие Zod-схемы и типы
├── frontend/             # React + Vite приложение
│   ├── src/
│   │   ├── components/   # UI, layout, sections
│   │   ├── data/         # Статические данные (продукты, FAQ, отзывы)
│   │   ├── hooks/        # useInView, useSubmitOrder
│   │   └── lib/          # api.ts, analytics.ts
│   └── public/           # robots.txt, sitemap.xml, favicon
├── backend/              # Express API
│   └── src/
│       ├── routes/       # POST /api/orders
│       ├── services/     # telegram.ts, calculator.ts
│       ├── middleware/   # rateLimiter, validateBody
│       └── config/       # env.ts
├── nginx/                # Nginx конфигурация
└── .env.example          # Шаблон переменных окружения
```

---

## Чеклист перед запуском

- [ ] `.env` заполнен всеми реальными значениями
- [ ] `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` проверены (бот добавлен в чат с правами отправки)
- [ ] `VITE_YANDEX_MAPS_API_KEY` выдан через [Яндекс.Разработчик](https://developer.tech.yandex.ru/)
- [ ] `VITE_YANDEX_METRIKA_ID` настроен в [Метрике](https://metrika.yandex.ru/)
- [ ] SSL-сертификат выдан и Nginx перезапущен
- [ ] `npm run build` проходит без ошибок
- [ ] Форма заявки протестирована — заявка приходит в Telegram
- [ ] Все placeholder-тексты и изображения заменены на реальные

---

## Замена контента

| Что заменить | Где найти |
|---|---|
| Фото продуктов | `frontend/src/data/products.ts` |
| Фото галереи | `frontend/src/data/gallery.ts` |
| Отзывы | `frontend/src/data/reviews.ts` |
| FAQ | `frontend/src/data/faq.ts` |
| Числа в «О нас» | `frontend/src/components/sections/About.tsx` |
| Hero фото | `frontend/src/components/sections/Hero.tsx` |
| OG-изображение | `frontend/public/og-image.jpg` (1200×630) |
