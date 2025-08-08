import { Input as AntInput, InputProps as AntInputProps } from "antd";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface InputProps extends Omit<AntInputProps, "size"> {
  label?: string;
  labelClassName?: string;
  conClassName?: string;
  error?: string;
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
          htmlFor={props.id}
          className={`block font-medium md:text-lg ${labelClassName}`}
        >
          {label}
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
            className={`py-2 pr-10 ${className} ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            onChange={onChange}
            iconRender={(visible) =>
              visible ? (
                <FiEyeOff className="cursor-pointer" />
              ) : (
                <FiEye className="cursor-pointer" />
              )
            }
            {...props}
          />
        ) : (
          <AntInput
            type={type}
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            className={`py-2 ${className} ${
              error ? "border-red-500" : "border-gray-300"
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

      {error && <p className="text-sm text-red-500 italic mt-1">{error}</p>}
    </div>
  );
};

export default Input;
