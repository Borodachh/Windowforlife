import path from 'path';
import dotenv from 'dotenv';

// Загружаем .env из корня монорепо
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
import { z } from 'zod';

const envSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string().min(1, 'TELEGRAM_BOT_TOKEN обязателен'),
  TELEGRAM_CHAT_ID: z.string().min(1, 'TELEGRAM_CHAT_ID обязателен'),
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
});

function loadEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const missing = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    console.error(`❌ Ошибка конфигурации .env:\n${missing}`);
    console.error('\nСкопируйте .env.example в .env и заполните значения.');
    process.exit(1);
  }

  return result.data;
}

export const env = loadEnv();
