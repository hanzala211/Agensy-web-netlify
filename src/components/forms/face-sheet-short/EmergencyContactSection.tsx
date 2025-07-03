import React from "react";
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import type { FaceSheetShortFormData } from "@agensy/types";
import { Input, Card, PhoneNumberInput } from "@agensy/components";

interface EmergencyContactSectionProps {
  register: UseFormRegister<FaceSheetShortFormData>;
  control: Control<FaceSheetShortFormData>;
  errors: FieldErrors<FaceSheetShortFormData>;
}

export const EmergencyContactSection: React.FC<
  EmergencyContactSectionProps
> = ({ register, control, errors }) => {
  return (
    <Card title="Emergency Contact">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Input
          label="Emergency Contact Name"
          register={register("emergencyContactName")}
          error={errors.emergencyContactName?.message}
        />
        <PhoneNumberInput
          label="Phone"
          control={control}
          name="emergencyContactPhone"
        />
        <Input
          label="Relationship"
          register={register("emergencyContactRelationship")}
          error={errors.emergencyContactRelationship?.message}
        />
        <Input
          label="Email"
          type="email"
          register={register("emergencyContactEmail")}
          error={errors.emergencyContactEmail?.message}
        />
        <div className="lg:col-span-4">
          <Input
            label="Address"
            register={register("emergencyContactAddress")}
            error={errors.emergencyContactAddress?.message}
          />
        </div>
      </div>
    </Card>
  );
};
