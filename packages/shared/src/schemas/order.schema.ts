import { z } from 'zod';

export const constructionTypeEnum = z.enum([
  'Балконный блок',
  'Одностворчатое окно',
  'Двухстворчатое окно',
  'Трёхстворчатое окно',
]);

export const profileSystemEnum = z.enum([
  'Knipping',
  'KBE',
  'Provedal C640',
  'Provedal P400',
  'Фасадный алюминий',
]);

export const sashTypeEnum = z.enum([
  'Глухая',
  'Поворотная',
  'Поворотно-откидная',
  'Раздвижная',
]);

export const orderSchema = z.object({
  constructionType: constructionTypeEnum,
  profileSystem: profileSystemEnum,
  width: z.number().int().min(300, 'Минимум 300 мм').max(5000, 'Максимум 5000 мм'),
  height: z.number().int().min(300, 'Минимум 300 мм').max(3000, 'Максимум 3000 мм'),
  sashCount: z.number().int().min(1, 'Минимум 1 створка').max(6, 'Максимум 6 створок'),
  sashTypes: z.array(sashTypeEnum).min(1, 'Выберите хотя бы один тип створки'),
  firstName: z.string().min(2, 'Минимум 2 символа').max(50, 'Максимум 50 символов'),
  lastName: z.string().min(2, 'Минимум 2 символа').max(50, 'Максимум 50 символов'),
  phone: z
    .string()
    .regex(/^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/, 'Формат: +7 (999) 999-99-99'),
  comment: z.string().max(500, 'Максимум 500 символов').optional(),
  consent: z
    .boolean()
    .refine((v) => v === true, 'Необходимо согласие на обработку персональных данных'),
});

// Для бэкенда — без поля consent
export const orderInputSchema = orderSchema.omit({ consent: true });

export type OrderData = z.infer<typeof orderSchema>;
export type OrderInput = z.infer<typeof orderInputSchema>;
