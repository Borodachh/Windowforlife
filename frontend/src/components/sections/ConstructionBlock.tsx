import { useEffect } from 'react';
import { UseFormRegister, UseFormSetValue, Control, useWatch, FieldErrors } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
import { PRODUCT_SPECS } from '@shared/schemas/product-specs';
import type { OrderData } from '@shared/schemas/order.schema';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

const PROFILE_OPTIONS = [
  { value: 'KBE', label: 'KBE (Оптимальный)' },
  { value: 'Knipping', label: 'Knipping (Премиум)' },
  { value: 'Provedal C640', label: 'Provedal C640 (Раздвижная)' },
  { value: 'Provedal P400', label: 'Provedal P400 (Распашная)' },
  { value: 'Фасадный алюминий', label: 'Фасадный алюминий' },
];

interface ConstructionBlockProps {
  index: number;
  control: Control<OrderData>;
  register: UseFormRegister<OrderData>;
  errors: FieldErrors<OrderData>;
  setValue: UseFormSetValue<OrderData>;
  remove: (index: number) => void;
  canRemove: boolean;
}

export function ConstructionBlock({
  index,
  control,
  register,
  errors,
  setValue,
  remove,
  canRemove,
}: ConstructionBlockProps) {
  const profileSystem = useWatch({ control, name: `constructions.${index}.profileSystem` });
  const selectedSashTypes = useWatch({ control, name: `constructions.${index}.sashTypes` }) ?? [];

  const spec = profileSystem ? PRODUCT_SPECS[profileSystem] : null;

  // Reset dependent fields when profile changes
  useEffect(() => {
    if (profileSystem) {
      setValue(`constructions.${index}.constructionType`, '' as any);
      setValue(`constructions.${index}.sashTypes`, []);
      setValue(`constructions.${index}.width`, undefined);
      setValue(`constructions.${index}.height`, undefined);
      setValue(`constructions.${index}.sashCount`, undefined);
    }
  }, [profileSystem, index, setValue]);

  const constructionErrors = errors.constructions?.[index];

  const constructionTypeOptions = spec
    ? spec.allowedConstructionTypes.map((t) => ({ value: t, label: t }))
    : [];

  const sashTypeOptions = spec
    ? spec.allowedSashTypes.map((t) => ({ value: t, label: t }))
    : [];

  return (
    <div className="border border-gray-200 rounded-2xl p-4 md:p-6 relative">
      <div className="flex items-center justify-between mb-4">
        <p className="font-heading font-semibold text-gray-900 text-sm uppercase tracking-wider">
          Конструкция {index + 1}
        </p>
        {canRemove && (
          <button
            type="button"
            onClick={() => remove(index)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            aria-label={`Удалить конструкцию ${index + 1}`}
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Профильная система"
          options={PROFILE_OPTIONS}
          error={constructionErrors?.profileSystem?.message}
          required
          {...register(`constructions.${index}.profileSystem`)}
        />

        <Select
          label="Тип конструкции"
          options={constructionTypeOptions}
          error={constructionErrors?.constructionType?.message}
          required
          disabled={!profileSystem}
          {...register(`constructions.${index}.constructionType`)}
        />

        {spec?.requiresDimensions && (
          <>
            <Input
              label="Ширина (мм)"
              type="number"
              min={spec.width?.min}
              max={spec.width?.max}
              placeholder={spec.width ? `${spec.width.min}–${spec.width.max}` : ''}
              error={constructionErrors?.width?.message}
              required
              {...register(`constructions.${index}.width`, {
                setValueAs: (v: string) => (v === '' ? undefined : Number(v)),
              })}
            />
            <Input
              label="Высота (мм)"
              type="number"
              min={spec.height?.min}
              max={spec.height?.max}
              placeholder={spec.height ? `${spec.height.min}–${spec.height.max}` : ''}
              error={constructionErrors?.height?.message}
              required
              {...register(`constructions.${index}.height`, {
                setValueAs: (v: string) => (v === '' ? undefined : Number(v)),
              })}
            />
            <Input
              label="Количество створок"
              type="number"
              min={spec.sashCount?.min}
              max={spec.sashCount?.max}
              placeholder={spec.sashCount ? `${spec.sashCount.min}–${spec.sashCount.max}` : ''}
              error={constructionErrors?.sashCount?.message}
              required
              {...register(`constructions.${index}.sashCount`, {
                setValueAs: (v: string) => (v === '' ? undefined : Number(v)),
              })}
            />
          </>
        )}
      </div>

      {/* Sash types checkboxes */}
      {spec?.requiresDimensions && sashTypeOptions.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 font-body mb-2">
            Тип створок <span className="text-red-500" aria-hidden="true">*</span>
          </p>
          <div className="flex flex-wrap gap-3">
            {sashTypeOptions.map((type) => {
              const isChecked = selectedSashTypes.includes(type.value as any);
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
                    {...register(`constructions.${index}.sashTypes`)}
                  />
                  {type.label}
                </label>
              );
            })}
          </div>
          {constructionErrors?.sashTypes && (
            <p className="text-xs text-red-500 font-body mt-1.5" role="alert">
              {(constructionErrors.sashTypes as any)?.message || 'Выберите хотя бы один тип створки'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
