import React from "react";
import type { Control, UseFieldArrayReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";
import type { FaceSheetLongFormData } from "@agensy/types";
import {
  Card,
  DatePickerField,
  Select,
  TertiaryButton,
} from "@agensy/components";
import { ICONS } from "@agensy/constants";

const VACCINE_OPTIONS = [
  { value: "Flu", label: "Flu" },
  { value: "COVID", label: "COVID-19" },
  { value: "TD Booster", label: "Tdap" },
  { value: "Shingles Vaccine (1st)", label: "Shingles (1st)" },
  { value: "Shingles Vaccine (2nd)", label: "Shingles (2nd)" },
  { value: "Pneumonia", label: "Pneumonia" },
  { value: "MMR", label: "MMR" },
  { value: "Meningococcal", label: "Meningococcal" },
  { value: "Chicken Pox", label: "Chicken Pox" },
  { value: "Hepatitis A", label: "Hepatitis A" },
  { value: "Hepatitis B", label: "Hepatitis B" },
];

interface VaccinationsSectionProps {
  control: Control<FaceSheetLongFormData>;
  vaccinationsArray: UseFieldArrayReturn<FaceSheetLongFormData, "vaccinations">;
}

export const VaccinationsSection: React.FC<VaccinationsSectionProps> = ({
  control,
  vaccinationsArray,
}) => {
  const {
    fields: vaccinationFields,
    append: appendVaccination,
    remove: removeVaccination,
  } = vaccinationsArray;

  const vaccinationValues = useWatch({
    control,
    name: "vaccinations",
  });

  const getAvailableOptions = (currentIndex: number) => {
    if (!vaccinationValues) return VACCINE_OPTIONS;

    const selectedValues = vaccinationValues
      .map((vaccination, index) =>
        index !== currentIndex ? vaccination?.vaccineName : null
      )
      .filter(Boolean);

    return VACCINE_OPTIONS.filter(
      (option) => !selectedValues.includes(option.value)
    );
  };

  return (
    <Card
      title="Vaccinations"
      buttonText={<ICONS.plus size={16} />}
      onButtonClick={() =>
        appendVaccination({
          vaccineName: "",
          date: "",
          nextVaccine: "",
        })
      }
      ariaLabel="Add Vaccination"
      showButton={true}
    >
      <div className="space-y-6">
        {vaccinationFields.map((field, index) => (
          <div key={field.id} className="p-4 rounded-lg border ">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select<FaceSheetLongFormData>
                label="Vaccine"
                control={control}
                name={`vaccinations.${index}.vaccineName`}
                data={getAvailableOptions(index)}
              />
              <DatePickerField<FaceSheetLongFormData>
                control={control}
                name={`vaccinations.${index}.date`}
                label="Date"
              />
              <DatePickerField
                control={control}
                name={`vaccinations.${index}.nextVaccine`}
                label="Next Vaccine"
              />
            </div>
            {vaccinationFields.length > 1 && (
              <div className="flex justify-end mt-3">
                <TertiaryButton
                  type="button"
                  onClick={() => removeVaccination(index)}
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
