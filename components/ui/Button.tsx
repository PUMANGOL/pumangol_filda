import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "yellow";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-pumangol-red text-white hover:bg-pumangol-red-dark shadow-md hover:shadow-lg",
  secondary:
    "bg-gray-800 text-white hover:bg-gray-900 shadow-md hover:shadow-lg",
  outline:
    "border-2 border-pumangol-red text-pumangol-red hover:bg-pumangol-red hover:text-white",
  ghost: "text-gray-700 hover:bg-gray-100",
  yellow:
    "bg-pumangol-yellow text-gray-900 hover:bg-pumangol-yellow-light shadow-md hover:shadow-lg font-semibold",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  href?: string;
  fullWidth?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  href,
  fullWidth,
  className = "",
  ...props
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pumangol-red focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
