"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ff6600]/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-[#ff6600] text-white hover:bg-[#e65c00]": variant === "primary",
            "bg-[#29ac00] text-white hover:bg-[#228a00]": variant === "secondary",
            "border-2 border-[#ff6600] text-[#ff6600] hover:bg-[#ff6600] hover:text-white": variant === "outline",
            "text-[#ff6600] hover:bg-[#fff3e6]": variant === "ghost",
            "bg-red-500 text-white hover:bg-red-600": variant === "danger",
          },
          {
            "h-10 px-4 text-sm": size === "sm",
            "h-11 px-6 text-sm": size === "md",
            "h-12 px-8 text-base": size === "lg",
          },
          loading && "relative text-transparent",
          className
        )}
        {...props}
      >
        {children}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, type ButtonProps };
export default Button;
