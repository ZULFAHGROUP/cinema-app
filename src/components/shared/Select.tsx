/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select } from "antd";

interface Option {
  value: string;
  label?: string;
}

interface SelectProps {
  error?: string;
  labelClassName?: string;
  label?: string;
  conClassName?: string;
  defaultOption?: string;
  options: Option[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  disabled?: boolean;
  onBlur?: any;
  required?: boolean;
  className?: string;
  name?: string;
  id?: string;
  mode?: "multiple" | "tags";
  showSearch?: boolean;
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
  conClassName = "",
  mode,
  showSearch = true,
}: SelectProps) => {
  return (
    <div className={`flex flex-col ${conClassName}`}>
      {label && (
        <label
          htmlFor={name}
          className={`block font-medium md:text-lg ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <Select
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full ${className}`}
        disabled={disabled}
        mode={mode}
        showSearch={showSearch}
      >
        <Select.Option value="">{defaultOption}</Select.Option>
        {options.map((option, index) => (
          <Select.Option key={index} value={option.value}>
            {option.label ||
              option.value.charAt(0).toUpperCase() + option.value.slice(1)}
          </Select.Option>
        ))}
      </Select>
      {error && <p className="text-sm text-red-500 italic mt-1">{error}</p>}
    </div>
  );
};

export default ReusableSelect;
