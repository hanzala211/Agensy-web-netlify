import React from "react";
import type { IconType } from "react-icons";
import { ICONS } from "@agensy/constants";
import { Select as AntSelect } from "antd";

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
  onSelectChange?: (value: string) => void;
  name?: string;
}

export const StatefulSelect: React.FC<StatefulSelectProps> = ({
  label,
  data,
  labelOption,
  icon: Icon,
  iconSize,
  iconColor,
  className = "",
  value,
  onChange,
  onSelectChange,
  name,
}) => {
  const options = [
    ...(labelOption ? [{ label: labelOption, value: "" }] : []),
    ...data.map((item) => ({
      label: item.label,
      value: item.value,
    })),
  ];

  const handleChange = (newValue: string) => {
    if (onSelectChange) {
      onSelectChange(newValue);
    }
    if (onChange) {
      // Create a synthetic event for backward compatibility
      const syntheticEvent = {
        target: { value: newValue, name: name || "" },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    }
  };

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
        <AntSelect
          value={value || undefined}
          onChange={handleChange}
          //   @ts-expect-error - AntD Select types
          options={options}
          placeholder={labelOption}
          className={`${className} w-full`}
          style={{ width: "100%" }}
          size="large"
          suffixIcon={
            Icon ? (
              <Icon size={iconSize || 16} color={iconColor || "#6B7280"} />
            ) : (
              <ICONS.downArrow size={16} />
            )
          }
        />
      </div>
    </div>
  );
};

export default StatefulSelect;
