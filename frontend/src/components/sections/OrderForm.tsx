import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import InputMask from 'react-input-mask';
import { orderSchema } from '@shared/schemas/order.schema';
import type { OrderData } from '@shared/schemas/order.schema';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { AnimatedSectionHeading } from '../ui/SectionHeading';
import { useInView } from '../../hooks/useInView';
import { useSubmitOrder } from '../../hooks/useSubmitOrder';

type FormState = 'idle' | 'success' | 'error';

const CONSTRUCTION_TYPES = [
  { value: 'Балконный блок', label: 'Балконный блок' },
  { value: 'Одностворчатое окно', label: 'Одностворчатое окно' },
  { value: 'Двухстворчатое окно', label: 'Двухстворчатое окно' },
  { value: 'Трёхстворчатое окно', label: 'Трёхстворчатое окно' },
];

const PROFILE_SYSTEMS = [
  { value: 'Knipping', label: 'Knipping (Премиум)' },
  { value: 'KBE', label: 'KBE (Оптимальный)' },
  { value: 'Provedal C640', label: 'Provedal C640 (Раздвижная)' },
  { value: 'Provedal P400', label: 'Provedal P400 (Распашная)' },
  { value: 'Фасадный алюминий', label: 'Фасадный алюминий' },
];

const SASH_TYPES = [
  { value: 'Глухая', label: 'Глухая' },
  { value: 'Поворотная', label: 'Поворотная' },
  { value: 'Поворотно-откидная', label: 'Поворотно-откидная' },
  { value: 'Раздвижная', label: 'Раздвижная' },
] as const;

export function OrderForm() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [sectionRef, isInView] = useInView<HTMLElement>({ threshold: 0.05 });
  const phone = import.meta.env.VITE_COMPANY_PHONE;
  const phone2 = import.meta.env.VITE_COMPANY_PHONE_2;
  const { mutate, isPending } = useSubmitOrder();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<OrderData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      sashTypes: [],
      consent: false,
    },
  });

  const selectedSashTypes = watch('sashTypes') ?? [];

  const onSubmit = (data: OrderData) => {
    const { consent: _consent, ...orderInput } = data;
    mutate(orderInput, {
      onSuccess: () => {
        setFormState('success');
        reset();
      },
      onError: () => {
        setFormState('error');
      },
    });
  };

  return (
    <section
      id="order-form"
      ref={sectionRef}
      className="section-padding bg-gradient-to-br from-primary-950 via-primary-900 to-gray-900"
      aria-label="Форма заявки"
    >
      <div className="container-custom">
        {/* Heading */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading font-bold text-white text-3xl md:text-4xl mb-4">
              Рассчитать стоимость и заказать{' '}
              <span className="text-accent-light">бесплатный замер</span>
            </h2>
            <p className="text-white/60 font-body text-lg max-w-xl mx-auto">
              Заполните форму — мы свяжемся с вами в течение 30 минут и согласуем удобное время выезда.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-3xl mx-auto"
        >
          <AnimatePresence mode="wait">
            {/* Success state */}
            {formState === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-10 text-center flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-gray-900">
                  Заявка отправлена!
                </h3>
                <p className="text-gray-500 font-body max-w-sm">
                  Мы получили вашу заявку и свяжемся с вами в ближайшее время для уточнения деталей и согласования времени замера.
                </p>
                <button
                  onClick={() => setFormState('idle')}
                  className="mt-2 text-primary-600 font-body text-sm underline hover:text-primary-700 transition-colors"
                >
                  Отправить ещё одну заявку
                </button>
              </motion.div>
            )}

            {/* Form state */}
            {formState !== 'success' && (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="bg-white rounded-3xl p-6 md:p-10 flex flex-col gap-6"
              >
                {/* Error banner */}
                {formState === 'error' && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-700 font-body text-sm font-medium">
                        Не удалось отправить заявку.
                      </p>
                      <p className="text-red-600 font-body text-sm">
                        Позвоните нам:{' '}
                        <a href={`tel:${phone?.replace(/\s/g, '')}`} className="font-semibold underline">
                          {phone}
                        </a>
                        {phone2 && (
                          <>
                            {' или '}
                            <a href={`tel:${phone2.replace(/\s/g, '')}`} className="font-semibold underline">
                              {phone2}
                            </a>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {/* Section: Construction details */}
                <div>
                  <p className="font-heading font-semibold text-gray-900 text-sm uppercase tracking-wider mb-4">
                    Параметры конструкции
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Тип конструкции"
                      options={CONSTRUCTION_TYPES}
                      error={errors.constructionType?.message}
                      required
                      {...register('constructionType')}
                    />
                    <Select
                      label="Профильная система"
                      options={PROFILE_SYSTEMS}
                      error={errors.profileSystem?.message}
                      required
                      {...register('profileSystem')}
                    />
                    <Input
                      label="Ширина (мм)"
                      type="number"
                      min={300}
                      max={5000}
                      placeholder="Например: 1400"
                      error={errors.width?.message}
                      required
                      {...register('width', { valueAsNumber: true })}
                    />
                    <Input
                      label="Высота (мм)"
                      type="number"
                      min={300}
                      max={3000}
                      placeholder="Например: 1300"
                      error={errors.height?.message}
                      required
                      {...register('height', { valueAsNumber: true })}
                    />
                    <Input
                      label="Количество створок"
                      type="number"
                      min={1}
                      max={6}
                      placeholder="Например: 2"
                      error={errors.sashCount?.message}
                      required
                      {...register('sashCount', { valueAsNumber: true })}
                    />
                  </div>
                </div>

                {/* Sash types checkboxes */}
                <div>
                  <p className="text-sm font-medium text-gray-700 font-body mb-2">
                    Тип створок{' '}
                    <span className="text-red-500" aria-hidden="true">*</span>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {SASH_TYPES.map((type) => {
                      const isChecked = selectedSashTypes.includes(type.value);
                      return (
                        <label
                          key={type.value}
                          className={[
                            'flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer',
                            'font-body text-sm transition-all duration-200',
                            isChecked
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300',
                          ].join(' ')}
                        >
                          <input
                            type="checkbox"
                            value={type.value}
                            className="accent-primary-600"
                            {...register('sashTypes')}
                          />
                          {type.label}
                        </label>
                      );
                    })}
                  </div>
                  {errors.sashTypes && (
                    <p className="text-xs text-red-500 font-body mt-1.5" role="alert">
                      {errors.sashTypes.message}
                    </p>
                  )}
                </div>

                {/* Section: Contact info */}
                <div>
                  <p className="font-heading font-semibold text-gray-900 text-sm uppercase tracking-wider mb-4">
                    Контактные данные
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Имя"
                      placeholder="Иван"
                      error={errors.firstName?.message}
                      required
                      {...register('firstName')}
                    />
                    <Input
                      label="Фамилия"
                      placeholder="Иванов"
                      error={errors.lastName?.message}
                      required
                      {...register('lastName')}
                    />

                    {/* Phone with mask */}
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-medium text-gray-700 font-body">
                            Телефон{' '}
                            <span className="text-red-500" aria-hidden="true">*</span>
                          </label>
                          <InputMask
                            mask="+7 (999) 999-99-99"
                            value={field.value ?? ''}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                          >
                            {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (
                              <input
                                {...inputProps}
                                type="tel"
                                placeholder="+7 (999) 999-99-99"
                                className={[
                                  'w-full px-4 py-3 rounded-xl border font-body text-base',
                                  'bg-white text-gray-900 placeholder-gray-400',
                                  'transition-all duration-200',
                                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                                  errors.phone
                                    ? 'border-red-400 bg-red-50'
                                    : 'border-gray-200 hover:border-gray-300',
                                ].join(' ')}
                              />
                            )}
                          </InputMask>
                          {errors.phone && (
                            <p className="text-xs text-red-500 font-body" role="alert">
                              {errors.phone.message}
                            </p>
                          )}
                        </div>
                      )}
                    />

                    {/* Comment */}
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 font-body">
                        Комментарий{' '}
                        <span className="text-gray-400 font-normal">(необязательно)</span>
                      </label>
                      <textarea
                        placeholder="Пожелания по времени замера, особенности объекта..."
                        rows={3}
                        maxLength={500}
                        className={[
                          'w-full px-4 py-3 rounded-xl border font-body text-base resize-none',
                          'bg-white text-gray-900 placeholder-gray-400',
                          'transition-all duration-200',
                          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                          'border-gray-200 hover:border-gray-300',
                        ].join(' ')}
                        {...register('comment')}
                      />
                    </div>
                  </div>
                </div>

                {/* Consent */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent"
                    className="mt-1 accent-primary-600 w-4 h-4 shrink-0"
                    {...register('consent')}
                  />
                  <label htmlFor="consent" className="text-sm text-gray-500 font-body leading-relaxed">
                    Нажимая кнопку, я соглашаюсь с{' '}
                    <button
                      type="button"
                      className="text-primary-600 underline hover:text-primary-700"
                      onClick={() => {
                        const footer = document.querySelector('footer');
                        footer?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      политикой конфиденциальности
                    </button>{' '}
                    и даю согласие на обработку персональных данных.
                  </label>
                </div>
                {errors.consent && (
                  <p className="text-xs text-red-500 font-body -mt-4" role="alert">
                    {errors.consent.message}
                  </p>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isPending}
                  disabled={isPending}
                  className="w-full sm:w-auto"
                >
                  Отправить заявку
                </Button>

                <p className="text-xs text-gray-400 font-body">
                  Мы свяжемся с вами в течение 30 минут в рабочее время
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
