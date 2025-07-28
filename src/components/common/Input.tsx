import type { IconType } from "react-icons";
import ErrorMessage from "./ErrorMessage";
import type { UseFormRegisterReturn } from "react-hook-form";
import { ICONS } from "@agensy/constants";
import { useState } from "react";

interface InputProps {
  label?: string;
  placeholder?: string;
  inputClassname?: string;
  name?: string;
  type?: string;
  icon?: IconType;
  size?: number;
  color?: string;
  error?: string;
  register?: UseFormRegisterReturn;
  isPassword?: boolean;
  mainClassname?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  inputClassname,
  name,
  type = "text",
  icon: Icon,
  size,
  color,
  error,
  register,
  isPassword = false,
  mainClassname = "",
}) => {
  const [selectedType, setSelectedType] = useState<string>(type);

  return (
    <div className={`space-y-2 ${mainClassname}`}>
      {label && !placeholder && <label htmlFor={name}>{label}</label>}
      <div className="flex gap-2 flex-col relative w-full">
        <input
          {...register}
          type={selectedType}
          id={name}
          placeholder={placeholder}
          className={`${inputClassname} text-darkGray bg-lightGray placeholder:text-darkGray p-2
          border-[1px] border-mediumGray rounded-xl w-full outline-none focus-within:border-basicBlue focus-within:shadow-sm focus-within:shadow-blue-200 transition-all duration-200`}
        />
        {Icon && (
          <Icon
            className="absolute top-1/2 -translate-y-1/2 left-3"
            size={size}
            color={color}
          />
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() =>
              setSelectedType(selectedType === "password" ? "text" : "password")
            }
            className="absolute top-1/2 -translate-y-1/2 right-3"
          >
            {selectedType === "password" ? (
              <ICONS.eyeOn size={20} />
            ) : (
              <ICONS.eyeOff size={20} />
            )}
          </button>
        )}
      </div>
      {error && <ErrorMessage error={error} />}
    </div>
  );
};
