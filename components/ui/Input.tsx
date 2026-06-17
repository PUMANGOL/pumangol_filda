import { type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  required?: boolean;
};

export function Input({
  label,
  error,
  required,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-pumangol-red ml-0.5">*</span>}
      </label>
      <input
        id={inputId}
        className={`w-full rounded-xl border border-border bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 transition-colors focus:border-pumangol-red focus:outline-none focus:ring-2 focus:ring-pumangol-red/20 ${error ? "border-red-500" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  required?: boolean;
};

export function Textarea({
  label,
  error,
  required,
  className = "",
  id,
  ...props
}: TextareaProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-pumangol-red ml-0.5">*</span>}
      </label>
      <textarea
        id={inputId}
        rows={4}
        className={`w-full resize-y rounded-xl border border-border bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 transition-colors focus:border-pumangol-red focus:outline-none focus:ring-2 focus:ring-pumangol-red/20 ${error ? "border-red-500" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
