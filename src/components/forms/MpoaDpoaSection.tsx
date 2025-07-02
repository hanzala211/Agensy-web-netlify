import React from "react";
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import type { FaceSheetShortFormData } from "@agensy/types";
import { Input, Card, PhoneNumberInput } from "@agensy/components";

interface MpoaDpoaSectionProps {
  register: UseFormRegister<FaceSheetShortFormData>;
  control: Control<FaceSheetShortFormData>;
  errors: FieldErrors<FaceSheetShortFormData>;
}

export const MpoaDpoaSection: React.FC<MpoaDpoaSectionProps> = ({
  register,
  control,
  errors,
}) => {
  return (
    <Card title="MPOA / DPOA Information">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">MPOA</h3>
          <div className="space-y-4">
            <Input
              label="Name"
              register={register("mpoaName")}
              error={errors.mpoaName?.message}
            />
            <PhoneNumberInput
              label="Phone"
              control={control}
              name="mpoaPhone"
            />
            <Input
              label="Address"
              register={register("mpoaAddress")}
              error={errors.mpoaAddress?.message}
            />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">DPOA</h3>
          <div className="space-y-4">
            <Input
              label="Name"
              register={register("dpoaName")}
              error={errors.dpoaName?.message}
            />
            <PhoneNumberInput
              label="Phone"
              control={control}
              name="dpoaPhone"
            />
            <Input
              label="Address"
              register={register("dpoaAddress")}
              error={errors.dpoaAddress?.message}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
