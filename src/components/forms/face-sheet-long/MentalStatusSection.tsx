import React from "react";
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import type { FaceSheetLongFormData } from "@agensy/types";
import {
  Card,
  TextArea,
  DatePickerField,
  Select,
  ScoringInput,
} from "@agensy/components";
import { COGNITIVE_STATUS } from "@agensy/constants";

interface MentalStatusSectionProps {
  register: UseFormRegister<FaceSheetLongFormData>;
  control: Control<FaceSheetLongFormData>;
  errors: FieldErrors<FaceSheetLongFormData>;
}

export const MentalStatusSection: React.FC<MentalStatusSectionProps> = ({
  register,
  control,
  errors,
}) => {
  return (
    <Card title="Mental Status">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Select
            label="Cognitive Status"
            control={control}
            labelOption="Select Cognitive Status"
            name="mentalStatus"
            data={COGNITIVE_STATUS as { label: string; value: string }[]}
            enableTextInput={true}
            textInputTriggerValue="Other"
            textInputName="mentalStatusText"
            textInputPlaceholder="Enter Cognitive Status"
          />
          <DatePickerField
            label="Cognitive Screening Date"
            control={control}
            name="cognitiveScreeningDate"
          />
        </div>
        <ScoringInput
          control={control}
          name="cognitiveScreeningScore"
          label="Cognitive Score"
          placeholder="e.g., 26/30 (from MMSE or SLUMS)"
        />

        <TextArea
          label="Notes / Concerns"
          register={register("notesAndConcerns")}
          error={errors.notesAndConcerns?.message}
          rows={4}
          placeholder="Please specify assessment type (MMSE or SLUMS) and any additional observations..."
        />
      </div>
    </Card>
  );
};
