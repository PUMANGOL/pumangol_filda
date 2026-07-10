import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-brand text-white",
        secondary: "bg-slate-100 text-slate-700",
        outline: "border border-slate-300 text-slate-700",
        "A+": "bg-red-600 text-white",
        A: "bg-orange-500 text-white",
        B: "bg-yellow-400 text-black",
        C: "bg-blue-400 text-white",
        D: "bg-slate-400 text-white",
        FORNECEDOR: "bg-purple-600 text-white",
        success: "bg-green-500 text-white",
        warning: "bg-amber-400 text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
