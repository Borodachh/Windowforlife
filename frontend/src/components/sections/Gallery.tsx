import { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Lightbox from 'yet-another-react-lightbox';
import { motion } from 'framer-motion';
import { ZoomIn } from 'lucide-react';
import { AnimatedSectionHeading } from '../ui/SectionHeading';
import { useInView } from '../../hooks/useInView';
import { galleryItems } from '../../data/gallery';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'yet-another-react-lightbox/styles.css';

export function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [sectionRef, isInView] = useInView<HTMLElement>({ threshold: 0.08 });
  const swiperRef = useRef<{ swiper: { autoplay: { stop: () => void; start: () => void } } } | null>(null);

  const slides = galleryItems.map((item) => ({
    src: item.src,
    alt: item.alt,
  }));

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="section-padding bg-white overflow-hidden"
      aria-label="Галерея работ"
    >
      <div className="container-custom mb-10">
        <div className="text-center">
          <AnimatedSectionHeading
            title="Галерея наших работ"
            subtitle="Реализованные проекты в Ступино и Московской области. Нажмите на фото для просмотра."
            centered
            isInView={isInView}
            accent="наших работ"
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
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={1}
          loop
          autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          navigation
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          }}
          className="pb-12"
        >
          {galleryItems.map((item, index) => (
            <SwiperSlide key={item.id}>
              <button
                onClick={() => setLightboxIndex(index)}
                className="group relative block w-full rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-label={`Открыть фото: ${item.caption}`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn
                    size={36}
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
                  />
                </div>
                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white text-sm font-medium font-body">{item.caption}</p>
                </div>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={slides}
        on={{ view: ({ index }) => setLightboxIndex(index) }}
      />
    </section>
  );
}
