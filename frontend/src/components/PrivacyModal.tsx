import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  const company = 'WindowForLife';
  const email = import.meta.env.VITE_COMPANY_EMAIL || '';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="privacy-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            key="privacy-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 md:inset-10 lg:inset-20 z-50 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-gray-100">
              <h2 className="font-heading font-bold text-xl text-gray-900">
                Политика конфиденциальности
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Закрыть"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 px-6 md:px-8 py-6 font-body text-gray-600 text-sm leading-relaxed space-y-4">
              <p>
                Настоящая Политика конфиденциальности определяет порядок обработки и защиты
                персональных данных пользователей сайта {company} (windowforlife.ru).
              </p>

              <h3 className="font-semibold text-gray-800 text-base mt-4">
                1. Сбор персональных данных
              </h3>
              <p>
                Мы собираем персональные данные, которые вы добровольно предоставляете при
                заполнении формы заявки: имя, фамилия, номер телефона, комментарий. Данные
                используются исключительно для обратной связи по вашей заявке.
              </p>

              <h3 className="font-semibold text-gray-800 text-base">2. Использование данных</h3>
              <p>
                Персональные данные используются для: связи с вами по поводу заявки на замер,
                расчёта стоимости и организации монтажа. Данные не передаются третьим лицам.
              </p>

              <h3 className="font-semibold text-gray-800 text-base">3. Хранение данных</h3>
              <p>
                Данные хранятся в защищённом виде. Вы можете запросить удаление своих данных,
                написав на {email || 'info@windowforlife.ru'}.
              </p>

              <h3 className="font-semibold text-gray-800 text-base">4. Cookies</h3>
              <p>
                Сайт использует файлы cookies и инструменты аналитики (Яндекс.Метрика) для
                улучшения работы сайта. Продолжая использование сайта, вы соглашаетесь с
                обработкой данных в указанных целях.
              </p>

              <h3 className="font-semibold text-gray-800 text-base">5. Контакты</h3>
              <p>
                По вопросам обработки персональных данных обращайтесь:{' '}
                {email || 'info@windowforlife.ru'}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
