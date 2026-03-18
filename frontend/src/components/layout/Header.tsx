import { useState, useEffect } from 'react';
import { Menu, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { MobileMenu } from './MobileMenu';
import { scrollToOrderForm, reachGoal } from '../../lib/analytics';

const navLinks = [
  { href: '#products', label: 'Продукция' },
  { href: '#about', label: 'О нас' },
  { href: '#how-we-work', label: 'Как мы работаем' },
  { href: '#gallery', label: 'Галерея' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contacts', label: 'Контакты' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const phone = import.meta.env.VITE_COMPANY_PHONE || '';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleOrderClick = () => {
    scrollToOrderForm();
    reachGoal('order_form_opened');
  };

  return (
    <>
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'backdrop-blur-md bg-white/90 shadow-soft border-b border-gray-100/80'
            : 'bg-transparent',
        ].join(' ')}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <a
              href="/"
              className={`font-heading font-bold text-xl md:text-2xl shrink-0 transition-colors duration-300 ${scrolled ? 'text-gray-900' : 'text-white'}`}
            >
              Window<span className="text-primary-600">ForLife</span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={[
                    'px-3 py-2 rounded-lg text-sm font-medium font-body',
                    'transition-colors duration-200',
                    scrolled
                      ? 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                      : 'text-white/90 hover:text-white hover:bg-white/20',
                  ].join(' ')}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right: phone + CTA */}
            <div className="hidden md:flex items-center gap-4">
              {phone && (
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                  onClick={() => reachGoal('phone_clicked')}
                  className={[
                    'flex items-center gap-1.5 font-body font-semibold text-sm',
                    'transition-colors duration-200',
                    scrolled ? 'text-gray-700 hover:text-primary-600' : 'text-white/90 hover:text-white',
                  ].join(' ')}
                >
                  <Phone size={14} />
                  {phone}
                </a>
              )}
              <Button variant="primary" size="sm" onClick={handleOrderClick}>
                Заказать замер
              </Button>
            </div>

            {/* Mobile burger */}
            <button
              className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-white/90 hover:text-white hover:bg-white/20'}`}
              onClick={() => setMobileOpen(true)}
              aria-label="Открыть меню"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
