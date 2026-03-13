import TelegramBot from 'node-telegram-bot-api';
import { env } from '../config/env';
import type { OrderInput } from '@windowforlife/shared';

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

function formatMessage(order: OrderInput): string {
  const sashTypes = order.sashTypes.map(escapeHtml).join(', ');
  const comment = order.comment
    ? `\n💬 <b>Комментарий:</b> ${escapeHtml(order.comment)}`
    : '';

  return [
    '🪟 <b>Новая заявка с сайта WindowForLife</b>',
    '',
    `📋 <b>Тип конструкции:</b> ${escapeHtml(order.constructionType)}`,
    `🏭 <b>Профильная система:</b> ${escapeHtml(order.profileSystem)}`,
    `📐 <b>Размеры:</b> ${order.width} × ${order.height} мм`,
    `🚪 <b>Створки:</b> ${order.sashCount} шт. (${sashTypes})`,
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

export async function sendOrderNotification(order: OrderInput): Promise<void> {
  const message = formatMessage(order);

  try {
    await getBot().sendMessage(env.TELEGRAM_CHAT_ID, message, {
      parse_mode: 'HTML',
    });
  } catch (error) {
    console.error('Ошибка отправки в Telegram:', error);
    throw new Error('Не удалось отправить уведомление в Telegram');
  }
}
