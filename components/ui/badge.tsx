import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "sale" | "new" | "featured" | "popular" | "default";
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        {
          "bg-red-100 text-red-600": variant === "sale",
          "bg-green-100 text-green-600": variant === "new",
          "bg-orange-100 text-orange-600": variant === "featured",
          "bg-blue-100 text-blue-600": variant === "popular",
          "bg-gray-100 text-gray-600": variant === "default",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
