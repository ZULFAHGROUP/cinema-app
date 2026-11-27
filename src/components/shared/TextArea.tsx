import React from "react";
import { Input } from "antd";

const { TextArea: AntdTextArea } = Input;

interface TextAreaProps {
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  label?: string;
  maxLength?: number;
  minLength?: number;
  name?: string;
  id?: string;
  value?: string;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  error?: string;
  hint?: string;
  conClassName?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  placeholder = "",
  className = "resize-none",
  labelClassName = "",
  onChange,
  label = "",
  onBlur,
  onFocus,
  maxLength,
  name,
  id,
  value,
  rows = 3,
  disabled = false,
  required = false,
  readOnly = false,
  error,
  hint,
  conClassName = "",
}) => {
  return (
    <div className={`flex flex-col ${conClassName}`}>
      {label && (
        <label
          htmlFor={id || name}
          className={`text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5 block ${labelClassName}`}
        >
          {label}
          {required && <span className="text-[#c77e3b] ml-1">*</span>}
        </label>
      )}
      <AntdTextArea
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        name={name}
        id={id}
        value={value}
        rows={rows}
        className={`rounded-xl text-sm border-stone-200/90 hover:border-[#c77e3b] focus:border-[#c77e3b] ${
          error ? "border-red-500" : ""
        } ${className}`}
        maxLength={maxLength}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
      />
      {hint && !error && (
        <p className="text-[11px] text-stone-400 mt-1 leading-snug">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-500 font-medium mt-1">{error}</p>
      )}
    </div>
  );
};

export default TextArea;
