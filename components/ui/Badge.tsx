import { Badge as ShadcnBadge } from "@/components/ui/primitives/badge";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "red" | "yellow" | "green" | "blue" | "gray";

const variantMap = {
  default: "default",
  red: "red",
  yellow: "yellow",
  green: "green",
  blue: "blue",
  gray: "gray",
} as const;

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <ShadcnBadge
      variant={variantMap[variant]}
      className={cn(className)}
    >
      {children}
    </ShadcnBadge>
  );
}
