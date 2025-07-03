import React from "react";
import type {
  UseFormRegister,
  FieldErrors,
  UseFieldArrayReturn,
} from "react-hook-form";
import type { FaceSheetShortFormData } from "@agensy/types";
import { Input, Card } from "@agensy/components";
import { ICONS } from "@agensy/constants";

interface AllergiesSectionProps {
  register: UseFormRegister<FaceSheetShortFormData>;
  errors: FieldErrors<FaceSheetShortFormData>;
  allergiesArray: UseFieldArrayReturn<FaceSheetShortFormData, "allergies">;
}

export const AllergiesSection: React.FC<AllergiesSectionProps> = ({
  register,
  errors,
  allergiesArray,
}) => {
  const {
    fields: allergyFields,
    append: appendAllergy,
    remove: removeAllergy,
  } = allergiesArray;

  return (
    <Card
      title="Allergies"
      buttonText={<ICONS.plus size={16} />}
      onButtonClick={() =>
        appendAllergy({
          allergen: "",
        })
      }
      ariaLabel="Add Allergy"
      showButton={true}
    >
      <div className="space-y-6">
        {allergyFields.map((field, index) => (
          <div key={field.id} className="p-3 rounded-lg border">
            <div className="w-full flex gap-4 items-center">
              <div className="w-full">
                <Input
                  register={register(`allergies.${index}.allergen`)}
                  error={errors.allergies?.[index]?.allergen?.message}
                />
              </div>
              {allergyFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAllergy(index)}
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
