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
      "inline-flex cursor-pointer items-center justify-center w-auto font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c77e3b]/30 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
      {
        "py-1.5 px-3 text-xs": size === "xs",
        "py-2.5 px-5 text-sm": size === "sm",
        "bg-gradient-to-r from-[#c77e3b] to-[#b56e2d] hover:from-[#b56e2d] hover:to-[#9e5d22] text-white shadow-sm shadow-[#c77e3b]/25 hover:shadow-md hover:shadow-[#c77e3b]/30":
          variant === "primary",
        "bg-gradient-to-r from-[#754f2c] to-[#5e3e21] hover:from-[#5e3e21] hover:to-[#4a3019] text-white shadow-sm shadow-[#754f2c]/25 hover:shadow-md":
          variant === "secondary",
        "bg-gradient-to-r from-[#5480c7] to-[#436db2] hover:from-[#436db2] hover:to-[#365a96] text-white shadow-sm shadow-[#5480c7]/25 hover:shadow-md":
          variant === "extra",
        "bg-[#cadbb7]/80 text-white": variant === "disabled",
        "bg-white/80 text-[#c77e3b] border border-[#c77e3b]/40 hover:bg-[#c77e3b] hover:text-white hover:border-[#c77e3b] shadow-2xs":
          variant === "outline",
        "bg-white/80 text-[#5480c7] border border-[#5480c7]/40 hover:bg-[#5480c7] hover:text-white hover:border-[#5480c7] shadow-2xs":
          variant === "extra-outline",
        "cursor-not-allowed": loading,
      },
      className
    )}
    disabled={loading || props.disabled}
    {...props}
  >
    {icon && (
      <span className={`inline-flex items-center shrink-0 ${title ? "mr-2" : ""}`}>
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
      <span className={`inline-flex items-center shrink-0 ${title ? "ml-2" : ""}`}>
        {icontwo}
      </span>
    )}
  </button>
);

export default Button;
