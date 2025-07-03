import React from "react";
import type {
  UseFormRegister,
  FieldErrors,
  UseFieldArrayReturn,
  Control,
} from "react-hook-form";
import type { FaceSheetShortFormData } from "@agensy/types";
import { Input, Card } from "@agensy/components";
import { ICONS } from "@agensy/constants";

interface SurgicalHistorySectionProps {
  register: UseFormRegister<FaceSheetShortFormData>;
  control: Control<FaceSheetShortFormData>;
  errors: FieldErrors<FaceSheetShortFormData>;
  surgicalHistoryArray: UseFieldArrayReturn<
    FaceSheetShortFormData,
    "surgicalHistory"
  >;
}

export const SurgicalHistorySection: React.FC<SurgicalHistorySectionProps> = ({
  register,
  errors,
  surgicalHistoryArray,
}) => {
  const {
    fields: surgicalHistoryFields,
    append: appendSurgicalHistory,
    remove: removeSurgicalHistory,
  } = surgicalHistoryArray;

  return (
    <Card
      title="Surgical History"
      buttonText={<ICONS.plus size={16} />}
      onButtonClick={() =>
        appendSurgicalHistory({
          surgicalHistory: "",
        })
      }
      ariaLabel="Add Surgical History"
      showButton={true}
    >
      <div className="space-y-6">
        {surgicalHistoryFields.map((field, index) => (
          <div key={field.id} className="p-3 rounded-lg border">
            <div className="w-full flex gap-4 items-center">
              <div className="w-full">
                <Input
                  register={register(
                    `surgicalHistory.${index}.surgicalHistory`
                  )}
                  error={
                    errors.surgicalHistory?.[index]?.surgicalHistory?.message
                  }
                />
              </div>
              {surgicalHistoryFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSurgicalHistory(index)}
                  className="text-red-600 hover:text-red-800 p-1"
                  aria-label="Remove surgical history"
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
