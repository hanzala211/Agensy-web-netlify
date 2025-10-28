/* eslint-disable */ // turn off every ESLint rule for this file
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable react-hooks/rules-of-hooks */
// @ts-nocheck
import { DATE_FOMRAT } from "@agensy/constants";
import { DatePicker as AntdDatePicker } from "antd";
import dayjs from "dayjs";
import React from "react";

interface DatePickerProps {
  placeholder?: string;
  className?: string;
  color?: string;
  label?: string;
  showTime?: boolean;
  value: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  onChangeFunc?: (date: string) => void;
  divClass?: string;
}

export const StatefulDatePicker = ({
  placeholder,
  className = "",
  label,
  showTime = false,
  value,
  setValue,
  onChangeFunc,
  divClass = "",
}: DatePickerProps) => {
  const dateFormat = showTime ? `${DATE_FOMRAT} hh:mm A` : DATE_FOMRAT;

  return (
    <div className={`space-y-2 ${divClass}`}>
      {label && <label>{label}</label>}
      <div className="flex gap-2 flex-col relative w-full">
        <React.Fragment>
          <AntdDatePicker
            id={name}
            format={dateFormat}
            placeholder={placeholder || dateFormat}
            className={`${className} !text-darkGray !bg-lightGray p-2
                    border-[1px] border-mediumGray placeholder:!text-gray-400 !rounded-md font-semibold  w-full outline-none focus-within:border-basicBlue focus-within:shadow-sm focus-within:shadow-blue-200 transition-all duration-200`}
            onChange={(_: unknown, dateString: string | string[]) => {
              if (onChangeFunc) {
                onChangeFunc(dateString);
              } else {
                setValue(dateString);
              }
            }}
            showTime={
              showTime ? { format: "hh:mm A", use12Hours: true } : false
            }
            suffixIcon={null}
            value={value ? dayjs(value) : undefined}
          />
        </React.Fragment>
      </div>
    </div>
  );
};

export default StatefulDatePicker;
