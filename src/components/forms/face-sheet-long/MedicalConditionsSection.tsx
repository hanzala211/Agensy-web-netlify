import React from "react";
import type {
  Control,
  UseFormRegister,
  FieldErrors,
  UseFieldArrayReturn,
} from "react-hook-form";
import type { FaceSheetLongFormData } from "@agensy/types";
import {
  Input,
  Card,
  DatePickerField,
  TextArea,
  TertiaryButton,
} from "@agensy/components";
import { ICONS } from "@agensy/constants";

interface MedicalConditionsSectionProps {
  register: UseFormRegister<FaceSheetLongFormData>;
  control: Control<FaceSheetLongFormData>;
  errors: FieldErrors<FaceSheetLongFormData>;
  medicalConditionsArray: UseFieldArrayReturn<
    FaceSheetLongFormData,
    "medicalConditions"
  >;
}

export const MedicalConditionsSection: React.FC<
  MedicalConditionsSectionProps
> = ({ register, control, errors, medicalConditionsArray }) => {
  const {
    fields: conditionFields,
    append: appendCondition,
    remove: removeCondition,
  } = medicalConditionsArray;

  return (
    <Card
      title="Medical Conditions"
      buttonText={<ICONS.plus size={16} />}
      onButtonClick={() =>
        appendCondition({
          condition: "",
          onsetDate: "",
          notes: "",
        })
      }
      ariaLabel="Add Medical Condition"
      showButton={true}
    >
      <div className="space-y-6">
        {conditionFields.map((field, index) => (
          <div key={field.id} className="p-4 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Medical Condition"
                register={register(`medicalConditions.${index}.condition`)}
                error={errors.medicalConditions?.[index]?.condition?.message}
              />
              <DatePickerField
                control={control}
                name={`medicalConditions.${index}.onsetDate`}
                label="Onset Date"
                monthYearOnly={true}
              />
            </div>
            <div className="mt-4">
              <TextArea
                label="Notes"
                register={register(`medicalConditions.${index}.notes`)}
                error={errors.medicalConditions?.[index]?.notes?.message}
                rows={2}
              />
            </div>
            {conditionFields.length > 1 && (
              <div className="flex justify-end mt-3">
                <TertiaryButton
                  type="button"
                  onClick={() => removeCondition(index)}
                  className="text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  <ICONS.delete />
                </TertiaryButton>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
