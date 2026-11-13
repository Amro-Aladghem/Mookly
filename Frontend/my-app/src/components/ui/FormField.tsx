import type { ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes, InputHTMLAttributes } from 'react';
import { cn } from '@/libs/cn';

const fieldClass =
  'w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60';

interface FieldLabelProps {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

function FieldLabel({ label, hint, required, children }: FieldLabelProps) {
  return (
    <label className="flex w-full flex-col gap-1.5">
      <span className="flex items-center gap-1 text-sm font-medium text-ink">
        {label}
        {required && <span className="text-danger">*</span>}
      </span>
      {children}
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function TextField({ label, hint, required, className, ...props }: TextFieldProps) {
  return (
    <FieldLabel label={label} hint={hint} required={required}>
      <input className={cn(fieldClass, className)} required={required} {...props} />
    </FieldLabel>
  );
}

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
}

export function TextareaField({
  label,
  hint,
  required,
  className,
  ...props
}: TextareaFieldProps) {
  return (
    <FieldLabel label={label} hint={hint} required={required}>
      <textarea
        className={cn(fieldClass, 'min-h-28 resize-y leading-7', className)}
        required={required}
        {...props}
      />
    </FieldLabel>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
}

export function SelectField({
  label,
  hint,
  required,
  className,
  children,
  ...props
}: SelectFieldProps) {
  return (
    <FieldLabel label={label} hint={hint} required={required}>
      <select className={cn(fieldClass, className)} required={required} {...props}>
        {children}
      </select>
    </FieldLabel>
  );
}
