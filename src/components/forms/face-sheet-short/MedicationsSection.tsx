import React from "react";
import type {
  Control,
  UseFormRegister,
  FieldErrors,
  UseFieldArrayReturn,
} from "react-hook-form";
import type { FaceSheetShortFormData } from "@agensy/types";
import { Input, Card, DatePickerField } from "@agensy/components";
import { ICONS } from "@agensy/constants";

interface MedicationsSectionProps {
  register: UseFormRegister<FaceSheetShortFormData>;
  control: Control<FaceSheetShortFormData>;
  errors: FieldErrors<FaceSheetShortFormData>;
  medicationsArray: UseFieldArrayReturn<FaceSheetShortFormData, "medications">;
}

export const MedicationsSection: React.FC<MedicationsSectionProps> = ({
  register,
  control,
  errors,
  medicationsArray,
}) => {
  const {
    fields: medicationFields,
    append: appendMedication,
    remove: removeMedication,
  } = medicationsArray;

  return (
    <Card
      title="Medications"
      buttonText={<ICONS.plus size={16} />}
      onButtonClick={() =>
        appendMedication({
          medicationName: "",
          dose: "",
          usedToTreat: "",
          prescriber: "",
          refillDue: "",
        })
      }
      ariaLabel="Add Medication"
      showButton={true}
    >
      <div className="space-y-6">
        {medicationFields.map((field, index) => (
          <div key={field.id} className="p-3 rounded-lg border">
            <div className="w-full flex gap-4 items-center">
              <div className="w-full grid md:grid-cols-2 gap-4">
                <Input
                  label="Medication Name"
                  register={register(`medications.${index}.medicationName`)}
                  error={errors.medications?.[index]?.medicationName?.message}
                />
                <Input
                  label="Dose"
                  register={register(`medications.${index}.dose`)}
                  error={errors.medications?.[index]?.dose?.message}
                />
                <Input
                  label="Used to Treat"
                  register={register(`medications.${index}.usedToTreat`)}
                  error={errors.medications?.[index]?.usedToTreat?.message}
                />
                <Input
                  label="Prescriber"
                  register={register(`medications.${index}.prescriber`)}
                  error={errors.medications?.[index]?.prescriber?.message}
                />
              </div>
            </div>
            <div className="w-full mt-4">
              <DatePickerField
                control={control}
                label="Refill Due"
                name={`medications.${index}.refillDue`}
              />
            </div>
            {medicationFields.length > 1 && (
              <div className="flex justify-end mt-3">
                <button
                  type="button"
                  onClick={() => removeMedication(index)}
                  className="text-red-600 hover:text-red-800 p-1"
                  aria-label="Remove medication"
                >
                  <ICONS.delete size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
