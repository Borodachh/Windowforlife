import rateLimit from 'express-rate-limit';

export const ordersRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Слишком много запросов с вашего IP. Попробуйте позже.',
  },
  handler: (req, res, next, options) => {
    res.status(429).json(options.message);
  },
});
