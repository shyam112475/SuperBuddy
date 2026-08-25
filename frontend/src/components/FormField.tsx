import { forwardRef, InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, id, ...rest }, ref) => {
    const fieldId = id ?? rest.name;

    return (
      <div className="space-y-2">
        <label
          htmlFor={fieldId}
          className="block text-sm font-semibold tracking-tight text-neutral-800"
        >
          {label}
        </label>

        <div className="relative">
          <input
            id={fieldId}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className={`
              w-full rounded-xl border bg-white px-4 py-3
              text-sm text-neutral-900
              placeholder:text-neutral-400
              shadow-sm
              outline-none
              transition-all duration-200
              hover:border-neutral-400
              focus:ring-4
              disabled:cursor-not-allowed
              disabled:bg-neutral-100
              disabled:text-neutral-500
              ${
                error
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                  : 'border-neutral-200 focus:border-brand-500 focus:ring-brand-500/10'
              }
            `}
            {...rest}
          />
        </div>

        {error && (
          <p
            id={`${fieldId}-error`}
            className="flex items-center gap-1.5 text-xs font-medium text-red-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 shrink-0"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 6Zm0 8a.9.9 0 1 0 0-1.8A.9.9 0 0 0 10 14Z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';