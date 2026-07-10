"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/primitives/label";
import {
  Select as SelectRoot,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/primitives/select";
import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  label: string;
  name: string;
  options?: readonly string[] | string[];
  selectOptions?: SelectOption[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  id?: string;
};

export function Select({
  label,
  name,
  options = [],
  selectOptions,
  placeholder = "Seleccionar...",
  error,
  required,
  disabled,
  defaultValue = "",
  value: controlledValue,
  onValueChange,
  className,
  id,
}: SelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, "-");
  const resolvedOptions =
    selectOptions ??
    options.map((option) => ({
      value: option,
      label: option,
    }));
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : uncontrolledValue;

  useEffect(() => {
    if (!isControlled) {
      setUncontrolledValue(defaultValue);
    }
  }, [defaultValue, isControlled]);

  function handleValueChange(nextValue: string) {
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }
    onValueChange?.(nextValue);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={selectId}>
        {label}
        {required && <span className="text-primary">*</span>}
      </Label>

      <input
        type="hidden"
        name={name}
        value={value}
        required={required}
        disabled={disabled}
      />

      <SelectRoot
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
        required={required}
      >
        <SelectTrigger
          id={selectId}
          aria-invalid={!!error}
          className={cn(error && "border-destructive", className)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {resolvedOptions.map((option) => (
            <SelectItem key={option.value || "__empty__"} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
