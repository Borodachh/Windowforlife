import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Truck } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { useInView } from '../../hooks/useInView';

// PLACEHOLDER: заменить на реальные цифры
const stats = [
  { value: 1200, suffix: '+', label: 'завершённых проектов', icon: Award },
  { value: 12, suffix: ' лет', label: 'на рынке', icon: Shield },
  { value: 100, suffix: ' км', label: 'зона бесплатной доставки', icon: Truck },
];

const advantages = [
  {
    title: 'Собственное производство',
    description:
      'Изготавливаем конструкции на собственном заводе — без посредников. Полный контроль качества на каждом этапе: от нарезки профиля до финальной сборки.',
  },
  {
    title: 'Немецкое качество',
    description:
      'Используем профильные системы Knipping и KBE, алюминиевые конструкции Provedal. Вся продукция сертифицирована и соответствует российским стандартам.',
  },
  {
    title: 'Команда профессионалов',
    description:
      'Наши монтажники проходят регулярное обучение и аттестацию. Опыт работы — от стандартных квартирных окон до сложных фасадных систем.',
  },
];

function CountUp({ target, suffix, isActive }: { target: number; suffix: string; isActive: boolean }) {
  const [value, setValue] = useState(0);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!isActive || animatedRef.current) return;
    animatedRef.current = true;

    const duration = 2000;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isActive, target]);

  return (
    <span>
      {value}
      {suffix}
    </span>
  );
}

export function About() {
  const [sectionRef, isInView] = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-padding bg-white"
      aria-label="О компании"
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <SectionHeading
                title="О компании WindowForLife"
                subtitle="Мы производим и устанавливаем окна ПВХ и алюминиевые конструкции в Ступинском районе и по всей Московской области."
              />
            </motion.div>

            <div className="mt-8 flex flex-col gap-6">
              {advantages.map((adv, i) => (
                <motion.div
                  key={adv.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-1 rounded-full bg-gradient-to-b from-primary-500 to-accent shrink-0 mt-1" />
                  <div>
                    <p className="font-heading font-semibold text-gray-900 mb-1">{adv.title}</p>
                    <p className="text-gray-500 font-body text-sm leading-relaxed">
                      {adv.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: stats */}
          <div className="flex flex-col gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: 24 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.1 + i * 0.12 }}
                  className="flex items-center gap-6 p-6 rounded-2xl bg-surface-soft border border-gray-100"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center shrink-0">
                    <Icon size={24} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-4xl text-gray-900 tabular-nums leading-none mb-1">
                      <CountUp
                        target={stat.value}
                        suffix={stat.suffix}
                        isActive={isInView}
                      />
                    </p>
                    <p className="text-gray-500 font-body text-sm">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}

            {/* Extra highlight */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="p-6 rounded-2xl gradient-primary text-white"
            >
              <p className="font-heading font-bold text-xl mb-2">
                Обслуживаем Московскую область
              </p>
              <p className="font-body text-sm text-white/80 leading-relaxed">
                Ступино, Кашира, Серпухов, Чехов, Домодедово, Подольск и прилегающие районы.
                Бесплатный выезд замерщика — в радиусе 100 км.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
