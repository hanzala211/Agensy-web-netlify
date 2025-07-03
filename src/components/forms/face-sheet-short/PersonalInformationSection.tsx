import React from "react";
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import type { FaceSheetShortFormData } from "@agensy/types";
import {
  Input,
  Card,
  DatePickerField,
  PhoneNumberInput,
} from "@agensy/components";

interface PersonalInformationSectionProps {
  register: UseFormRegister<FaceSheetShortFormData>;
  control: Control<FaceSheetShortFormData>;
  errors: FieldErrors<FaceSheetShortFormData>;
}

export const PersonalInformationSection: React.FC<
  PersonalInformationSectionProps
> = ({ register, control, errors }) => {
  return (
    <Card title="Personal Information">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Input
          label="Full Name"
          register={register("name")}
          error={errors.name?.message}
        />
        <PhoneNumberInput
          label="Phone Number"
          control={control}
          name="phoneNumber"
        />
        <DatePickerField
          control={control}
          name="dateOfBirth"
          label="Date of Birth"
        />
        <Input
          label="SSN"
          register={register("ssn")}
          error={errors.ssn?.message}
        />
        <div className="lg:col-span-4">
          <Input
            label="Address"
            register={register("address")}
            error={errors.address?.message}
          />
        </div>
      </div>
    </Card>
  );
};
