export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  caption: string;
}

// PLACEHOLDER: заменить на реальные фотографии выполненных работ
export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80&fit=crop',
    alt: 'Панорамное остекление гостиной — окна ПВХ Knipping',
    caption: 'Панорамное остекление, профиль Knipping',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=900&q=80&fit=crop',
    alt: 'Алюминиевое остекление балкона — Provedal C640',
    caption: 'Остекление балкона, Provedal C640',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80&fit=crop',
    alt: 'Двухстворчатое окно ПВХ — профиль KBE',
    caption: 'Двухстворчатое окно, профиль KBE',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80&fit=crop',
    alt: 'Фасадное алюминиевое остекление офисного здания',
    caption: 'Фасадное остекление, алюминиевый профиль',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=900&q=80&fit=crop',
    alt: 'Трёхстворчатое окно в гостиной — профиль Knipping',
    caption: 'Трёхстворчатое окно, профиль Knipping',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1541123020-4fc0e06a8a6a?w=900&q=80&fit=crop',
    alt: 'Остекление лоджии — алюминиевая система Provedal P400',
    caption: 'Остекление лоджии, Provedal P400',
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=900&q=80&fit=crop',
    alt: 'Балконный блок ПВХ — вид снаружи здания',
    caption: 'Балконный блок, профиль KBE',
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80&fit=crop',
    alt: 'Кухонное окно с монтажом подоконника',
    caption: 'Кухонное окно с подоконником, KBE',
  },
];
