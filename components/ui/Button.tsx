import Link from "next/link";
import { type ReactNode } from "react";
import { Button as ShadcnButton } from "@/components/ui/primitives/button";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "yellow";
type Size = "sm" | "md" | "lg";

const variantMap = {
  primary: "default",
  secondary: "secondary",
  outline: "outline",
  ghost: "ghost",
  yellow: "yellow",
} as const;

const sizeMap = {
  sm: "sm",
  md: "default",
  lg: "lg",
} as const;

type ButtonProps = Omit<
  React.ComponentProps<typeof ShadcnButton>,
  "variant" | "size"
> & {
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
  className,
  ...props
}: ButtonProps) {
  const shadcnVariant = variantMap[variant];
  const shadcnSize = sizeMap[size];

  if (href) {
    return (
      <ShadcnButton
        asChild
        variant={shadcnVariant}
        size={shadcnSize}
        className={cn(fullWidth && "w-full", className)}
      >
        <Link href={href}>{children}</Link>
      </ShadcnButton>
    );
  }

  return (
    <ShadcnButton
      variant={shadcnVariant}
      size={shadcnSize}
      className={cn(fullWidth && "w-full", className)}
      {...props}
    >
      {children}
    </ShadcnButton>
  );
}
