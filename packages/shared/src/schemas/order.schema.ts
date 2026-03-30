import { z } from 'zod';
import { PRODUCT_SPECS, FIXED_SASH_COUNTS, DOOR_CONFIG } from './product-specs';

export const constructionTypeEnum = z.enum([
  'Дверь',
  'Одностворчатое окно',
  'Двухстворчатое окно',
  'Трёхстворчатое окно',
  'Четырёхстворчатое окно',
  'Раздвижная система',
  'Распашная система',
  'Фасадное остекление',
  'Витраж',
  'Зимний сад',
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

export const constructionSchema = z
  .object({
    profileSystem: profileSystemEnum,
    constructionType: constructionTypeEnum,
    width: z.number().int().optional(),
    height: z.number().int().optional(),
    sashCount: z.number().int().optional(),
    sashTypes: z.array(sashTypeEnum).optional(),
  })
  .superRefine((data, ctx) => {
    const spec = PRODUCT_SPECS[data.profileSystem];
    if (!spec) return;

    // Validate constructionType against allowed types
    if (!spec.allowedConstructionTypes.includes(data.constructionType)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Тип «${data.constructionType}» недоступен для профиля «${data.profileSystem}»`,
        path: ['constructionType'],
      });
    }

    if (!spec.requiresDimensions) return;

    const isDoor = data.constructionType === 'Дверь';
    const fixedCount = FIXED_SASH_COUNTS[data.constructionType];

    // Width required & in range
    if (data.width == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Укажите ширину',
        path: ['width'],
      });
    } else if (spec.width && (data.width < spec.width.min || data.width > spec.width.max)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Ширина: от ${spec.width.min} до ${spec.width.max} мм`,
        path: ['width'],
      });
    }

    // Height required & in range
    if (data.height == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Укажите высоту',
        path: ['height'],
      });
    } else if (spec.height && (data.height < spec.height.min || data.height > spec.height.max)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Высота: от ${spec.height.min} до ${spec.height.max} мм`,
        path: ['height'],
      });
    }

    // Sash count validation
    if (fixedCount !== undefined) {
      // Fixed sash count from construction type name — accept matching value or undefined
      if (data.sashCount != null && data.sashCount !== fixedCount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Для «${data.constructionType}» количество створок: ${fixedCount}`,
          path: ['sashCount'],
        });
      }
    } else if (isDoor) {
      // Door: 1–2 sashes
      if (data.sashCount == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Укажите количество створок',
          path: ['sashCount'],
        });
      } else if (data.sashCount < DOOR_CONFIG.minSashes || data.sashCount > DOOR_CONFIG.maxSashes) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Для двери: от ${DOOR_CONFIG.minSashes} до ${DOOR_CONFIG.maxSashes} створок`,
          path: ['sashCount'],
        });
      }
    } else {
      // General case — use profile spec range
      if (data.sashCount == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Укажите количество створок',
          path: ['sashCount'],
        });
      } else if (spec.sashCount && (data.sashCount < spec.sashCount.min || data.sashCount > spec.sashCount.max)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Створки: от ${spec.sashCount.min} до ${spec.sashCount.max}`,
          path: ['sashCount'],
        });
      }
    }

    // Sash types validation
    const effectiveSashTypes = isDoor ? DOOR_CONFIG.allowedSashTypes : spec.allowedSashTypes;

    if (!data.sashTypes || data.sashTypes.length === 0) {
      // For fixed sash types (door with single option), accept undefined
      if (isDoor) {
        // OK — frontend auto-sets, backend can default
      } else {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Выберите хотя бы один тип створки',
          path: ['sashTypes'],
        });
      }
    } else {
      for (const st of data.sashTypes) {
        if (!effectiveSashTypes.includes(st)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Тип створки «${st}» недоступен для ${isDoor ? 'двери' : `профиля «${data.profileSystem}»`}`,
            path: ['sashTypes'],
          });
        }
      }
    }
  });

export const orderSchema = z.object({
  constructions: z.array(constructionSchema).min(1, 'Добавьте хотя бы одну конструкцию').max(5, 'Максимум 5 конструкций'),
  firstName: z
    .string()
    .min(2, 'Минимум 2 символа')
    .max(50, 'Максимум 50 символов')
    .regex(/^[а-яА-ЯёЁa-zA-Z\s\-']+$/, 'Допустимы только буквы, пробелы и дефисы'),
  lastName: z
    .string()
    .min(2, 'Минимум 2 символа')
    .max(50, 'Максимум 50 символов')
    .regex(/^[а-яА-ЯёЁa-zA-Z\s\-']+$/, 'Допустимы только буквы, пробелы и дефисы'),
  phone: z.string().regex(/^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/, 'Формат: +7 (999) 999-99-99'),
  comment: z.string().max(500, 'Максимум 500 символов').optional(),
  consent: z
    .boolean()
    .refine((v) => v === true, 'Необходимо согласие на обработку персональных данных'),
});

// Для бэкенда — без поля consent
export const orderInputSchema = orderSchema.omit({ consent: true });

export type OrderData = z.infer<typeof orderSchema>;
export type OrderInput = z.infer<typeof orderInputSchema>;
export type ConstructionData = z.infer<typeof constructionSchema>;
