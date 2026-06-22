import { type ReactNode } from "react";
import { Card as ShadcnCard } from "@/components/ui/primitives/card";
import { cn } from "@/lib/utils";

type CardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
};

const paddings = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  className,
  hover = false,
  padding = "md",
}: CardProps) {
  return (
    <ShadcnCard
      className={cn(paddings[padding], hover && "card-hover", className)}
    >
      {children}
    </ShadcnCard>
  );
}
