import app from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.log(`✅ Сервер запущен на порту ${env.PORT} (${env.NODE_ENV})`);
});
