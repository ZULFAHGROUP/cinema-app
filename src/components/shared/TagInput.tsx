/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Plus, X } from "lucide-react";

interface TagInputProps {
  label: string;
  name: string;
  values: string[];
  setFieldValue: (field: string, value: any) => void;
  error?: string;
  touched?: boolean;
  placeholder: string;
  required?: boolean;
  suggestions?: string[];
  hint?: string;
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
  suggestions = [],
  hint,
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const addTag = (raw: string) => {
    const cleaned = raw.trim().replace(/,$/, "").trim();
    if (cleaned && !values.includes(cleaned)) {
      setFieldValue(name, [...values, cleaned]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && values.length > 0) {
      removeTag(values.length - 1);
    }
  };

  const removeTag = (indexToRemove: number) => {
    setFieldValue(
      name,
      values.filter((_, index) => index !== indexToRemove)
    );
  };

  const availableSuggestions = suggestions.filter((s) => !values.includes(s));

  return (
    <div className="flex flex-col">
      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
        {label} {required && <span className="text-[#c77e3b]">*</span>}
      </label>
      <div
        className={`border rounded-xl p-2.5 min-h-[42px] bg-white transition-colors ${
          touched && error
            ? "border-red-500"
            : "border-stone-200/90 hover:border-[#c77e3b] focus-within:border-[#c77e3b]"
        }`}
      >
        {values.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {values.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 bg-[#fff8ea] text-[#754f2c] border border-[#c77e3b]/30 px-2.5 py-0.5 rounded-full text-xs font-semibold"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="hover:bg-[#c77e3b]/20 rounded-full p-0.5 transition-colors cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (inputValue.trim()) addTag(inputValue);
            }}
            placeholder={
              values.length === 0
                ? placeholder
                : "Type another and press Enter..."
            }
            className="w-full outline-none text-sm bg-transparent text-stone-800 placeholder:text-stone-400"
          />
          {inputValue.trim() && (
            <button
              type="button"
              onClick={() => addTag(inputValue)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#c77e3b]/15 text-[#754f2c] hover:bg-[#c77e3b]/25 text-xs font-semibold shrink-0 cursor-pointer transition-colors"
            >
              <Plus size={12} /> Add
            </button>
          )}
        </div>
      </div>

      {availableSuggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          <span className="text-[11px] text-stone-400 mr-0.5">Quick add:</span>
          {availableSuggestions.slice(0, 6).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addTag(suggestion)}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 hover:bg-[#fff8ea] text-stone-600 hover:text-[#754f2c] border border-stone-200/80 hover:border-[#c77e3b]/40 transition-colors cursor-pointer"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      )}

      {hint && !error && (
        <p className="text-[11px] text-stone-400 mt-1 leading-snug">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-500 font-medium mt-1">{error}</p>
      )}
    </div>
  );
};

export default TagInput;
