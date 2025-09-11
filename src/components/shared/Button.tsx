import React, { ButtonHTMLAttributes, ReactNode } from "react";
import classNames from "classnames";

type ButtonVariant = "primary" | "secondary" | "disabled" | "outline";
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
      "inline-flex cursor-pointer items-center justify-center w-auto font-medium focus:outline-none disabled:opacity-50",
      {
        "py-1 px-2 text-base font-light": size === "xs",
        "py-2 px-6 text-base font-normal": size === "sm",
        "bg-[#c77e3b] text-white shadow": variant === "primary",
        "bg-[#754f2c] text-white shadow": variant === "secondary",
        "bg-opacity-80 bg-[#cadbb7] text-white": variant === "disabled",
        "bg-transparent text-[#c77e3b] border border-[#c77e3b] hover:bg-[#c77e3b] hover:text-white transition-colors":
          variant === "outline",
        "cursor-not-allowed": loading,
      },
      className
    )}
    disabled={loading || props.disabled}
    {...props}
  >
    {icon && (
      <span className={`bg-opacity-50 ${title ? "mr-2" : ""}`}>{icon}</span>
    )}
    {!loading && title && <span>{title}</span>}
    {loading && (
      <span className="flex items-center gap-2">
        {loadingText && <span>{loadingText}</span>}
        <span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
      </span>
    )}
    {icontwo && <span className={`${title ? "ml-2" : ""}`}>{icontwo}</span>}
  </button>
);

export default Button;
