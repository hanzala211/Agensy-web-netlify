import React from "react";
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import type { FaceSheetShortFormData } from "@agensy/types";
import { Input, Card, PhoneNumberInput } from "@agensy/components";

interface PharmacyInformationSectionProps {
  register: UseFormRegister<FaceSheetShortFormData>;
  control: Control<FaceSheetShortFormData>;
  errors: FieldErrors<FaceSheetShortFormData>;
}

export const PharmacyInformationSection: React.FC<
  PharmacyInformationSectionProps
> = ({ register, control, errors }) => {
  return (
    <Card title="Pharmacy Information">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Input
          label="Pharmacy Name"
          register={register("pharmacyName")}
          error={errors.pharmacyName?.message}
        />
        <PhoneNumberInput
          label="Phone"
          control={control}
          name="pharmacyPhone"
        />
        <PhoneNumberInput label="Fax" control={control} name="pharmacyFax" />
        <Input
          label="Address"
          register={register("pharmacyAddress")}
          error={errors.pharmacyAddress?.message}
        />
      </div>
    </Card>
  );
};
