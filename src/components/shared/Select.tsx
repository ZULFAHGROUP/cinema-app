/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select } from "antd";

interface Option {
  value: string | number;
  label?: string;
  disabled?: boolean;
}

interface SelectProps {
  error?: string;
  hint?: string;
  labelClassName?: string;
  label?: string;
  conClassName?: string;
  defaultOption?: string;
  options: Option[];
  value?: any;
  onChange?: (value: any) => void;
  disabled?: boolean;
  onBlur?: any;
  required?: boolean;
  className?: string;
  name?: string;
  id?: string;
  mode?: "multiple" | "tags";
  showSearch?: boolean;
  allowClear?: boolean;
}

const ReusableSelect = ({
  name,
  id,
  className = "",
  labelClassName = "",
  label = "",
  options = [],
  onChange,
  onBlur,
  value,
  disabled = false,
  defaultOption = "Select an option",
  error,
  hint,
  conClassName = "",
  mode,
  showSearch = true,
  allowClear = false,
  required = false,
}: SelectProps) => {
  // Normalize empty string to undefined so Ant Design displays the placeholder cleanly
  const normalizedValue =
    mode === "multiple" || mode === "tags"
      ? Array.isArray(value)
        ? value
        : value
        ? [value]
        : []
      : value === "" || value === null
      ? undefined
      : value;

  return (
    <div className={`flex flex-col ${conClassName}`}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-[#c77e3b] ml-1">*</span>}
        </label>
      )}
      <Select
        id={id}
        value={normalizedValue}
        placeholder={defaultOption}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full min-h-[40px] ${className}`}
        disabled={disabled}
        mode={mode}
        showSearch={showSearch}
        allowClear={allowClear}
        optionFilterProp="children"
        status={error ? "error" : undefined}
      >
        {options.map((option, index) => (
          <Select.Option
            key={`${option.value}-${index}`}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label ||
              (option.value && typeof option.value === "string"
                ? option.value.charAt(0).toUpperCase() + option.value.slice(1)
                : option.value)}
          </Select.Option>
        ))}
      </Select>
      {hint && !error && (
        <p className="text-[11px] text-stone-400 mt-1 leading-snug">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-500 font-medium mt-1">{error}</p>
      )}
    </div>
  );
};

export default ReusableSelect;
