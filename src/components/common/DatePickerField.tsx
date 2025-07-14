/* eslint-disable */ // turn off every ESLint rule for this file
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable react-hooks/rules-of-hooks */
// @ts-nocheck
import { DATE_FOMRAT } from "@agensy/constants";
import dayjs from "dayjs";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { DatePicker as AntdDatePicker } from "antd";
import { ErrorMessage } from "@agensy/components";
import type { IconType } from "react-icons";
import React, { useState } from "react";

interface DatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  className?: string;
  icon?: IconType;
  size?: number;
  color?: string;
  label?: string;
  showTime?: boolean;
  monthYearOnly?: boolean;
}

export const DatePickerField = <T extends FieldValues>({
  control,
  name,
  placeholder,
  className = "",
  icon: Icon,
  size,
  color,
  label,
  showTime = false,
  monthYearOnly = false,
}: DatePickerProps<T>) => {
  const [error, setError] = useState("");
  
  const getDateFormat = () => {
    if (monthYearOnly) return "MM/YYYY";
    if (showTime) return `${DATE_FOMRAT} hh:mm A`;
    return DATE_FOMRAT;
  };
  
  const dateFormat = getDateFormat();

  return (
    <div className="space-y-2">
      {label && <label htmlFor={name}>{label}</label>}
      <div className="flex gap-2 flex-col relative w-full">
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState: { error } }) => {
            setError(error?.message || "");
            return (
              <React.Fragment>
                <AntdDatePicker
                  id={name}
                  format={dateFormat}
                  placeholder={placeholder || dateFormat}
                  className={`${className} !text-darkGray !bg-lightGray p-2
                  border-[1px] border-mediumGray rounded-xl font-semibold  w-full outline-none focus-within:border-basicBlue focus-within:shadow-sm focus-within:shadow-blue-200 transition-all duration-200`}
                  onChange={(date: any, dateString: string | string[]) => {
                    field.onChange(dateString);
                  }}
                  showTime={showTime ? { format: "hh:mm A", use12Hours: true } : false}
                  picker={monthYearOnly ? "month" : "date"}
                  suffixIcon={null}
                  value={field.value ? dayjs(field.value, dateFormat) : undefined}
                />
              </React.Fragment>
            );
          }}
        />
        {Icon && (
          <Icon
            className="absolute top-1/2 -translate-y-1/2 left-3"
            size={size}
            color={color}
          />
        )}
      </div>
      <ErrorMessage error={error} />
    </div>
  );
};
