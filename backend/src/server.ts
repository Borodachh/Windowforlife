import app from './app';
import { env } from './config/env';

const server = app.listen(env.PORT, () => {
  console.log(`✅ Сервер запущен на порту ${env.PORT} (${env.NODE_ENV})`);
});

function gracefulShutdown(signal: string) {
  console.log(`\n⏳ Получен ${signal}, завершаю работу...`);
  server.close(() => {
    console.log('✅ Сервер остановлен');
    process.exit(0);
  });

  // Принудительное завершение через 10 секунд
  setTimeout(() => {
    console.error('❌ Принудительное завершение по таймауту');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
