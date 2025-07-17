import { ErrorMessage } from "@agensy/components";
import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";

interface ScoringInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  className?: string;
}

export const ScoringInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "e.g., 26/30",
  className = "",
}: ScoringInputProps<T>) => {
  const [displayValue, setDisplayValue] = useState("");
  const [error, setError] = useState("");

  const formatScore = (value: string) => {
    // Remove all non-digit characters except "/"
    const cleaned = value.replace(/[^\d/]/g, "");
    
    // Split by "/"
    const parts = cleaned.split("/");
    
    if (parts.length === 1) {
      // Only score entered
      const score = parts[0].slice(0, 2); // Limit to 2 digits
      return score;
    } else if (parts.length === 2) {
      // Both score and total entered
      const score = parts[0].slice(0, 2); // Limit to 2 digits
      const total = parts[1].slice(0, 2); // Limit to 2 digits
      return `${score}/${total}`;
    }
    
    return cleaned;
  };

  const handleInputChange = (value: string, onChange: (value: string) => void) => {
    const formatted = formatScore(value);
    setDisplayValue(formatted);
    onChange(formatted);
  };

  // Initialize display value when field value changes
  useEffect(() => {
    if (control._formValues[name] && !displayValue) {
      setDisplayValue(control._formValues[name]);
    }
  }, [control._formValues[name], displayValue, name]);

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 relative w-full">
        {label && (
          <label htmlFor={label} className="text-neutralGray">
            {label}
          </label>
        )}
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState: { error } }) => {
            setError(error?.message || "");
            
            // Initialize display value if field has a value
            if (field.value && !displayValue) {
              setDisplayValue(field.value);
            }

            return (
              <input
                id={label}
                type="text"
                placeholder={placeholder}
                value={displayValue}
                onChange={(e) => handleInputChange(e.target.value, field.onChange)}
                onBlur={field.onBlur}
                className={`${className} text-darkGray bg-lightGray placeholder:text-darkGray p-2
                  border-[1px] border-mediumGray rounded-xl w-full outline-none focus-within:border-basicBlue focus-within:shadow-sm focus-within:shadow-blue-200 transition-all duration-200`}
              />
            );
          }}
        />
      </div>
      <ErrorMessage error={error} />
    </div>
  );
};

export default ScoringInput; 
