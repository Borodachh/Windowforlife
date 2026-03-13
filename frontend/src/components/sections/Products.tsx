import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { useInView } from '../../hooks/useInView';
import { pvcProducts, aluminumProducts, type Product } from '../../data/products';
import { scrollToOrderForm, reachGoal } from '../../lib/analytics';

type Tab = 'pvc' | 'aluminum';

const tabs: { id: Tab; label: string }[] = [
  { id: 'pvc', label: 'Окна ПВХ' },
  { id: 'aluminum', label: 'Алюминиевые конструкции' },
];

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function ProductCard({ product }: { product: Product }) {
  return (
    <motion.article variants={cardVariants} className="card flex flex-col overflow-hidden group">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-primary-600 text-white text-xs font-semibold font-body rounded-full">
            {product.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-4">
        <h3 className="font-heading font-bold text-xl text-gray-900">{product.name}</h3>
        <p className="text-gray-500 font-body text-sm leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Features */}
        <ul className="flex flex-col gap-1.5">
          {product.features.slice(0, 4).map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-gray-600 font-body">
              <CheckCircle2 size={14} className="text-primary-500 shrink-0 mt-0.5" />
              {feature}
            </li>
          ))}
        </ul>

        {/* Construction types */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {product.constructionTypes.map((type) => (
            <span
              key={type}
              className="px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium font-body rounded-lg"
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export function Products() {
  const [activeTab, setActiveTab] = useState<Tab>('pvc');
  const [sectionRef, isInView] = useInView<HTMLElement>();

  const currentProducts = activeTab === 'pvc' ? pvcProducts : aluminumProducts;

  const handleOrder = () => {
    scrollToOrderForm();
    reachGoal('order_form_opened');
  };

  return (
    <section
      id="products"
      ref={sectionRef}
      className="section-padding bg-surface-soft"
      aria-label="Наша продукция"
    >
      <div className="container-custom">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <SectionHeading
            title="Наша продукция"
            subtitle="Немецкие профильные системы и алюминиевые конструкции собственного производства. Выбирайте то, что подходит вашему объекту."
            accent="продукция"
          />
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex gap-1 p-1 bg-white border border-gray-200 rounded-2xl w-fit mb-10"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'px-5 py-2.5 rounded-xl text-sm font-semibold font-body transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={listVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className={[
              'grid gap-6',
              activeTab === 'pvc' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
            ].join(' ')}
          >
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 font-body mb-4">
            Не знаете, что выбрать? Наш специалист подберёт оптимальное решение.
          </p>
          <Button variant="primary" size="lg" onClick={handleOrder}>
            Рассчитать стоимость
            <ArrowRight size={18} />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
