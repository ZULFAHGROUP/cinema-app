import { Input as AntInput, InputProps as AntInputProps } from "antd";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface InputProps extends Omit<AntInputProps, "size"> {
  label?: string;
  labelClassName?: string;
  conClassName?: string;
  error?: string;
  hint?: string;
  restrictFutureDate?: boolean;
  restrictPastDate?: boolean;
}

const Input = ({
  type = "text",
  placeholder = "",
  className = "",
  labelClassName = "",
  label = "",
  value,
  disabled = false,
  required = false,
  readOnly = false,
  error,
  hint,
  conClassName = "",
  restrictFutureDate = false,
  restrictPastDate = false,
  onChange,
  ...props
}: InputProps) => {
  const getTodayDate = () => new Date().toISOString().split("T")[0];

  return (
    <div className={`flex flex-col ${conClassName}`}>
      {label && (
        <label
          htmlFor={props.id || props.name}
          className={`block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-[#c77e3b] ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {type === "password" ? (
          <AntInput.Password
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            className={`py-2 pr-10 rounded-xl text-sm ${className} ${
              error
                ? "border-red-500"
                : "border-stone-200/90 hover:border-[#c77e3b] focus:border-[#c77e3b]"
            }`}
            onChange={onChange}
            iconRender={(visible) =>
              visible ? (
                <FiEyeOff className="cursor-pointer text-stone-400" />
              ) : (
                <FiEye className="cursor-pointer text-stone-400" />
              )
            }
            {...props}
          />
        ) : (
          <AntInput
            type={type}
            placeholder={placeholder}
            value={type === "file" ? undefined : value}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            className={`py-2 rounded-xl text-sm ${className} ${
              error
                ? "border-red-500"
                : "border-stone-200/90 hover:border-[#c77e3b] focus:border-[#c77e3b]"
            }`}
            onChange={onChange}
            {...(type === "date" &&
              restrictFutureDate && { max: getTodayDate() })}
            {...(type === "date" &&
              restrictPastDate && { min: getTodayDate() })}
            {...props}
          />
        )}
      </div>

      {hint && !error && (
        <p className="text-[11px] text-stone-400 mt-1 leading-snug">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-500 font-medium mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
