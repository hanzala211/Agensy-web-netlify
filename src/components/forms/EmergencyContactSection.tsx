import React from "react";
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import type { FaceSheetShortFormData } from "@agensy/types";
import { Input, Card, PhoneNumberInput, Select } from "@agensy/components";
import { RELATIONSHIP_TO_CLIENT } from "@agensy/constants";

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Input
          label="First Name"
          register={register("emergencyContactFirstName")}
          error={errors.emergencyContactFirstName?.message}
        />
        <Input
          label="Last Name"
          register={register("emergencyContactLastName")}
          error={errors.emergencyContactLastName?.message}
        />
        <PhoneNumberInput
          label="Phone"
          control={control}
          name="emergencyContactPhone"
        />

        <Select
          control={control}
          name="emergencyContactRelationship"
          data={RELATIONSHIP_TO_CLIENT}
          label="Relationship"
          labelOption="Relationship"
        />
        <Input
          label="Email"
          type="email"
          register={register("emergencyContactEmail")}
          error={errors.emergencyContactEmail?.message}
        />
        <Input
          label="Address"
          register={register("emergencyContactAddress")}
          error={errors.emergencyContactAddress?.message}
        />
      </div>
    </Card>
  );
};
