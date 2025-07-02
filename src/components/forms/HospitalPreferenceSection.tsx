import React from "react";
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import type { FaceSheetShortFormData } from "@agensy/types";
import { Input, Card, PhoneNumberInput } from "@agensy/components";

interface HospitalPreferenceSectionProps {
  register: UseFormRegister<FaceSheetShortFormData>;
  control: Control<FaceSheetShortFormData>;
  errors: FieldErrors<FaceSheetShortFormData>;
}

export const HospitalPreferenceSection: React.FC<
  HospitalPreferenceSectionProps
> = ({ register, control, errors }) => {
  return (
    <Card title="Hospital Preference">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Input
          label="Hospital Preference"
          register={register("hospitalPreference")}
          error={errors.hospitalPreference?.message}
        />
        <PhoneNumberInput
          label="Phone Number"
          control={control}
          name="hospitalPhoneNumber"
        />
        <Input
          label="Address"
          register={register("hospitalAddress")}
          error={errors.hospitalAddress?.message}
        />
      </div>
    </Card>
  );
};
