import React, { ButtonHTMLAttributes, ReactNode } from "react";
import classNames from "classnames";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "disabled"
  | "outline"
  | "extra"
  | "extra-outline";
type ButtonSize = "xs" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  icon?: ReactNode;
  icontwo?: ReactNode;
  loading?: boolean;
  loadingText?: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  size = "sm",
  variant = "primary",
  icon = null,
  icontwo = null,
  loading = false,
  className = "",
  loadingText,
  ...props
}) => (
  <button
    className={classNames(
      "inline-flex cursor-pointer items-center justify-center w-auto font-semibold rounded-xl transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#c77e3b]/30 disabled:opacity-50 disabled:pointer-events-none",
      {
        "py-1.5 px-3 text-xs": size === "xs",
        "py-2.5 px-4 text-sm": size === "sm",
        "bg-[#c77e3b] hover:bg-[#b06d2f] text-white border border-[#c77e3b]":
          variant === "primary",
        "bg-[#754f2c] hover:bg-[#5e3e21] text-white border border-[#754f2c]":
          variant === "secondary",
        "bg-[#5480c7] hover:bg-[#436db2] text-white border border-[#5480c7]":
          variant === "extra",
        "bg-stone-200 text-stone-500 border border-stone-200":
          variant === "disabled",
        "bg-white text-[#12161c] border border-[#e2dbd0] hover:bg-[#fff8ea] hover:border-[#c77e3b]/50":
          variant === "outline",
        "bg-white text-[#5480c7] border border-[#5480c7]/40 hover:bg-[#5480c7] hover:text-white":
          variant === "extra-outline",
        "cursor-not-allowed": loading,
      },
      className
    )}
    disabled={loading || props.disabled}
    {...props}
  >
    {icon && (
      <span
        className={`inline-flex items-center shrink-0 ${title ? "mr-2" : ""}`}
      >
        {icon}
      </span>
    )}
    {!loading && title && <span>{title}</span>}
    {loading && (
      <span className="flex items-center gap-2">
        {loadingText && <span>{loadingText}</span>}
        <span className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin" />
      </span>
    )}
    {icontwo && (
      <span
        className={`inline-flex items-center shrink-0 ${title ? "ml-2" : ""}`}
      >
        {icontwo}
      </span>
    )}
  </button>
);

export default Button;
