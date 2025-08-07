import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import React from "react";

interface PhoneNumberInputProps {
  label?: string;
  defaultCountry?: string;
  value: string;
  onChange: (value: string) => void;
}

export const StatefulPhoneInput = ({
  label,
  defaultCountry = "us",
  value,
  onChange,
}: PhoneNumberInputProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor="phone" className="text-neutralGray">
        {label}
      </label>

      <React.Fragment>
        <PhoneInput
          country={defaultCountry}
          value={value}
          onChange={(_, __, ___, formattedValue) => {
            onChange(formattedValue);
          }}
          inputProps={{
            name: "phone",
            id: "phone",
            placeholder: "",
          }}
          autoFormat={true}
          countryCodeEditable={true}
          inputClass="!w-full !rounded-lg focus:outline-none focus:!border-blue-500 transition-all duration-200 !bg-lightGray !border-mediumGray !py-5 !pl-16 focus-within:!outline-none !border-basicBlack !border-[1px] !text-[15px] !font-medium"
          buttonClass="bg-transparent border-none outline-none focus:outline-none !rounded-lg focus:outline-none focus:!border-blue-500  transition-all duration-200 !bg-white !py-2 !px-2 focus-within:outline-none border-basicBlack border-[1px]"
          specialLabel=""
        />
      </React.Fragment>
    </div>
  );
};

export default StatefulPhoneInput;
