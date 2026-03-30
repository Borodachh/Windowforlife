import TelegramBot from 'node-telegram-bot-api';
import { env } from '../config/env';
import { PRODUCT_SPECS } from '@windowforlife/shared';
import type { OrderInput, ConstructionData } from '@windowforlife/shared';

let bot: TelegramBot | null = null;

function getBot(): TelegramBot {
  if (!bot) {
    bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN, { polling: false });
  }
  return bot;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  const parts = new Intl.DateTimeFormat('ru-RU', options).formatToParts(now);
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second} MSK`;
}

function formatConstruction(c: ConstructionData, index: number): string {
  const spec = PRODUCT_SPECS[c.profileSystem];
  const lines: string[] = [
    `📦 <b>Конструкция ${index + 1}:</b>`,
    `  🏭 Профиль: ${escapeHtml(c.profileSystem)}`,
    `  📋 Тип: ${escapeHtml(c.constructionType)}`,
  ];

  if (spec?.requiresDimensions) {
    if (c.width != null && c.height != null) {
      lines.push(`  📐 Размеры: ${c.width} × ${c.height} мм`);
    }
    if (c.sashCount != null && c.sashTypes && c.sashTypes.length > 0) {
      const types = c.sashTypes.map(escapeHtml).join(', ');
      lines.push(`  🚪 Створки: ${c.sashCount} шт. (${types})`);
    }
  }

  return lines.join('\n');
}

function formatMessage(order: OrderInput): string {
  const constructionBlocks = order.constructions
    .map((c, i) => formatConstruction(c, i))
    .join('\n\n');

  const comment = order.comment
    ? `\n💬 <b>Комментарий:</b> ${escapeHtml(order.comment)}`
    : '';

  return [
    '🪟 <b>Новая заявка с сайта WindowForLife</b>',
    '',
    constructionBlocks,
    '',
    `👤 <b>Клиент:</b> ${escapeHtml(order.firstName)} ${escapeHtml(order.lastName)}`,
    `📞 <b>Телефон:</b> ${escapeHtml(order.phone)}`,
    comment,
    '',
    `📅 <b>Дата:</b> ${formatDate()}`,
  ]
    .filter((line) => line !== undefined)
    .join('\n');
}

const TELEGRAM_TIMEOUT = 10_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Telegram API не ответил за ${ms}мс`)), ms),
    ),
  ]);
}

export async function sendOrderNotification(order: OrderInput): Promise<void> {
  const message = formatMessage(order);

  try {
    await withTimeout(
      getBot().sendMessage(env.TELEGRAM_CHAT_ID, message, { parse_mode: 'HTML' }),
      TELEGRAM_TIMEOUT,
    );
  } catch (error) {
    console.error('Ошибка отправки в Telegram:', error);
    throw new Error('Не удалось отправить уведомление в Telegram');
  }
}
