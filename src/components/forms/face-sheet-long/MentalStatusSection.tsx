import React from "react";
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import type { FaceSheetLongFormData } from "@agensy/types";
import {
  Input,
  Card,
  TextArea,
  DatePickerField,
  Select,
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
          />
          <DatePickerField
            label="Cognitive Screening Date"
            control={control}
            name="cognitiveScreeningDate"
          />
          <Input
            label="Cognitive Score"
            register={register("cognitiveScreeningScore")}
            error={errors.cognitiveScreeningScore?.message}
            type="number"
            placeholder="e.g., 26 (from MMSE or SLUMS)"
          />
          <Input
            label="Total Score"
            type="number"
            register={register("cognitiveScreeningScoreOutOf")}
            error={errors.cognitiveScreeningScoreOutOf?.message}
            placeholder="e.g., 30 (MMSE) or 30 (SLUMS)"
          />
        </div>

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
