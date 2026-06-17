type BadgeVariant = "default" | "red" | "yellow" | "green" | "blue" | "gray";

const variants: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700",
  red: "bg-red-50 text-pumangol-red",
  yellow: "bg-yellow-50 text-yellow-800",
  green: "bg-green-50 text-green-700",
  blue: "bg-blue-50 text-blue-700",
  gray: "bg-gray-100 text-gray-600",
};

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
