import React from "react";
import type {
  UseFormRegister,
  FieldErrors,
  UseFieldArrayReturn,
} from "react-hook-form";
import type { FaceSheetShortFormData } from "@agensy/types";
import { Input, Card } from "@agensy/components";
import { ICONS } from "@agensy/constants";

interface DiagnosesSectionProps {
  register: UseFormRegister<FaceSheetShortFormData>;
  errors: FieldErrors<FaceSheetShortFormData>;
  diagnosesArray: UseFieldArrayReturn<FaceSheetShortFormData, "diagnoses">;
}

export const DiagnosesSection: React.FC<DiagnosesSectionProps> = ({
  register,
  errors,
  diagnosesArray,
}) => {
  const {
    fields: diagnosisFields,
    append: appendDiagnosis,
    remove: removeDiagnosis,
  } = diagnosesArray;

  return (
    <Card
      title="Diagnoses"
      buttonText={<ICONS.plus size={16} />}
      onButtonClick={() => appendDiagnosis({ diagnosis: "" })}
      ariaLabel="Add Diagnosis"
      showButton={true}
    >
      <div className="space-y-6">
        {diagnosisFields.map((field, index) => (
          <div key={field.id} className="p-3 rounded-lg border">
            <div className="w-full flex gap-4 items-center">
              <div className="w-full">
                <Input
                  register={register(`diagnoses.${index}.diagnosis`)}
                  error={errors.diagnoses?.[index]?.diagnosis?.message}
                />
              </div>
              {diagnosisFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDiagnosis(index)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <ICONS.delete size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
