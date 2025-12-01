/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  label: string;
  name: string;
  values: string[];
  setFieldValue: (field: string, value: any) => void;
  error?: string;
  touched?: boolean;
  placeholder: string;
  required?: boolean;
}

const TagInput = ({
  label,
  name,
  values,
  setFieldValue,
  error,
  touched,
  placeholder,
  required,
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!values.includes(inputValue.trim())) {
        setFieldValue(name, [...values, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    setFieldValue(
      name,
      values.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className="flex flex-col">
      <label className="block font-medium md:text-lg">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`border rounded-md p-2 min-h-[42px] bg-white ${
          touched && error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <div className="flex flex-wrap gap-2 mb-2">
          {values.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={values.length === 0 ? placeholder : ""}
          className="w-full outline-none text-sm bg-transparent"
        />
      </div>
      {touched && error && (
        <p className="text-sm text-red-500 italic mt-1">{error}</p>
      )}
    </div>
  );
};

export default TagInput;
