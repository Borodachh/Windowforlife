import { motion } from 'framer-motion';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  tag?: 'h2' | 'h3';
  accent?: string; // highlighted word(s) in title
}

export function SectionHeading({
  title,
  subtitle,
  centered = false,
  tag: Tag = 'h2',
  accent,
}: SectionHeadingProps) {
  const alignClass = centered ? 'text-center items-center' : 'text-left items-start';

  const renderTitle = () => {
    if (!accent) return title;
    const parts = title.split(accent);
    return (
      <>
        {parts[0]}
        <span className="text-gradient">{accent}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className={`flex flex-col gap-3 ${alignClass}`}>
      <Tag
        className={[
          'font-heading font-bold text-gray-900',
          'text-3xl md:text-4xl leading-tight tracking-tight',
        ].join(' ')}
      >
        {renderTitle()}
      </Tag>
      {subtitle && (
        <p
          className={[
            'text-gray-500 font-body text-lg leading-relaxed',
            centered ? 'max-w-2xl' : 'max-w-xl',
          ].join(' ')}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

// Animated variant for use with useInView
export function AnimatedSectionHeading(props: SectionHeadingProps & { isInView: boolean }) {
  const { isInView, ...headingProps } = props;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <SectionHeading {...headingProps} />
    </motion.div>
  );
}
