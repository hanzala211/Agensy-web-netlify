import type React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface RadioInputProps {
  register?: UseFormRegisterReturn;
  className?: string;
  label: string;
  value: string
}

export const RadioInput: React.FC<RadioInputProps> = ({
  register,
  className,
  label,
  value,
}) => {
  return (
    <label className="inline-flex items-center">
      <input
        type="radio"
        {...register}
        value={value}
        className={`${className} mr-1`}
      />
      <span className="md:text-[16px] text-[13px]">{label}</span>
    </label>
  );
};

export default RadioInput;
