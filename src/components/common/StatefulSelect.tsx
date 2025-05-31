import React from "react";
import type { IconType } from "react-icons";
import ErrorMessage from "./ErrorMessage";
import { ICONS } from "@agensy/constants";

interface SelectOption {
  label: string;
  value: string;
}

interface StatefulSelectProps {
  label?: string;
  data: SelectOption[];
  aria_label?: string;
  labelOption?: string;
  icon?: IconType;
  iconSize?: number;
  iconColor?: string;
  className?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  error?: string;
}

export const StatefulSelect: React.FC<StatefulSelectProps> = ({
  label,
  data,
  aria_label = "select",
  labelOption,
  icon: Icon,
  iconSize,
  iconColor,
  className = "",
  value,
  onChange,
  name,
  error,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 relative w-full">
        {label && (
          <label
            htmlFor={name || label}
            className="text-sm text-darkGray font-medium"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={name || label}
            name={name}
            aria-label={aria_label}
            value={value}
            onChange={onChange}
            className={`text-darkGray bg-lightGray placeholder:text-darkGray p-2 border-[1px] border-mediumGray rounded-xl w-full outline-none focus-within:border-basicBlue focus-within:shadow-sm focus-within:shadow-blue-200 transition-all duration-200 appearance-none ${className} ${
              Icon ? "pl-10" : "pr-8"
            }`}
          >
            {labelOption && <option value="">{labelOption}</option>}
            {data.map((item, index) => (
              <option key={index} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          {Icon && (
            <Icon
              className="absolute top-1/2 pointer-events-none -translate-y-1/2 left-3"
              size={iconSize}
              color={iconColor}
            />
          )}
          {!Icon && (
            <ICONS.downArrow className="absolute pointer-events-none top-1/2 -translate-y-1/2 right-3" />
          )}
        </div>
      </div>
      {error && <ErrorMessage error={error} />}
    </div>
  );
};

export default StatefulSelect;
