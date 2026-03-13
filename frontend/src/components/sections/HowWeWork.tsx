import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { AnimatedSectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { useInView } from '../../hooks/useInView';
import { steps } from '../../data/steps';
import { scrollToOrderForm, reachGoal } from '../../lib/analytics';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const stepVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

export function HowWeWork() {
  const [sectionRef, isInView] = useInView<HTMLElement>({ threshold: 0.08 });

  const handleOrder = () => {
    scrollToOrderForm();
    reachGoal('order_form_opened');
  };

  return (
    <section
      id="how-we-work"
      ref={sectionRef}
      className="section-padding bg-surface-soft"
      aria-label="Как мы работаем"
    >
      <div className="container-custom">
        {/* Heading */}
        <div className="mb-14 text-center">
          <AnimatedSectionHeading
            title="Как мы работаем"
            subtitle="От заявки до готовых окон — прозрачный процесс без сюрпризов. Вы всегда знаете, на каком этапе находится ваш заказ."
            centered
            isInView={isInView}
            accent="работаем"
          />
        </div>

        {/* Steps — desktop: horizontal grid, mobile: vertical list */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="relative"
        >
          {/* Connector line — desktop only */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            style={{ originX: 0 }}
            className="hidden lg:block absolute top-12 left-[calc(10%+28px)] right-[calc(10%+28px)] h-px bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200 z-0"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  variants={stepVariants}
                  className="relative flex flex-col items-center lg:items-center text-left lg:text-center gap-4"
                >
                  {/* Mobile: vertical connector */}
                  {step.id < steps.length && (
                    <div className="sm:hidden absolute left-7 top-16 w-px h-[calc(100%+24px)] bg-gradient-to-b from-primary-300 to-primary-100" />
                  )}

                  {/* Icon circle */}
                  <div className="relative z-10 w-14 h-14 rounded-2xl bg-white border-2 border-primary-100 shadow-card flex items-center justify-center shrink-0 group-hover:border-primary-400 transition-colors">
                    <Icon size={22} className="text-primary-600" />
                    {/* Step number badge */}
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center font-heading">
                      {step.id}
                    </span>
                  </div>

                  {/* Text */}
                  <div className="flex flex-col gap-1.5 pl-4 sm:pl-0">
                    <p className="font-heading font-bold text-gray-900 text-base leading-tight">
                      {step.title}
                    </p>
                    <p className="text-gray-500 font-body text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button variant="primary" size="lg" onClick={handleOrder}>
            Начать с замера
            <ArrowRight size={18} />
          </Button>
          <p className="text-gray-400 font-body text-sm">
            Выезд мастера — бесплатно, без обязательств
          </p>
        </motion.div>
      </div>
    </section>
  );
}
