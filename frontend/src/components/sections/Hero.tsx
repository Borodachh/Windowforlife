import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { scrollToOrderForm, reachGoal } from '../../lib/analytics';

// PLACEHOLDER: заменить на реальное фото
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=85&fit=crop';

const perks = [
  'Собственное производство',
  'Бесплатный замер',
  'Бесплатная доставка',
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  const handleCTA = () => {
    scrollToOrderForm();
    reachGoal('cta_hero_click');
    reachGoal('order_form_opened');
  };

  const handleProducts = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex items-center overflow-hidden"
      aria-label="Главная секция"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Современный интерьер с панорамными окнами WindowForLife"
          className="w-full h-full object-cover"
          fetchPriority="high"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/85 via-gray-900/60 to-gray-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/50 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom w-full py-24 md:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium font-body mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Производство и монтаж в Московской области
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            variants={itemVariants}
            className="font-heading font-bold text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-6"
          >
            Окна ПВХ и{' '}
            <span className="text-accent-light">алюминиевые</span>{' '}
            конструкции —{' '}
            <span className="text-white/90">производство и монтаж</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-white/75 font-body text-lg md:text-xl leading-relaxed mb-8"
          >
            Собственное производство без посредников. Немецкие профили Knipping и KBE,
            алюминиевые системы Provedal. Бесплатный выезд мастера на замер.
          </motion.p>

          {/* Perks */}
          <motion.ul variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-5 mb-10">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-2 text-white/80 font-body text-sm">
                <CheckCircle2 size={16} className="text-accent-light shrink-0" />
                {perk}
              </li>
            ))}
          </motion.ul>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
            <Button variant="primary" size="lg" onClick={handleCTA}>
              Бесплатный замер
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={handleProducts}
              className="text-white hover:bg-white/10 hover:text-white border border-white/25"
            >
              Наша продукция
              <ArrowRight size={18} />
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10" />
    </section>
  );
}
