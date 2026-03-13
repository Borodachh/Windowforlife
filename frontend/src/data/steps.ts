import {
  ClipboardList,
  Ruler,
  Calculator,
  Factory,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export interface Step {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const steps: Step[] = [
  {
    id: 1,
    title: 'Заявка',
    description: 'Оставляете заявку на сайте или по телефону — это бесплатно и ни к чему не обязывает.',
    icon: ClipboardList,
  },
  {
    id: 2,
    title: 'Замер',
    description: 'Мастер приезжает бесплатно в удобное для вас время, замеряет проёмы и консультирует.',
    icon: Ruler,
  },
  {
    id: 3,
    title: 'Расчёт',
    description: 'Подбираем оптимальное решение под ваш бюджет, согласуем смету — без скрытых наценок.',
    icon: Calculator,
  },
  {
    id: 4,
    title: 'Производство',
    description: 'Изготавливаем конструкции на собственном производстве с контролем качества на каждом этапе.',
    icon: Factory,
  },
  {
    id: 5,
    title: 'Монтаж',
    description: 'Доставляем бесплатно, устанавливаем профессионально. Гарантия на работу и материалы.',
    icon: Wrench,
  },
];
