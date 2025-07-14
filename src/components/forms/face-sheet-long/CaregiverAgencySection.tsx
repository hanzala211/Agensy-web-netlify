import React from "react";
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import type { FaceSheetLongFormData } from "@agensy/types";
import { Input, Card, PhoneNumberInput, TextArea } from "@agensy/components";

interface CaregiverAgencySectionProps {
  register: UseFormRegister<FaceSheetLongFormData>;
  control: Control<FaceSheetLongFormData>;
  errors: FieldErrors<FaceSheetLongFormData>;
}

export const CaregiverAgencySection: React.FC<CaregiverAgencySectionProps> = ({
  register,
  control,
  errors,
}) => {
  return (
    <Card title="Caregiver Agency">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Caregiver Agency"
            register={register("caregiverAgency")}
            error={errors.caregiverAgency?.message}
          />
          <PhoneNumberInput
            label="Phone"
            control={control}
            name="caregiverPhone"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Address"
            register={register("caregiverAddress")}
            error={errors.caregiverAddress?.message}
          />
          <Input
            label="Point of Contact"
            register={register("caregiverPointOfContact")}
            error={errors.caregiverPointOfContact?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Caregiver Schedule"
            name="caregiverSchedule"
            register={register("caregiverSchedule")}
            error={errors.caregiverSchedule?.message}
          />
          <Input
            label="Caregiver Duties"
            register={register("caregiverDuties")}
            error={errors.caregiverDuties?.message}
          />
        </div>

        <TextArea
          label="Important Information for Caregivers"
          register={register("importantInformationForCaregivers")}
          error={errors.importantInformationForCaregivers?.message}
          rows={4}
        />
      </div>
    </Card>
  );
};
