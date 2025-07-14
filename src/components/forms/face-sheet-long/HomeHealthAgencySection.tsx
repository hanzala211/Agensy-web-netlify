import React from "react";
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import type { FaceSheetLongFormData } from "@agensy/types";
import {
  Input,
  Card,
  PhoneNumberInput,
  DatePickerField,
} from "@agensy/components";

interface HomeHealthAgencySectionProps {
  register: UseFormRegister<FaceSheetLongFormData>;
  control: Control<FaceSheetLongFormData>;
  errors: FieldErrors<FaceSheetLongFormData>;
}

export const HomeHealthAgencySection: React.FC<
  HomeHealthAgencySectionProps
> = ({ register, control, errors }) => {
  return (
    <Card title="Home Health Agency">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Home Health Agency"
            register={register("homeHealthAgency")}
            error={errors.homeHealthAgency?.message}
          />
          <PhoneNumberInput
            label="Phone"
            control={control}
            name="homeHealthPhone"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Address"
            register={register("homeHealthAddress")}
            error={errors.homeHealthAddress?.message}
          />
          <PhoneNumberInput
            label="Fax"
            control={control}
            name="homeHealthFax"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Prescribing Doctor"
            register={register("homeHealthPrescribingDoctor")}
            error={errors.homeHealthPrescribingDoctor?.message}
          />
          <Input
            label="Healthcare Schedule"
            register={register("homeHealthSchedule")}
            error={errors.homeHealthSchedule?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <DatePickerField
            control={control}
            name="homeHealthStartDate"
            label="Start Date"
          />
          <DatePickerField
            control={control}
            name="homeHealthDischargeDate"
            label="Discharge Date"
          />
        </div>
      </div>
    </Card>
  );
};
