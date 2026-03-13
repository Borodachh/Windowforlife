import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { AnimatedSectionHeading } from '../ui/SectionHeading';
import { useInView } from '../../hooks/useInView';
import { reviews } from '../../data/reviews';

import 'swiper/css';
import 'swiper/css/pagination';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Оценка ${rating} из 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: (typeof reviews)[0] }) {
  const date = new Date(review.date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <article className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card h-full flex flex-col gap-4">
      {/* Quote icon */}
      <Quote size={24} className="text-primary-200 shrink-0" />

      {/* Text */}
      <p className="text-gray-600 font-body text-sm leading-relaxed flex-1">
        {review.text}
      </p>

      {/* Footer */}
      <div className="flex items-end justify-between gap-3 pt-2 border-t border-gray-100">
        <div>
          <p className="font-heading font-semibold text-gray-900 text-sm">{review.name}</p>
          <p className="text-gray-400 font-body text-xs mt-0.5">{review.workType}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StarRating rating={review.rating} />
          <p className="text-gray-400 font-body text-xs">{date}</p>
        </div>
      </div>
    </article>
  );
}

export function Reviews() {
  const [sectionRef, isInView] = useInView<HTMLElement>({ threshold: 0.08 });

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className="section-padding bg-surface-soft overflow-hidden"
      aria-label="Отзывы клиентов"
    >
      <div className="container-custom mb-10">
        <div className="text-center">
          <AnimatedSectionHeading
            title="Отзывы клиентов"
            subtitle="Нам доверяют жители Ступино, Каширы, Серпухова и других городов Подмосковья."
            centered
            isInView={isInView}
            accent="клиентов"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          loop
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 24 },
            1280: { slidesPerView: 3, spaceBetween: 24 },
          }}
          className="pb-12"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id} className="h-auto">
              <ReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      {/* Trust badges */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="container-custom mt-8"
      >
        <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 font-body text-sm">
          <div className="flex items-center gap-2">
            <StarRating rating={5} />
            <span>5.0 средняя оценка</span>
          </div>
          <span className="hidden sm:block text-gray-200">•</span>
          <span>{reviews.length}+ отзывов от клиентов</span>
          <span className="hidden sm:block text-gray-200">•</span>
          <span>Все отзывы проверены</span>
        </div>
      </motion.div>
    </section>
  );
}
