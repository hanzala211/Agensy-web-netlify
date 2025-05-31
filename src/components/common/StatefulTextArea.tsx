import React, { useState } from "react";
import { ErrorMessage } from "@agensy/components";

interface StatefulTextAreaProps {
  label?: string;
  placeholder?: string;
  className?: string;
  name?: string;
  rows?: number;
  initialValue?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
}

export const StatefulTextArea: React.FC<StatefulTextAreaProps> = ({
  label,
  placeholder,
  className = "",
  name,
  rows = 4,
  initialValue = "",
  value,
  onChange,
  error,
}) => {
  const [internalValue, setInternalValue] = useState(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(event);
    } else {
      setInternalValue(event.target.value);
    }
  };

  const displayValue = value !== undefined ? value : internalValue;

  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-col relative w-full">
        {label && !placeholder && <label htmlFor={name}>{label}</label>}
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          value={displayValue}
          onChange={handleChange}
          rows={rows}
          className={`text-darkGray bg-lightGray placeholder:text-darkGray p-2 border-[1px] border-mediumGray rounded-xl w-full outline-none focus-within:border-basicBlue focus-within:shadow-sm focus-within:shadow-blue-200 transition-all duration-200 ${className}`}
        />
      </div>
      {error && <ErrorMessage error={error} />}
    </div>
  );
};

export default StatefulTextArea;
