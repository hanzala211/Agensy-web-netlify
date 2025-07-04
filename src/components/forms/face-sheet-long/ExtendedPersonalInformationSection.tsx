import React from "react";
import type { Control } from "react-hook-form";
import type { FaceSheetLongFormData } from "@agensy/types";
import { Card, Select, DatePickerField } from "@agensy/components";
import {
  GENDER_OPTIONS,
  RACE_OPTIONS,
  LANGUAGE_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  LIVING_SITUATION_OPTIONS,
} from "@agensy/constants";

interface ExtendedPersonalInformationSectionProps {
  control: Control<FaceSheetLongFormData>;
}

export const ExtendedPersonalInformationSection: React.FC<
  ExtendedPersonalInformationSectionProps
> = ({ control }) => {
  return (
    <Card title="Extended Personal Information">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Select<FaceSheetLongFormData>
          label="Gender"
          control={control}
          name="gender"
          data={GENDER_OPTIONS}
          labelOption="Gender"
        />
        <Select<FaceSheetLongFormData>
          label="Race"
          control={control}
          name="race"
          data={RACE_OPTIONS}
          labelOption="Race"
        />
        <Select<FaceSheetLongFormData>
          label="Language"
          control={control}
          name="language"
          data={LANGUAGE_OPTIONS}
          labelOption="Language"
        />
        <Select<FaceSheetLongFormData>
          label="Marital Status"
          control={control}
          name="maritalStatus"
          data={MARITAL_STATUS_OPTIONS}
          labelOption="Marital Status"
        />
        <Select<FaceSheetLongFormData>
          label="Living Situation"
          control={control}
          name="livingSituation"
          data={LIVING_SITUATION_OPTIONS}
          labelOption="Living Situation"
        />
        <DatePickerField<FaceSheetLongFormData>
          control={control}
          name="dateOfLastCarePlan"
          label="Date of Last Care Plan"
        />
      </div>
    </Card>
  );
};
