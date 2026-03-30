import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { scrollToOrderForm, reachGoal } from '../../lib/analytics';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { href: '#products', label: 'Продукция' },
  { href: '#about', label: 'О нас' },
  { href: '#how-we-work', label: 'Как мы работаем' },
  { href: '#gallery', label: 'Галерея' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contacts', label: 'Контакты' },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const phone = import.meta.env.VITE_COMPANY_PHONE || '';
  const phone2 = import.meta.env.VITE_COMPANY_PHONE_2 || '';
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  const delayedAction = (fn: () => void) => {
    const id = setTimeout(fn, 300);
    timersRef.current.push(id);
  };

  const handleNavClick = (href: string) => {
    onClose();
    delayedAction(() => {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleOrderClick = () => {
    onClose();
    delayedAction(() => {
      scrollToOrderForm();
      reachGoal('order_form_opened');
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-80 max-w-[90vw] bg-white z-50 lg:hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <span className="font-heading font-bold text-xl text-gray-900">
                Window<span className="text-primary-600">ForLife</span>
              </span>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Закрыть меню"
              >
                <X size={22} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col px-4 py-6 gap-1 flex-1">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 + 0.1 }}
                  onClick={() => handleNavClick(link.href)}
                  className="w-full text-left px-4 py-3 rounded-xl font-body text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors font-medium"
                >
                  {link.label}
                </motion.button>
              ))}
            </nav>

            {/* Bottom CTAs */}
            <div className="px-6 py-6 border-t border-gray-100 flex flex-col gap-3">
              {phone && (
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                  onClick={() => reachGoal('phone_clicked')}
                  className="block text-center py-2 font-body font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  {phone}
                </a>
              )}
              {phone2 && (
                <a
                  href={`tel:${phone2.replace(/[^\d+]/g, '')}`}
                  onClick={() => reachGoal('phone_clicked')}
                  className="block text-center py-2 font-body font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  {phone2}
                </a>
              )}
              <Button variant="primary" size="md" onClick={handleOrderClick} className="w-full">
                Заказать замер
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
