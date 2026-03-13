import { Router, Request, Response } from 'express';
import { orderInputSchema } from '@windowforlife/shared';
import { ordersRateLimiter } from '../middleware/rateLimiter';
import { validateBody } from '../middleware/validateBody';
import { sendOrderNotification } from '../services/telegram';
import type { OrderInput } from '@windowforlife/shared';

const router = Router();

router.post(
  '/',
  ordersRateLimiter,
  validateBody(orderInputSchema),
  async (req: Request, res: Response): Promise<void> => {
    const order = req.body as OrderInput;

    try {
      await sendOrderNotification(order);

      res.status(200).json({
        success: true,
        message: 'Заявка успешно отправлена',
      });
    } catch (error) {
      console.error('Ошибка обработки заявки:', error);

      res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера. Пожалуйста, позвоните нам.',
      });
    }
  },
);

export default router;
