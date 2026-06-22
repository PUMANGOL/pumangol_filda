import { type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { Input as ShadcnInput } from "@/components/ui/primitives/input";
import { Textarea as ShadcnTextarea } from "@/components/ui/primitives/textarea";
import { Label } from "@/components/ui/primitives/label";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  required?: boolean;
};

export function Input({
  label,
  error,
  required,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={inputId}>
        {label}
        {required && <span className="text-primary">*</span>}
      </Label>
      <ShadcnInput
        id={inputId}
        aria-invalid={!!error}
        className={cn(error && "border-destructive", className)}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
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
  className,
  id,
  ...props
}: TextareaProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={inputId}>
        {label}
        {required && <span className="text-primary">*</span>}
      </Label>
      <ShadcnTextarea
        id={inputId}
        aria-invalid={!!error}
        className={cn(error && "border-destructive", className)}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
