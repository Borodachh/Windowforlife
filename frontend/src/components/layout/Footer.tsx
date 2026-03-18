import { useState } from 'react';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import { reachGoal, scrollToOrderForm } from '../../lib/analytics';
import { PrivacyModal } from '../PrivacyModal';

const navLinks = [
  { href: '#products', label: 'Продукция' },
  { href: '#about', label: 'О нас' },
  { href: '#how-we-work', label: 'Как мы работаем' },
  { href: '#gallery', label: 'Галерея' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contacts', label: 'Контакты' },
];

export function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const phone = import.meta.env.VITE_COMPANY_PHONE || '';
  const email = import.meta.env.VITE_COMPANY_EMAIL || '';
  const workHours = import.meta.env.VITE_COMPANY_WORK_HOURS || '';
  const address = import.meta.env.VITE_COMPANY_ADDRESS || '';
  const year = new Date().getFullYear();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <footer className="bg-gray-900 text-white">
        <div className="container-custom py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-1">
              <p className="font-heading font-bold text-2xl mb-3">
                Window<span className="text-primary-400">ForLife</span>
              </p>
              <p className="text-gray-400 font-body text-sm leading-relaxed">
                Производство и монтаж окон ПВХ и алюминиевых конструкций. Собственное
                производство. Бесплатный замер.
              </p>
              <button
                onClick={() => { scrollToOrderForm(); reachGoal('order_form_opened'); }}
                className="mt-5 inline-block px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-xl transition-colors font-body"
              >
                Заказать замер
              </button>
            </div>

            {/* Nav */}
            <div>
              <p className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">
                Навигация
              </p>
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-gray-400 hover:text-white font-body text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Contacts */}
            <div className="lg:col-span-2">
              <p className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">
                Контакты
              </p>
              <div className="flex flex-col gap-3">
                {phone && (
                  <a
                    href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                    onClick={() => reachGoal('phone_clicked')}
                    className="flex items-center gap-2.5 text-gray-300 hover:text-white font-body text-sm transition-colors"
                  >
                    <Phone size={14} className="text-primary-400 shrink-0" />
                    {phone}
                  </a>
                )}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-2.5 text-gray-300 hover:text-white font-body text-sm transition-colors"
                  >
                    <Mail size={14} className="text-primary-400 shrink-0" />
                    {email}
                  </a>
                )}
                {workHours && (
                  <div className="flex items-center gap-2.5 text-gray-400 font-body text-sm">
                    <Clock size={14} className="text-primary-400 shrink-0" />
                    {workHours}
                  </div>
                )}
                {address && (
                  <div className="flex items-start gap-2.5 text-gray-400 font-body text-sm">
                    <MapPin size={14} className="text-primary-400 shrink-0 mt-0.5" />
                    {address}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-500 font-body text-sm">
              © {year} WindowForLife. Все права защищены.
            </p>
            <button
              onClick={() => setPrivacyOpen(true)}
              className="text-gray-500 hover:text-gray-300 font-body text-sm underline transition-colors"
            >
              Политика конфиденциальности
            </button>
          </div>
        </div>
      </footer>

      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </>
  );
}
