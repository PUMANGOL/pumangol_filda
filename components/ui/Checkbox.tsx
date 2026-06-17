import { type InputHTMLAttributes } from "react";

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label: React.ReactNode;
  error?: string;
};

export function Checkbox({
  label,
  error,
  className = "",
  id,
  ...props
}: CheckboxProps) {
  const checkboxId = id || "checkbox-consent";

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={checkboxId}
        className="flex items-start gap-3 cursor-pointer group"
      >
        <input
          type="checkbox"
          id={checkboxId}
          className={`mt-1 h-5 w-5 shrink-0 rounded border-border text-pumangol-red focus:ring-pumangol-red focus:ring-offset-0 ${className}`}
          {...props}
        />
        <span className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-800">
          {label}
        </span>
      </label>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
