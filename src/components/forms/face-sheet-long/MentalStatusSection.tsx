import React from "react";
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import type { FaceSheetLongFormData } from "@agensy/types";
import { Input, Card, TextArea, DatePickerField } from "@agensy/components";

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
          <Input
            label="Mental Status"
            register={register("mentalStatus")}
            error={errors.mentalStatus?.message}
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
          />
          <Input
            label="Total Score"
            type="number"
            register={register("cognitiveScreeningScoreOutOf")}
            error={errors.cognitiveScreeningScoreOutOf?.message}
          />
        </div>

        <TextArea
          label="Notes / Concerns"
          register={register("notesAndConcerns")}
          error={errors.notesAndConcerns?.message}
          rows={4}
        />
      </div>
    </Card>
  );
};
