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

interface BloodworkSectionProps {
  register: UseFormRegister<FaceSheetLongFormData>;
  control: Control<FaceSheetLongFormData>;
  errors: FieldErrors<FaceSheetLongFormData>;
  bloodworkArray: UseFieldArrayReturn<FaceSheetLongFormData, "bloodwork">;
}

export const BloodworkSection: React.FC<BloodworkSectionProps> = ({
  register,
  control,
  errors,
  bloodworkArray,
}) => {
  const {
    fields: bloodworkFields,
    append: appendBloodwork,
    remove: removeBloodwork,
  } = bloodworkArray;

  return (
    <Card
      title="Bloodwork"
      buttonText={<ICONS.plus size={16} />}
      onButtonClick={() =>
        appendBloodwork({
          test: "",
          date: "",
          results: "",
          orderedBy: "",
          repeat: "",
        })
      }
      ariaLabel="Add Bloodwork"
      showButton={true}
    >
      <div className="space-y-6">
        {bloodworkFields.map((field, index) => (
          <div key={field.id} className="p-4 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
              <Input
                label="Test Name"
                register={register(`bloodwork.${index}.test`)}
                error={errors.bloodwork?.[index]?.test?.message}
              />
              <DatePickerField
                control={control}
                name={`bloodwork.${index}.date`}
                label="Date"
              />
              <Input
                label="Ordered By"
                register={register(`bloodwork.${index}.orderedBy`)}
                error={errors.bloodwork?.[index]?.orderedBy?.message}
              />
              <Input
                label="Repeat"
                register={register(`bloodwork.${index}.repeat`)}
                error={errors.bloodwork?.[index]?.repeat?.message}
              />
            </div>
            <div className="mt-4">
              <TextArea
                label="Results"
                register={register(`bloodwork.${index}.results`)}
                error={errors.bloodwork?.[index]?.results?.message}
                rows={2}
              />
            </div>
            {bloodworkFields.length > 1 && (
              <div className="flex justify-end mt-3">
                <TertiaryButton
                  type="button"
                  onClick={() => removeBloodwork(index)}
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
