import { forwardRef, type ButtonHTMLAttributes } from "react";
import Link, { type LinkProps } from "next/link";

// ── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant = "primary" | "ghost" | "danger" | "dark";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** w-full */
  fullWidth?: boolean;
  /** flex-1 — for buttons inside a flex row that should share space equally */
  stretch?: boolean;
}

// ── Style maps ───────────────────────────────────────────────────────────────

const VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm",
  ghost:   "bg-white text-gray-700 border border-gray-300 hover:border-gray-900",
  danger:  "bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 hover:border-red-300",
  dark:    "bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-900",
};

const SIZE: Record<ButtonSize, string> = {
  sm:  "px-3.5 py-2   text-sm  rounded-xl min-h-[40px]",
  md:  "px-4   py-2.5 text-sm  rounded-xl min-h-[44px]",
  lg:  "px-5   py-3   text-base rounded-xl min-h-[50px]",
  xl:  "px-5   py-4   text-base rounded-xl min-h-[52px]",
};

const BASE =
  "inline-flex items-center justify-center gap-2 font-semibold " +
  "transition-all active:scale-[0.98] " +
  "disabled:opacity-40 disabled:cursor-not-allowed select-none";

export function buildButtonClass({
  variant = "primary",
  size = "md",
  fullWidth = false,
  stretch = false,
  className = "",
}: ButtonStyleProps & { className?: string }) {
  return [
    BASE,
    VARIANT[variant],
    SIZE[size],
    fullWidth  ? "w-full"  : "",
    stretch    ? "flex-1"  : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

// ── <Button> — wraps <button> ────────────────────────────────────────────────

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonStyleProps {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      stretch = false,
      loading = false,
      disabled,
      className = "",
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={buildButtonClass({ variant, size, fullWidth, stretch, className })}
        {...rest}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin w-4 h-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);
Button.displayName = "Button";

// ── <LinkButton> — wraps Next.js <Link> ────────────────────────────────────

export interface LinkButtonProps
  extends Omit<LinkProps, "className">,
    ButtonStyleProps {
  className?: string;
  children: React.ReactNode;
}

export function LinkButton({
  variant = "primary",
  size = "md",
  fullWidth = false,
  stretch = false,
  className = "",
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <Link
      className={buildButtonClass({ variant, size, fullWidth, stretch, className })}
      {...rest}
    >
      {children}
    </Link>
  );
}
