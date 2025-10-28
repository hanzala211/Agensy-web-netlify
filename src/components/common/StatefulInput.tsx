import React from "react";
import type { IconType } from "react-icons";
import ErrorMessage from "./ErrorMessage";

interface StatefulInputProps {
  label?: string;
  placeholder?: string;
  inputClassname?: string;
  name?: string;
  type?: string;
  icon?: IconType;
  iconSize?: number;
  iconColor?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  min?: string;
}

export const StatefulInput: React.FC<StatefulInputProps> = ({
  label,
  placeholder,
  inputClassname = "",
  name,
  type = "text",
  icon: Icon,
  iconSize,
  iconColor,
  value,
  onChange,
  error,
  min,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-col relative w-full">
        {label && !placeholder && <label htmlFor={name}>{label}</label>}
        <input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`!text-darkGray !bg-lightGray p-2 
                  border-[1px] border-mediumGray !font-normal placeholder:!text-darkGray rounded-md w-full outline-none focus-within:border-basicBlue focus-within:shadow-sm focus-within:shadow-blue-200 transition  -all duration-200 ${inputClassname} ${
            Icon ? "pl-10" : ""
          }`}
          min={min}
        />
        {Icon && (
          <Icon
            className="absolute top-1/2 -translate-y-1/2 left-3"
            size={iconSize}
            color={iconColor}
          />
        )}
      </div>
      {error && <ErrorMessage error={error} />}
    </div>
  );
};

export default StatefulInput;
