import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Accordion } from '../ui/Accordion';
import { AnimatedSectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { useInView } from '../../hooks/useInView';
import { faqItems } from '../../data/faq';
import { scrollToOrderForm, reachGoal } from '../../lib/analytics';

export function FAQ() {
  const [sectionRef, isInView] = useInView<HTMLElement>({ threshold: 0.08 });
  const phone = import.meta.env.VITE_COMPANY_PHONE;

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="section-padding bg-white"
      aria-label="Часто задаваемые вопросы"
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left: heading + CTA */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <AnimatedSectionHeading
              title="Часто задаваемые вопросы"
              subtitle="Отвечаем на вопросы, которые возникают у большинства клиентов до начала работы."
              isInView={isInView}
              accent="вопросы"
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col gap-3"
            >
              <Button
                variant="primary"
                size="md"
                onClick={() => { scrollToOrderForm(); reachGoal('order_form_opened'); }}
                className="w-fit"
              >
                Задать свой вопрос
              </Button>

              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  onClick={() => reachGoal('phone_clicked')}
                  className="flex items-center gap-2 text-gray-500 hover:text-primary-600 font-body text-sm transition-colors w-fit"
                >
                  <MessageCircle size={15} />
                  Или позвоните: {phone}
                </a>
              )}
            </motion.div>

            {/* Decorative block */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="hidden lg:block p-5 rounded-2xl bg-primary-50 border border-primary-100"
            >
              <p className="font-heading font-semibold text-primary-900 mb-1">Не нашли ответ?</p>
              <p className="text-primary-700 font-body text-sm leading-relaxed">
                Позвоните или оставьте заявку — ответим на любой вопрос о выборе окон,
                условиях монтажа и гарантиях.
              </p>
            </motion.div>
          </div>

          {/* Right: accordion */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Accordion items={faqItems} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
