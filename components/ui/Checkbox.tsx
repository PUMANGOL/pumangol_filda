"use client";

import { useId, useState } from "react";
import { Checkbox as ShadcnCheckbox } from "@/components/ui/primitives/checkbox";
import { Label } from "@/components/ui/primitives/label";
import { cn } from "@/lib/utils";

type CheckboxProps = {
  label: React.ReactNode;
  error?: string;
  name?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  defaultChecked?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  id?: string;
  className?: string;
  variant?: "default" | "card";
};

export function Checkbox({
  label,
  error,
  name,
  value,
  required,
  disabled,
  defaultChecked = false,
  checked: controlledChecked,
  onCheckedChange,
  id,
  className,
  variant = "default",
}: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id || generatedId;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;

  function handleCheckedChange(next: boolean) {
    if (!isControlled) {
      setInternalChecked(next);
    }
    onCheckedChange?.(next);
  }

  const formInput =
    name &&
    (value !== undefined ? (
      isChecked && <input type="hidden" name={name} value={value} />
    ) : (
      <input
        type="checkbox"
        name={name}
        checked={isChecked}
        onChange={() => {}}
        required={required}
        disabled={disabled}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
      />
    ));

  if (variant === "card") {
    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
          isChecked
            ? "border-primary bg-primary/5"
            : "border-border hover:border-gray-300",
          disabled && "pointer-events-none opacity-60",
          className
        )}
      >
        {formInput}
        <ShadcnCheckbox
          id={checkboxId}
          checked={isChecked}
          onCheckedChange={handleCheckedChange}
          disabled={disabled}
        />
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </label>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-start gap-3">
        {formInput}
        <ShadcnCheckbox
          id={checkboxId}
          checked={isChecked}
          onCheckedChange={handleCheckedChange}
          disabled={disabled}
          className="mt-0.5"
        />
        <Label
          htmlFor={checkboxId}
          className="cursor-pointer font-normal text-muted-foreground leading-relaxed hover:text-foreground"
        >
          {label}
        </Label>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
