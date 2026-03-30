import { motion } from 'framer-motion';
import { Phone, Mail, Clock, MapPin, ArrowRight } from 'lucide-react';
import { AnimatedSectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { useInView } from '../../hooks/useInView';
import { reachGoal, scrollToOrderForm } from '../../lib/analytics';

declare global {
  interface Window {
    ymaps?: unknown;
  }
}

// Lazy load Yandex Maps only when contacts section is in view
function YandexMap({ lat, lng }: { lat: string; lng: string }) {
  // Yandex Maps widget iframe — works without API key on any domain
  const src = `https://yandex.ru/map-widget/v1/?ll=${lng}%2C${lat}&z=17&pt=${lng}%2C${lat}%2Cpm2rdm&lang=ru_RU`;

  return (
    <iframe
      src={src}
      title="Местоположение WindowForLife на карте"
      className="w-full h-full rounded-2xl border-0"
      allowFullScreen
      loading="lazy"
    />
  );
}

export function Contacts() {
  const [sectionRef, isInView] = useInView<HTMLElement>({ threshold: 0.08 });
  const phone = import.meta.env.VITE_COMPANY_PHONE;
  const phone2 = import.meta.env.VITE_COMPANY_PHONE_2;
  const email = import.meta.env.VITE_COMPANY_EMAIL;
  const workHours = import.meta.env.VITE_COMPANY_WORK_HOURS;
  const address = import.meta.env.VITE_COMPANY_ADDRESS;
  const lat = import.meta.env.VITE_MAP_LATITUDE;
  const lng = import.meta.env.VITE_MAP_LONGITUDE;

  const contactItems = [
    phone && {
      icon: Phone,
      label: 'Телефон',
      value: phone,
      href: `tel:${phone.replace(/[^\d+]/g, '')}`,
      onClick: () => reachGoal('phone_clicked'),
    },
    phone2 && {
      icon: Phone,
      label: 'Телефон 2',
      value: phone2,
      href: `tel:${phone2.replace(/[^\d+]/g, '')}`,
      onClick: () => reachGoal('phone_clicked'),
    },
    email && {
      icon: Mail,
      label: 'Email',
      value: email,
      href: `mailto:${email}`,
    },
    workHours && {
      icon: Clock,
      label: 'Режим работы',
      value: workHours,
    },
    address && {
      icon: MapPin,
      label: 'Адрес',
      value: address,
    },
  ].filter(Boolean) as {
    icon: typeof Phone;
    label: string;
    value: string;
    href?: string;
    onClick?: () => void;
  }[];

  return (
    <section
      id="contacts"
      ref={sectionRef}
      className="section-padding bg-surface-soft"
      aria-label="Контакты"
    >
      <div className="container-custom">
        {/* Heading */}
        <div className="mb-12 text-center">
          <AnimatedSectionHeading
            title="Контакты"
            subtitle="Готовы ответить на вопросы и приехать на замер в удобное для вас время."
            centered
            isInView={isInView}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: contact info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Contact cards */}
            <div className="flex flex-col gap-4">
              {contactItems.map((item) => {
                const Icon = item.icon;
                const content = (
                  <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-soft">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-body mb-0.5">{item.label}</p>
                      <p className="font-body font-semibold text-gray-900 text-sm leading-snug">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );

                if (item.href) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={item.onClick}
                      className="block hover:scale-[1.01] transition-transform"
                    >
                      {content}
                    </a>
                  );
                }
                return <div key={item.label}>{content}</div>;
              })}
            </div>

            {/* CTA */}
            <div className="p-6 rounded-2xl gradient-primary text-white">
              <p className="font-heading font-bold text-lg mb-2">Выезд замерщика — бесплатно</p>
              <p className="text-white/80 font-body text-sm mb-4">
                Оставьте заявку и мы согласуем удобное время. Работаем без выходных.
              </p>
              <Button
                variant="secondary"
                size="md"
                onClick={() => { scrollToOrderForm(); reachGoal('order_form_opened'); }}
                className="bg-white text-primary-700 hover:bg-white/90 w-full justify-center"
              >
                Заказать замер
                <ArrowRight size={16} />
              </Button>
            </div>

            {/* Mobile call button */}
            {phone && (
              <a
                href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                onClick={() => reachGoal('phone_clicked')}
                className="md:hidden flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary-600 text-white font-body font-semibold text-base"
              >
                <Phone size={18} />
                Позвонить: {phone}
              </a>
            )}
            {phone2 && (
              <a
                href={`tel:${phone2.replace(/[^\d+]/g, '')}`}
                onClick={() => reachGoal('phone_clicked')}
                className="md:hidden flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary-600 text-white font-body font-semibold text-base"
              >
                <Phone size={18} />
                Позвонить: {phone2}
              </a>
            )}
          </motion.div>

          {/* Right: map */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 min-h-[380px] rounded-2xl overflow-hidden shadow-card"
          >
            <YandexMap lat={lat} lng={lng} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
