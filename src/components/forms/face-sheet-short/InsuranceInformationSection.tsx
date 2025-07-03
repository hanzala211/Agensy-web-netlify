import React from "react";
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import type { FaceSheetShortFormData } from "@agensy/types";
import { Input, Card } from "@agensy/components";

interface InsuranceInformationSectionProps {
  register: UseFormRegister<FaceSheetShortFormData>;
  control: Control<FaceSheetShortFormData>;
  errors: FieldErrors<FaceSheetShortFormData>;
}

export const InsuranceInformationSection: React.FC<InsuranceInformationSectionProps> = ({
  register,
  errors,
}) => {
  return (
    <Card title="Insurance Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="Insurance Group Number"
          register={register("insuranceGroupNumber")}
          error={errors.insuranceGroupNumber?.message}
        />
        <Input
          label="Medicare ID Number"
          register={register("medicareIdNumber")}
          error={errors.medicareIdNumber?.message}
        />
      </div>
    </Card>
  );
}; 