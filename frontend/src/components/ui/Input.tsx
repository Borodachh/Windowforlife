import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id ?? `input-${label.replace(/\s+/g, '-').toLowerCase()}`;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700 font-body"
        >
          {label}
          {props.required && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
        <input
          ref={ref}
          id={inputId}
          {...props}
          className={[
            'w-full px-4 py-3 rounded-xl border font-body text-base',
            'bg-white text-gray-900 placeholder-gray-400',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            error
              ? 'border-red-400 bg-red-50 focus:ring-red-400'
              : 'border-gray-200 hover:border-gray-300',
            'disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-50',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        />
        {hint && !error && (
          <p className="text-xs text-gray-400 font-body">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-red-500 font-body" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
