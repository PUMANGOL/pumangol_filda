import { type SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: readonly string[] | string[];
  placeholder?: string;
  error?: string;
  required?: boolean;
};

export function Select({
  label,
  options,
  placeholder = "Seleccionar...",
  error,
  required,
  className = "",
  id,
  ...props
}: SelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={selectId} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-pumangol-red ml-0.5">*</span>}
      </label>
      <select
        id={selectId}
        className={`w-full appearance-none rounded-xl border border-border bg-white px-4 py-3 text-gray-900 transition-colors focus:border-pumangol-red focus:outline-none focus:ring-2 focus:ring-pumangol-red/20 ${error ? "border-red-500" : ""} ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
