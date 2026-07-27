'use client'

import { type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  as?: "button" | "a";
  href?: string;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-secondary text-on-secondary font-bold rounded-full px-8 py-3.5 shadow-button hover:scale-105 active:scale-[0.98] transition-all duration-300 ease-squish",
  secondary:
    "bg-primary-container text-on-primary-container font-bold rounded-full px-8 py-3.5 hover:scale-105 active:scale-[0.98] transition-all duration-300 ease-squish",
  ghost:
    "bg-transparent text-on-surface font-bold rounded-full px-8 py-3.5 border-2 border-on-surface hover:bg-surface-container active:scale-[0.98] transition-all duration-300 ease-squish",
};

export default function Button({
  variant = "primary",
  as = "button",
  href,
  className = "",
  children,
  ...props
}: ButtonProps) {
  if (as === "a" && href) {
    return (
      <a href={href} className={`inline-block text-center ${variantStyles[variant]} ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <button className={`${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
