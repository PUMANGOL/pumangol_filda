import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  error?: string;
}

export function Input({ className, type, error, ...props }: InputProps) {
  return (
    <div className="w-full">
      <input
        type={type}
        data-slot="input"
        className={cn(
          "flex h-11 w-full min-w-0 rounded-xl border bg-white px-4 py-3 text-base text-foreground shadow-xs transition-colors outline-none placeholder:text-muted-foreground",
          "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-destructive focus-visible:ring-destructive/20"
            : "border-input",
          "md:text-sm",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
