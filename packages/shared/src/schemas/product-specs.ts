export interface ProductSpec {
  category: 'pvc' | 'aluminum' | 'facade';
  allowedConstructionTypes: string[];
  allowedSashTypes: string[];
  requiresDimensions: boolean;
  width?: { min: number; max: number };
  height?: { min: number; max: number };
  sashCount?: { min: number; max: number };
}

/** Типы конструкций, в названии которых уже заложено количество створок */
export const FIXED_SASH_COUNTS: Record<string, number> = {
  'Одностворчатое окно': 1,
  'Двухстворчатое окно': 2,
  'Трёхстворчатое окно': 3,
  'Четырёхстворчатое окно': 4,
};

/** Ограничения для типа «Дверь» (применяются во всех профилях) */
export const DOOR_CONFIG = {
  minSashes: 1,
  maxSashes: 2,
  allowedSashTypes: ['Поворотная'] as string[],
};

export const PRODUCT_SPECS: Record<string, ProductSpec> = {
  KBE: {
    category: 'pvc',
    allowedConstructionTypes: [
      'Дверь',
      'Одностворчатое окно',
      'Двухстворчатое окно',
      'Трёхстворчатое окно',
      'Четырёхстворчатое окно',
    ],
    allowedSashTypes: ['Глухая', 'Поворотная', 'Поворотно-откидная'],
    requiresDimensions: true,
    width: { min: 500, max: 3000 },
    height: { min: 400, max: 2400 },
    sashCount: { min: 1, max: 4 },
  },
  Knipping: {
    category: 'pvc',
    allowedConstructionTypes: [
      'Дверь',
      'Одностворчатое окно',
      'Двухстворчатое окно',
      'Трёхстворчатое окно',
      'Четырёхстворчатое окно',
    ],
    allowedSashTypes: ['Глухая', 'Поворотная', 'Поворотно-откидная'],
    requiresDimensions: true,
    width: { min: 500, max: 3000 },
    height: { min: 400, max: 2400 },
    sashCount: { min: 1, max: 4 },
  },
  'Provedal C640': {
    category: 'aluminum',
    allowedConstructionTypes: ['Раздвижная система'],
    allowedSashTypes: ['Раздвижная'],
    requiresDimensions: true,
    width: { min: 600, max: 6000 },
    height: { min: 400, max: 1600 },
    sashCount: { min: 2, max: 4 },
  },
  'Provedal P400': {
    category: 'aluminum',
    allowedConstructionTypes: ['Дверь', 'Распашная система'],
    allowedSashTypes: ['Глухая', 'Поворотная'],
    requiresDimensions: true,
    width: { min: 350, max: 3000 },
    height: { min: 400, max: 2500 },
    sashCount: { min: 1, max: 4 },
  },
  'Фасадный алюминий': {
    category: 'facade',
    allowedConstructionTypes: ['Фасадное остекление', 'Витраж', 'Зимний сад'],
    allowedSashTypes: [],
    requiresDimensions: false,
  },
};
