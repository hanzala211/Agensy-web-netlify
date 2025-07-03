import React from "react";
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import type { FaceSheetShortFormData } from "@agensy/types";
import { Input, Card } from "@agensy/components";

interface InsuranceInformationSectionProps {
  register: UseFormRegister<FaceSheetShortFormData>;
  control: Control<FaceSheetShortFormData>;
  errors: FieldErrors<FaceSheetShortFormData>;
}

export const InsuranceInformationSection: React.FC<
  InsuranceInformationSectionProps
> = ({ register, errors }) => {
  return (
    <Card title="Insurance Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="Insurance"
          register={register("insurance")}
          error={errors.insurance?.message}
        />
        <Input
          label="Medicare"
          register={register("medicare")}
          error={errors.medicare?.message}
        />
        <Input
          label="Group Number"
          register={register("groupNumber")}
          error={errors.groupNumber?.message}
        />
        <Input
          label="ID Number"
          register={register("idNumber")}
          error={errors.idNumber?.message}
        />
      </div>
    </Card>
  );
};
