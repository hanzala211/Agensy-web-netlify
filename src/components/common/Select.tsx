import { ErrorMessage } from "@agensy/components";
import { useState } from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import type { IconType } from "react-icons";
import { Select as AntSelect } from "antd";

interface SelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  data: { label: string; value: string }[];
  aria_label?: string;
  labelOption?: string;
  icon?: IconType;
  size?: number;
  color?: string;
  className?: string;
  showButton?: boolean;
  buttonLabel?: string;
  // New props for text input functionality
  enableTextInput?: boolean;
  textInputTriggerValue?: string;
  textInputName?: Path<T>;
  textInputPlaceholder?: string;
  optionFilterProp?: string;
  showSearch?: boolean;
}

export const Select = <T extends FieldValues>({
  control,
  name,
  label,
  data,
  labelOption,
  icon: Icon,
  size,
  color,
  className = "",
  showButton = false,
  buttonLabel = "Add New One",
  // New props with defaults
  enableTextInput = false,
  textInputTriggerValue = "add-new-one",
  textInputName,
  textInputPlaceholder = "Enter custom value",
  optionFilterProp = "",
  showSearch = false,
}: SelectProps<T>) => {
  const [error, setError] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

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
            setSelectedValue(field.value || "");

            const options = [
              ...(labelOption ? [{ label: labelOption, value: "" }] : []),
              ...data
                .filter((item) => item && item.value !== undefined)
                .map((item) => ({
                  label: item.label,
                  value: item.value || "",
                })),
              ...(showButton
                ? [{ label: buttonLabel, value: "add-new-one" }]
                : []),
            ];

            return (
              <div
                className={`flex gap-2 ${
                  enableTextInput &&
                  selectedValue === textInputTriggerValue &&
                  textInputName
                    ? "w-full"
                    : ""
                }`}
              >
                <div
                  className={`relative ${
                    enableTextInput &&
                    selectedValue === textInputTriggerValue &&
                    textInputName
                      ? "flex-1"
                      : "w-full"
                  }`}
                >
                  <AntSelect
                    value={field.value || undefined}
                    onChange={field.onChange}
                    //  @ts-expect-error - AntD Select types
                    options={options}
                    placeholder={labelOption}
                    className={`${className} w-full`}
                    optionFilterProp={optionFilterProp || "label"}
                    filterOption={(
                      input: string,
                      option: { label?: string; value?: string }
                    ) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    style={{ width: "100%" }}
                    size="large"
                    suffixIcon={
                      Icon ? (
                        <Icon size={size || 16} color={color || "#6B7280"} />
                      ) : undefined
                    }
                    showSearch={showSearch}
                  />
                </div>

                {/* Conditional text input */}
                {enableTextInput &&
                  selectedValue === textInputTriggerValue &&
                  textInputName && (
                    <div className="flex-1">
                      <Controller
                        name={textInputName}
                        control={control}
                        render={({ field: textField }) => (
                          <input
                            id={`${name}-text-input`}
                            type="text"
                            placeholder={textInputPlaceholder}
                            {...textField}
                            className={`${className} text-darkGray bg-lightGray placeholder:text-darkGray p-2
                          border-[1px] border-mediumGray rounded-md w-full outline-none focus-within:border-basicBlue focus-within:shadow-sm focus-within:shadow-blue-200 transition-all duration-200`}
                          />
                        )}
                      />
                    </div>
                  )}
              </div>
            );
          }}
        />
      </div>
      <ErrorMessage error={error} />
    </div>
  );
};

export default Select;
