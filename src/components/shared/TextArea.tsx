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
  rows = 2,
  disabled = false,
  required = false,
  readOnly = false,
  error,
  conClassName = "",
}) => {
  return (
    <div className={`flex flex-col ${conClassName}`}>
      {label && (
        <label
          htmlFor={id}
          className={`font-medium md:text-lg block ${labelClassName}`}
        >
          {label}
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
        className={className}
        maxLength={maxLength}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
      />
      {error && <p className="text-sm text-red-500 italic mt-1">{error}</p>}
    </div>
  );
};

export default TextArea;
