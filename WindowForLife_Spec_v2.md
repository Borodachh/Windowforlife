# Спецификация проекта: Лендинг WindowForLife
# Формат: Opus (планирование) → Sonnet (реализация)

---

## МЕТА: Инструкция по использованию этого документа

### Процесс разработки

Данная спецификация предназначена для двухэтапной разработки:

**Этап 1 — Планирование (Claude Opus 4.6):**
Получает эту спецификацию целиком. На выходе выдаёт детальный поэтапный план реализации. Уровень детализации плана — на уровне псевдокода, интерфейсов и конкретных инструкций, чтобы Sonnet мог исполнять без двусмысленностей.

**Этап 2 — Реализация (Claude Sonnet, через Claude Code):**
Получает план от Opus и исполняет его этап за этапом. Каждый этап — отдельный промпт. Между этапами заказчик проверяет результат.

### Требования к плану от Opus

План должен быть разбит на 6 этапов (фаз). Для каждого этапа Opus обязан указать:

1. **Файлы** — полный список файлов для создания/изменения с указанием путей
2. **Интерфейсы** — TypeScript-интерфейсы, типы, Zod-схемы — в виде готового кода
3. **Зависимости** — какие npm-пакеты устанавливаются на данном этапе
4. **Связи** — какие файлы из предыдущих этапов используются и как
5. **Детали реализации** — конкретные решения (не «сделать компонент формы», а «React Hook Form + Zod resolver, поле телефона — с маской через onChange, вот схема валидации...»)
6. **Критерии проверки** — что заказчик должен увидеть/проверить после этапа (например: «npm run dev запускается без ошибок, на localhost:5173 рендерится хедер и Hero-секция»)

### Порядок фаз реализации

| Фаза | Название | Что делается |
|---|---|---|
| 1 | Фундамент | Инициализация монорепо, конфиги, shared-пакет, .env, базовая структура |
| 2 | Бэкенд | Express-сервер, роуты, Telegram-интеграция, валидация, rate limiting |
| 3 | UI-кит и каркас | Tailwind-конфиг, дизайн-токены, UI-компоненты (Button, Input, Select, Accordion, SectionHeading), Layout (Header, Footer, MobileMenu), App.tsx с пустыми секциями |
| 4 | Секции: верх страницы | Hero, Products, About, HowWeWork — с данными, анимациями, адаптивностью |
| 5 | Секции: низ страницы | Gallery, OrderForm, Reviews, FAQ, Contacts — с данными, формой, картой, каруселями |
| 6 | Финализация | SEO (мета-теги, JSON-LD, sitemap, robots), Яндекс.Метрика, политика конфиденциальности, Nginx-конфиг, PM2, README, production build, финальная проверка |

### Инструкция для Sonnet (вставить в системный промпт или в начало каждого промпта)

```
Ты — исполнитель проекта. Работаешь строго по плану, составленному архитектором.

Правила:
- Следуй плану точно. Не меняй архитектуру, интерфейсы и структуру файлов.
- Если в плане что-то не определено — используй лучшую практику, но оставь комментарий // TODO: уточнить у архитектора
- Перед написанием фронтенд-кода прочитай skill: /mnt/skills/public/frontend-design/SKILL.md
- После каждого созданного файла — проверяй, что проект компилируется (npm run build / npm run dev)
- Не пропускай файлы из плана, даже если они кажутся очевидными (конфиги, .gitignore и т.д.)
- Контент-заглушки помечай комментарием: // PLACEHOLDER: заменить на реальные данные
- Все строки из .env используй через import.meta.env (фронт) или process.env (бэк), никогда не хардкодь
```

---

## 1. Общее описание проекта

### 1.1 О продукте
Одностраничный лендинг (SPA) для компании по производству и монтажу окон ПВХ и алюминиевых конструкций.

- **Домен:** windowforlife.ru
- **Тип:** B2C лендинг — привлечение индивидуальных клиентов
- **Главная цель:** сбор заявок на бесплатный замер с последующим расчётом и монтажом
- **Визуальный стиль:** калифорнийский стартап (чистый, воздушный, минималистичный)
- **Референсы дизайна:** [adaline.ai](https://www.adaline.ai/), [ionic.io](https://ionic.io/)
- **Хостинг:** Beget (VPS)

### 1.2 Продуктовая линейка

#### Окна ПВХ
| Профильная система | Описание |
|---|---|
| Knipping | Немецкая профильная система премиум-класса |
| KBE | Немецкий профиль, оптимальное соотношение цена/качество |

Типы конструкций: балконный блок, одностворчатое окно, двухстворчатое окно, трёхстворчатое окно.

#### Алюминиевые конструкции
| Система | Назначение |
|---|---|
| Provedal C640 | Раздвижная система холодного остекления балконов и лоджий |
| Provedal P400 | Распашная система холодного остекления |
| Фасадный алюминий | Системы фасадного остекления |

### 1.3 Ключевые преимущества (УТП)
1. Собственное производство — без посредников, контроль качества на каждом этапе
2. Бесплатный замер — выезд мастера в удобное время
3. Бесплатная доставка — в пределах зоны обслуживания

---

## 2. Технологический стек

### 2.1 Frontend
| Технология | Версия | Назначение |
|---|---|---|
| React | 18.x | UI-фреймворк |
| TypeScript | 5.x | Типизация |
| Vite | 5.x | Сборка и dev-сервер |
| Tailwind CSS | 3.x | Утилитарные стили |
| React Query (TanStack Query) | 5.x | Управление серверным состоянием |
| React Hook Form | 7.x | Валидация и управление формами |
| Zod | 3.x | Схемы валидации (общие для фронта и бэка) |
| Framer Motion | 11.x | Анимации скролла и появления блоков |
| react-yandex-maps | latest | Интеграция Яндекс.Карт |
| Swiper | 11.x | Карусели для галереи и отзывов |

### 2.2 Backend
| Технология | Версия | Назначение |
|---|---|---|
| Node.js | 20 LTS | Рантайм |
| Express | 4.x | HTTP-сервер |
| TypeScript | 5.x | Типизация |
| Zod | 3.x | Валидация входящих данных |
| node-telegram-bot-api | latest | Отправка заявок в Telegram |
| helmet | latest | Безопасность HTTP-заголовков |
| cors | latest | CORS-политики |
| express-rate-limit | latest | Rate limiting |
| compression | latest | Gzip-сжатие ответов |
| dotenv | latest | Загрузка .env |

### 2.3 Инфраструктура
| Инструмент | Назначение |
|---|---|
| PM2 | Менеджер процессов Node.js на сервере |
| Nginx | Реверс-прокси, раздача статики, SSL |
| Let's Encrypt / Beget SSL | HTTPS-сертификат |

---

## 3. Архитектура проекта

### 3.1 Структура монорепозитория

```
windowforlife/
├── packages/
│   └── shared/                  # Общий код фронта и бэка
│       ├── src/
│       │   ├── schemas/
│       │   │   └── order.schema.ts    # Zod-схема заявки
│       │   └── types/
│       │       └── order.types.ts     # TS-типы заявки
│       ├── package.json
│       └── tsconfig.json
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── og-image.jpg               # Open Graph (1200×630)
│   │   └── robots.txt
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/                # Изображения (WebP + fallback)
│   │   │   └── fonts/                 # Локальные шрифты
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── MobileMenu.tsx
│   │   │   ├── sections/
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── Products.tsx
│   │   │   │   ├── About.tsx
│   │   │   │   ├── HowWeWork.tsx
│   │   │   │   ├── Gallery.tsx
│   │   │   │   ├── Reviews.tsx
│   │   │   │   ├── OrderForm.tsx
│   │   │   │   ├── FAQ.tsx
│   │   │   │   └── Contacts.tsx
│   │   │   └── ui/
│   │   │       ├── Button.tsx
│   │   │       ├── Input.tsx
│   │   │       ├── Select.tsx
│   │   │       ├── Accordion.tsx
│   │   │       └── SectionHeading.tsx
│   │   ├── hooks/
│   │   │   ├── useInView.ts           # Intersection Observer для анимаций
│   │   │   └── useSubmitOrder.ts      # React Query мутация
│   │   ├── lib/
│   │   │   ├── api.ts                 # Fetch wrapper
│   │   │   └── analytics.ts           # Яндекс.Метрика хелперы
│   │   ├── data/
│   │   │   ├── products.ts            # Каталог продукции
│   │   │   ├── reviews.ts             # Отзывы
│   │   │   ├── faq.ts                 # FAQ
│   │   │   └── steps.ts              # Этапы работы
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css                  # Tailwind + кастомные стили
│   ├── index.html
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── orders.ts              # POST /api/orders
│   │   ├── services/
│   │   │   ├── telegram.ts            # Отправка в Telegram
│   │   │   └── calculator.ts          # Заглушка калькулятора
│   │   ├── middleware/
│   │   │   ├── rateLimiter.ts
│   │   │   └── validateBody.ts        # Zod-валидация body
│   │   ├── config/
│   │   │   └── env.ts                 # Загрузка и валидация env
│   │   ├── app.ts                     # Express setup
│   │   └── server.ts                  # Entry point
│   ├── tsconfig.json
│   ├── ecosystem.config.js            # PM2
│   └── package.json
├── nginx/
│   └── windowforlife.conf
├── .env.example
├── .gitignore
├── package.json                       # Root workspace
└── README.md
```

### 3.2 Потоки данных

```
[Пользователь] → заполняет форму → [React Frontend]
    → POST /api/orders (JSON) → [Express Backend]
        → Zod-валидация (shared-схема)
        → Форматирование сообщения
        → Telegram Bot API → [Telegram-канал/группа]
        → Ответ 200 OK → [Frontend: «Спасибо, мы свяжемся»]
```

### 3.3 Задел под калькулятор

Файл `backend/src/services/calculator.ts` — заглушка с типизированным интерфейсом:

```typescript
export interface CalculationInput {
  constructionType: string;
  width: number;
  height: number;
  profileSystem: string;
  sashCount: number;
  sashTypes: string[];
}

export interface CalculationResult {
  estimatedPrice: number | null;  // null = расчёт не реализован
  breakdown: Record<string, number>;
  disclaimer: string;
}

export function calculatePrice(input: CalculationInput): CalculationResult {
  // TODO: реализовать логику расчёта
  return {
    estimatedPrice: null,
    breakdown: {},
    disclaimer: "Точную стоимость рассчитает менеджер после замера"
  };
}
```

---

## 4. Секции лендинга (детальное описание)

Порядок секций сверху вниз:

### 4.1 Header (фиксированный)
- Логотип: текстовый «WindowForLife» (без графического логотипа)
- Навигация: Продукция · О нас · Как мы работаем · Галерея · Отзывы · FAQ · Контакты
- CTA-кнопка: «Заказать замер» → smooth scroll к `#order-form`
- Телефон: кликабельный `<a href="tel:...">`, значение из `VITE_COMPANY_PHONE`
- Мобиль: бургер-меню → drawer с плавной анимацией (Framer Motion)
- При скролле: добавить `backdrop-blur` + лёгкую тень (переключение по `scroll > 50px`)

### 4.2 Hero
- **H1** (единственный на странице): содержит «окна ПВХ», «алюминиевые конструкции», «производство и монтаж» — для SEO
- Подзаголовок: акцент на собственном производстве и бесплатном замере
- CTA: «Бесплатный замер» → scroll к `#order-form`
- Фон: изображение (современный интерьер с панорамным остеклением) + gradient overlay для читаемости
- Анимация: fade-in + slide-up при загрузке страницы

### 4.3 Продукция (Products)
- Переключатель-табы: «Окна ПВХ» | «Алюминиевые конструкции»
- **Окна ПВХ** → карточки: Knipping (премиум), KBE (оптимальный)
- **Алюминий** → карточки: Provedal C640 (раздвижная), Provedal P400 (распашная), Фасадный алюминий
- Каждая карточка: изображение, название, описание (2-3 предложения), типы конструкций
- CTA внизу секции: «Рассчитать стоимость» → `#order-form`

### 4.4 О нас (About)
- Текст о компании: собственное производство, контроль качества, опыт
- 3 числовых блока с анимацией count-up: «N+ проектов», «N лет опыта», «N км — зона доставки»
- Числа — placeholder, заказчик заменит

### 4.5 Как мы работаем (HowWeWork)
- 5 шагов, горизонтальный timeline (desktop) / вертикальный (mobile):
  1. **Заявка** — оставляете заявку на сайте или по телефону
  2. **Замер** — мастер приезжает бесплатно в удобное время
  3. **Расчёт** — подбираем решение, согласуем смету
  4. **Производство** — изготавливаем на собственном производстве
  5. **Монтаж** — доставляем бесплатно, устанавливаем с гарантией
- Иконки для каждого шага: SVG или Lucide React

### 4.6 Галерея (Gallery)
- Swiper-карусель с фото выполненных работ
- Lightbox при клике (увеличение)
- Минимум 6 placeholder-изображений (свободная лицензия)
- Подписи: тип конструкции, профиль

### 4.7 Форма заявки (OrderForm) — КЛЮЧЕВОЙ БЛОК
- Якорь: `id="order-form"`
- Заголовок H2: «Рассчитать стоимость и заказать бесплатный замер»

**Поля формы:**

| Поле | Тип элемента | Обязательное | Валидация |
|---|---|---|---|
| Тип конструкции | Select | Да | enum: «Балконный блок», «Одностворчатое окно», «Двухстворчатое окно», «Трёхстворчатое окно» |
| Профильная система | Select | Да | enum: «Knipping», «KBE», «Provedal C640», «Provedal P400», «Фасадный алюминий» |
| Ширина (мм) | Number input | Да | min: 300, max: 5000, integer |
| Высота (мм) | Number input | Да | min: 300, max: 3000, integer |
| Количество створок | Number input | Да | min: 1, max: 6, integer |
| Тип створок | Чекбоксы (multi) | Да | enum: «Глухая», «Поворотная», «Поворотно-откидная», «Раздвижная» |
| Имя | Text input | Да | min: 2, max: 50 |
| Фамилия | Text input | Да | min: 2, max: 50 |
| Телефон | Tel input + маска | Да | формат +7 (___) ___-__-__ |
| Комментарий | Textarea | Нет | max: 500 |

- Чекбокс согласия на обработку ПД (обязательный)
- Кнопка: «Отправить заявку»
- Успех: анимированное «Спасибо! Мы свяжемся с вами в ближайшее время»
- Ошибка: «Не удалось отправить заявку. Позвоните нам: {телефон}»
- Аналитика: `ym(ID, 'reachGoal', 'order_submitted')` при успехе

### 4.8 Отзывы (Reviews)
- Swiper-карусель с карточками
- Карточка: имя, текст, рейтинг (звёзды 1-5), тип работ
- 4-6 placeholder-отзывов

### 4.9 FAQ
- Аккордеон (раскрывающийся)
- 6-8 вопросов: сроки, гарантия, оплата, зимний монтаж, процесс замера, окна без монтажа
- JSON-LD разметка FAQPage

### 4.10 Контакты (Contacts)
- Телефон (`tel:` ссылка), email (`mailto:`), часы работы, адрес — всё из env
- Яндекс.Карта (react-yandex-maps) с меткой по координатам из env
- CTA: «Позвонить» (на мобиле — нативный звонок)

### 4.11 Footer
- Логотип, навигация (дубль хедера), контакты
- Ссылка на политику конфиденциальности (модальное окно или отдельная страница)
- © {текущий год} WindowForLife

---

## 5. API-контракт

### 5.1 POST /api/orders

**Request body:**
```json
{
  "constructionType": "Двухстворчатое окно",
  "profileSystem": "KBE",
  "width": 1400,
  "height": 1300,
  "sashCount": 2,
  "sashTypes": ["Глухая", "Поворотно-откидная"],
  "firstName": "Иван",
  "lastName": "Иванов",
  "phone": "+7 (999) 123-45-67",
  "comment": "Замер в субботу утром"
}
```

**Response 200:**
```json
{ "success": true, "message": "Заявка успешно отправлена" }
```

**Response 400 (валидация):**
```json
{ "success": false, "errors": [{ "field": "phone", "message": "Некорректный номер телефона" }] }
```

**Response 429 (rate limit):**
```json
{ "success": false, "message": "Слишком много запросов, попробуйте позже" }
```

**Response 500:**
```json
{ "success": false, "message": "Внутренняя ошибка сервера" }
```

### 5.2 Формат Telegram-сообщения

```
🪟 Новая заявка с сайта WindowForLife

📋 Тип конструкции: Двухстворчатое окно
🏭 Профильная система: KBE
📐 Размеры: 1400 × 1300 мм
🚪 Створки: 2 шт. (Глухая, Поворотно-откидная)

👤 Клиент: Иван Иванов
📞 Телефон: +7 (999) 123-45-67
💬 Комментарий: Замер в субботу утром

📅 Дата: 2026-03-13 14:30:00 MSK
```

### 5.3 Rate Limiting
- 5 заявок с одного IP за 15 минут
- При превышении: HTTP 429

---

## 6. SEO-оптимизация

### 6.1 Технический SEO
- Семантический HTML: один `<h1>` в Hero, `<h2>` для секций, `<h3>` для подзаголовков
- Мета-теги: title, description, keywords, canonical, og:title, og:description, og:image, og:url, twitter:card
- `robots.txt` — разрешить индексацию, указать sitemap
- `sitemap.xml` — одна страница (для SPA)
- JSON-LD: Organization, LocalBusiness, FAQPage, Product
- Alt-тексты с ключевыми словами для всех изображений
- Lazy loading: `loading="lazy"` для изображений ниже first screen
- Preload: шрифты и hero-изображение

### 6.2 SEO-контент (скрытая география — не отображать явно)
- В мета-тегах и JSON-LD: зона обслуживания — Московская область, Ступинский район, радиус 100 км
- В текстах (естественно, без переспама): Ступино, Кашира, Серпухов, Чехов, Домодедово, Подольск
- LocalBusiness JSON-LD: адрес (из env), GeoCircle с radius 100km
- Ключевые слова: окна ПВХ Ступино, алюминиевые конструкции Московская область, остекление балконов, замена окон, Knipping окна, KBE окна, Provedal остекление

### 6.3 Core Web Vitals
- Целевые: LCP < 2.5s, FID < 100ms, CLS < 0.1
- WebP + JPEG-fallback, srcset
- Vite code splitting (автоматически)
- `font-display: swap`, preload шрифтов
- Gzip/Brotli через Nginx

---

## 7. Дизайн-система

### 7.1 Стиль и принципы

**ВАЖНО ДЛЯ АГЕНТА:** Перед написанием любого фронтенд-кода прочитай файл `/mnt/skills/public/frontend-design/SKILL.md`. Этот skill содержит принципы создания запоминающегося UI без типичной AI-эстетики.

Ориентиры (adaline.ai, ionic.io):
- Обилие воздуха (whitespace), чистый светлый фон
- Крупная, выразительная типографика
- Плавные анимации при скролле (fade in, slide up) через Framer Motion
- Скруглённые углы (12–16px)
- Тонкие тени для карточек
- Accent-цвет: оттенок синего/голубого (ассоциация с небом, стеклом, окнами)
- Минимум визуального шума

### 7.2 Типографика
- Заголовки: характерный sans-serif (НЕ Inter, НЕ Roboto — выбрать на Google Fonts что-то с характером, например Outfit, Satoshi, General Sans, или аналог). Weight 600–700, крупные размеры.
- Тело: чистый sans-serif, weight 400, base 16–18px, line-height 1.6
- Агент сам подбирает шрифтовую пару, следуя принципам из frontend-design skill

### 7.3 Цветовая палитра
- Агент создаёт палитру через CSS-переменные в `index.css`
- Основа: светлый фон + тёмный текст
- Accent: синий/голубой оттенок (1 primary + 1 secondary)
- Semantic: success (зелёный), error (красный), warning (жёлтый)
- Все цвета — через `var(--color-...)` для единообразия

### 7.4 Адаптивность
- Mobile-first
- Breakpoints Tailwind: sm(640), md(768), lg(1024), xl(1280)
- Мобильная навигация: бургер → drawer
- Формы: полноширинные на мобиле
- Таргет: корректность от 320px до 1920px

---

## 8. Аналитика

### 8.1 Яндекс.Метрика
- Подключение: `<script>` в `index.html`, ID из `VITE_YANDEX_METRIKA_ID`
- Цели:
  - `order_form_opened` — скролл до формы / клик CTA
  - `order_submitted` — успешная отправка заявки
  - `phone_clicked` — клик по телефону
  - `cta_hero_click` — клик CTA в Hero
- Хелпер `analytics.ts`:
  ```typescript
  export function reachGoal(goal: string) {
    if (typeof window.ym === 'function') {
      window.ym(Number(import.meta.env.VITE_YANDEX_METRIKA_ID), 'reachGoal', goal);
    }
  }
  ```

---

## 9. Безопасность

- `.env` в `.gitignore`
- HTTPS обязательно (Let's Encrypt / Beget SSL)
- CORS: только `CORS_ORIGIN` из env
- Helmet.js: security headers
- Rate limiting: 5 req / 15 min на `/api/orders` с одного IP
- Валидация: Zod shared-схема на фронте И бэке
- Санитизация: экранирование HTML/Markdown перед отправкой в Telegram
- CSRF: SameSite cookies, Origin/Referer проверка
- Telegram Bot Token: только на сервере

---

## 10. Переменные окружения (Secrets)

### 10.1 Файл `.env.example`

```env
# ===== TELEGRAM =====
TELEGRAM_BOT_TOKEN=__ЗАПОЛНИТЬ__          # Токен бота (@BotFather)
TELEGRAM_CHAT_ID=__ЗАПОЛНИТЬ__            # ID чата/канала для заявок

# ===== ЯНДЕКС.МЕТРИКА =====
VITE_YANDEX_METRIKA_ID=__ЗАПОЛНИТЬ__      # ID счётчика

# ===== ЯНДЕКС.КАРТЫ =====
VITE_YANDEX_MAPS_API_KEY=__ЗАПОЛНИТЬ__    # API-ключ JavaScript API

# ===== КОНТАКТНЫЕ ДАННЫЕ =====
VITE_COMPANY_PHONE=__ЗАПОЛНИТЬ__          # +7 (495) 123-45-67
VITE_COMPANY_EMAIL=__ЗАПОЛНИТЬ__          # info@windowforlife.ru
VITE_COMPANY_WORK_HOURS=__ЗАПОЛНИТЬ__     # Пн-Сб 9:00–19:00
VITE_COMPANY_ADDRESS=__ЗАПОЛНИТЬ__        # Полный адрес

# ===== СЕРВЕР =====
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://windowforlife.ru

# ===== КООРДИНАТЫ ДЛЯ КАРТЫ =====
VITE_MAP_LATITUDE=54.9468                  # Широта (Алеево)
VITE_MAP_LONGITUDE=38.1268                 # Долгота (Алеево)
```

### 10.2 Правило: `VITE_` = фронтенд, без префикса = только бэкенд

### 10.3 Сводная таблица

| Переменная | Где | Заполняет |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | backend → telegram.ts | Заказчик |
| `TELEGRAM_CHAT_ID` | backend → telegram.ts | Заказчик |
| `VITE_YANDEX_METRIKA_ID` | frontend → index.html, analytics.ts | Заказчик |
| `VITE_YANDEX_MAPS_API_KEY` | frontend → Contacts.tsx | Заказчик |
| `VITE_COMPANY_PHONE` | frontend → Header, Footer, Contacts | Заказчик |
| `VITE_COMPANY_EMAIL` | frontend → Footer, Contacts | Заказчик |
| `VITE_COMPANY_WORK_HOURS` | frontend → Contacts | Заказчик |
| `VITE_COMPANY_ADDRESS` | frontend → Contacts, JSON-LD | Заказчик |
| `VITE_MAP_LATITUDE` | frontend → Contacts (карта) | Заказчик |
| `VITE_MAP_LONGITUDE` | frontend → Contacts (карта) | Заказчик |
| `PORT` | backend → server.ts | По умолчанию 3001 |
| `CORS_ORIGIN` | backend → app.ts | По умолчанию https://windowforlife.ru |

---

## 11. Контент-заглушки

### 11.1 Изображения
- Источники: Unsplash, Pexels, Pixabay (свободная коммерческая лицензия)
- Hero: современный интерьер с большими окнами
- Продукты: ПВХ-окна, алюминиевые конструкции, профили
- Галерея: остеклённые балконы, панорамные окна, фасады
- Формат: WebP + JPEG fallback, оптимизация, srcset

### 11.2 Тексты
- Описания продуктов: по реальным характеристикам Knipping, KBE, Provedal
- Отзывы: 4-6 шт., пометить `// PLACEHOLDER: заменить на реальные отзывы`
- FAQ: 6-8 вопросов, типичных для оконных компаний
- О компании: общий текст, числа — placeholder

---

## 12. Деплой

### 12.1 Требования
- Node.js 20+, Nginx, PM2, SSL-сертификат

### 12.2 Команды сборки и запуска

```bash
git clone <repo> && cd windowforlife
npm install
cp .env.example .env && nano .env      # заполнить секреты
cd frontend && npm run build            # → frontend/dist/
cd ../backend && npm run build          # → backend/dist/
pm2 start ecosystem.config.js
pm2 save && pm2 startup
```

### 12.3 Nginx-конфигурация

```nginx
server {
    listen 443 ssl http2;
    server_name windowforlife.ru www.windowforlife.ru;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /path/to/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
}

server {
    listen 80;
    server_name windowforlife.ru www.windowforlife.ru;
    return 301 https://$host$request_uri;
}
```

---

## 13. Чеклист приёмки (Definition of Done)

- [ ] Все 9 секций + Header + Footer реализованы и рендерятся
- [ ] Форма валидирует данные на фронте и бэке (Zod shared)
- [ ] Заявка отправляется в Telegram (формат из п.5.2)
- [ ] Яндекс.Карта с меткой в блоке контактов
- [ ] Яндекс.Метрика подключена, 4 цели срабатывают
- [ ] Адаптивность: 320px–1920px без горизонтального скролла
- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 90
- [ ] JSON-LD: Organization, LocalBusiness, FAQPage, Product — валидны
- [ ] robots.txt + sitemap.xml на месте
- [ ] Rate limiting работает (429 при > 5 req / 15 min)
- [ ] `.env.example` полный, README.md с инструкцией деплоя
- [ ] Нет console.log в production
- [ ] Все изображения: свободная лицензия, WebP, оптимизированы
- [ ] Анимации плавные, без просадок FPS
- [ ] Политика конфиденциальности (шаблон) присутствует
- [ ] `npm run build` проходит без ошибок (фронт + бэк)

---

## 14. Детализация фаз для плана Opus

Ниже — ориентиры для Opus при составлении плана. Opus должен раскрыть каждую фазу до уровня конкретных файлов, интерфейсов и инструкций.

### Фаза 1: Фундамент
**Scope:** Инициализация монорепо, все конфиги, shared-пакет, .env

**Ожидаемые файлы:**
- `package.json` (root, workspaces)
- `packages/shared/` (package.json, tsconfig.json, src/schemas/order.schema.ts, src/types/order.types.ts)
- `frontend/` (package.json, tsconfig.json, vite.config.ts, tailwind.config.ts, index.html, src/main.tsx, src/App.tsx, src/index.css)
- `backend/` (package.json, tsconfig.json, ecosystem.config.js)
- `.env.example`, `.gitignore`

**Opus должен определить:**
- Точную Zod-схему order.schema.ts (все поля, enum-ы, валидации)
- TypeScript-типы, выведенные из Zod-схемы (`z.infer<typeof orderSchema>`)
- Настройки Tailwind: extend с кастомными цветами, шрифтами, анимациями
- Содержимое vite.config.ts (alias @shared, proxy для /api в dev)

**Критерий проверки:** `npm install` проходит без ошибок. `cd frontend && npm run dev` открывает пустую страницу на localhost:5173.

---

### Фаза 2: Бэкенд
**Scope:** Express-сервер, полностью рабочий API

**Ожидаемые файлы:**
- `backend/src/config/env.ts`
- `backend/src/app.ts`
- `backend/src/server.ts`
- `backend/src/routes/orders.ts`
- `backend/src/services/telegram.ts`
- `backend/src/services/calculator.ts`
- `backend/src/middleware/rateLimiter.ts`
- `backend/src/middleware/validateBody.ts`

**Opus должен определить:**
- Как env.ts загружает и валидирует переменные (Zod-схема env)
- Точную конфигурацию Express (middleware chain: json → cors → helmet → compression → routes)
- Формат Telegram-сообщения (шаблонная строка)
- Как telegram.ts обрабатывает ошибки API (retry? log? fallback?)
- Rate limiter config

**Критерий проверки:** `cd backend && npm run dev` запускает сервер. `curl -X POST localhost:3001/api/orders -H 'Content-Type: application/json' -d '{...}'` возвращает 200 (или 400 при невалидных данных). Сообщение приходит в Telegram (если токен и chat_id настроены).

---

### Фаза 3: UI-кит и каркас
**Scope:** Дизайн-система, переиспользуемые компоненты, Layout, App.tsx со всеми секциями-заглушками

**ОБЯЗАТЕЛЬНО:** Агент читает `/mnt/skills/public/frontend-design/SKILL.md` перед началом.

**Ожидаемые файлы:**
- `frontend/src/index.css` (CSS variables, Tailwind директивы, @font-face)
- `frontend/src/components/ui/Button.tsx`
- `frontend/src/components/ui/Input.tsx`
- `frontend/src/components/ui/Select.tsx`
- `frontend/src/components/ui/Accordion.tsx`
- `frontend/src/components/ui/SectionHeading.tsx`
- `frontend/src/components/layout/Header.tsx`
- `frontend/src/components/layout/Footer.tsx`
- `frontend/src/components/layout/MobileMenu.tsx`
- `frontend/src/hooks/useInView.ts`
- `frontend/src/lib/api.ts`
- `frontend/src/lib/analytics.ts`
- `frontend/src/App.tsx` (все секции подключены как заглушки `<section id="...">Placeholder</section>`)

**Opus должен определить:**
- Props-интерфейсы для каждого UI-компонента
- Варианты Button (primary, secondary, outline; размеры sm, md, lg)
- Логику useInView (Intersection Observer threshold, rootMargin, once-флаг)
- API-клиент: base URL, обработка ошибок, типизация
- Анимации: какие именно Framer Motion variants для fade-in, slide-up

**Критерий проверки:** `npm run dev` показывает страницу с хедером (навигация, телефон, CTA), футером, и placeholder-секциями между ними. Бургер-меню работает. Хедер меняет стиль при скролле.

---

### Фаза 4: Секции верхней части
**Scope:** Hero, Products, About, HowWeWork — с реальным контентом, анимациями, адаптивностью

**Ожидаемые файлы:**
- `frontend/src/components/sections/Hero.tsx`
- `frontend/src/components/sections/Products.tsx`
- `frontend/src/components/sections/About.tsx`
- `frontend/src/components/sections/HowWeWork.tsx`
- `frontend/src/data/products.ts`
- `frontend/src/data/steps.ts`

**Opus должен определить:**
- Структуру данных products.ts (интерфейс Product, массив с описаниями)
- Структуру steps.ts (интерфейс Step, массив из 5 шагов)
- Как Products реализует табы (useState + conditional render или motion.AnimatePresence)
- Как About реализует count-up анимацию (useInView + requestAnimationFrame)
- Как HowWeWork рендерит timeline (CSS grid? flexbox? как меняется на мобиле?)

**Критерий проверки:** Все 4 секции рендерятся с контентом. Табы в Products переключаются. Числа в About анимируются при скролле. Timeline в HowWeWork адаптивен. Все CTA скроллят к `#order-form`.

---

### Фаза 5: Секции нижней части
**Scope:** Gallery, OrderForm, Reviews, FAQ, Contacts — с формой, каруселями, картой

**Ожидаемые файлы:**
- `frontend/src/components/sections/Gallery.tsx`
- `frontend/src/components/sections/OrderForm.tsx`
- `frontend/src/components/sections/Reviews.tsx`
- `frontend/src/components/sections/FAQ.tsx`
- `frontend/src/components/sections/Contacts.tsx`
- `frontend/src/hooks/useSubmitOrder.ts`
- `frontend/src/data/reviews.ts`
- `frontend/src/data/faq.ts`

**Opus должен определить:**
- OrderForm: точную связку React Hook Form + Zod resolver + shared-схема
- OrderForm: маска телефона — как реализовать (onChange handler? react-input-mask? кастомная логика?)
- OrderForm: состояния UI (idle → submitting → success → error), как рендерить каждое
- useSubmitOrder: React Query useMutation, onSuccess/onError, retry policy
- Gallery: Swiper config (slidesPerView, breakpoints, loop, autoplay?)
- Gallery: Lightbox — какая библиотека или кастомный? (рекомендую yet-another-react-lightbox)
- Reviews: Swiper config (другой от Gallery)
- FAQ: какие Framer Motion анимации для раскрытия аккордеона
- Contacts: как подключить react-yandex-maps (YMaps → Map → Placemark)

**Критерий проверки:** Форма отправляется, заявка приходит в Telegram. Ошибки валидации отображаются у полей. Галерея и отзывы листаются. FAQ раскрывается/сворачивается. Карта с меткой видна (при наличии API-ключа).

---

### Фаза 6: Финализация
**Scope:** SEO, аналитика, политика конфиденциальности, деплой-конфиги, README, production build

**Ожидаемые файлы:**
- `frontend/public/robots.txt`
- `frontend/public/sitemap.xml`
- `frontend/src/index.html` (мета-теги, JSON-LD, Яндекс.Метрика скрипт)
- Политика конфиденциальности (компонент или страница)
- `nginx/windowforlife.conf`
- `README.md` (инструкция по деплою)

**Opus должен определить:**
- Полный `<head>` с мета-тегами (title, description, OG, canonical)
- JSON-LD блоки: Organization, LocalBusiness (с GeoCircle), FAQPage, Product
- Скрипт Яндекс.Метрики с ID из env
- Где вызывать `reachGoal` для каждой цели (какой компонент, какой обработчик)
- Содержимое robots.txt и sitemap.xml
- Текст политики конфиденциальности (шаблонный)
- README: полная инструкция деплоя на Beget

**Критерий проверки:** `npm run build` (фронт + бэк) без ошибок. Lighthouse ≥ 90/90/90. JSON-LD валиден. robots.txt и sitemap.xml доступны. README полный.

---

## Приложение A: Промпт для Opus (планирование)

```
Ты — архитектор проекта. Прочитай спецификацию ниже и составь детальный план реализации из 6 фаз.

Для каждой фазы укажи:
1. Полный список файлов с путями
2. TypeScript-интерфейсы, типы, Zod-схемы — в виде готового кода
3. npm-пакеты для установки (точные команды npm install)
4. Зависимости от предыдущих фаз (какие файлы импортируются)
5. Детали реализации на уровне псевдокода: не «сделать компонент», а «компонент принимает props X, использует хук Y, рендерит Z, анимация через Framer Motion variant W»
6. Критерии проверки: что должно работать после фазы

Уровень детализации: план должен быть достаточным, чтобы разработчик средней квалификации мог реализовать проект без дополнительных вопросов.

Не пиши готовый код реализации — только интерфейсы, схемы, структуры данных, конфиги и псевдокод. Готовый код будет писать исполнитель.

[СПЕЦИФИКАЦИЯ]
{вставить содержимое этого файла}
```

## Приложение B: Шаблон промпта для Sonnet (исполнение фазы)

```
Ты — исполнитель проекта WindowForLife. Работаешь по плану архитектора.

Правила:
- Следуй плану точно. Не меняй архитектуру, интерфейсы, структуру файлов.
- Если что-то не определено в плане — реализуй по best practice, оставь комментарий // TODO: уточнить у архитектора
- Перед написанием фронтенд-кода прочитай: /mnt/skills/public/frontend-design/SKILL.md
- После создания файлов — проверяй компиляцию (npm run build / npm run dev)
- Контент-заглушки помечай: // PLACEHOLDER: заменить на реальные данные
- Все значения из .env используй через import.meta.env (фронт) / process.env (бэк)
- Никогда не хардкодь секреты

Текущая фаза: {N} из 6
Описание фазы: {описание из плана}
Файлы к созданию: {список из плана}

[ПЛАН ФАЗЫ]
{вставить детали фазы из плана Opus}
```
