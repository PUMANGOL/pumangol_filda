import { type ReactNode } from "react";

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
  className = "",
  hover = false,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-border bg-white shadow-sm ${paddings[padding]} ${hover ? "card-hover" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
