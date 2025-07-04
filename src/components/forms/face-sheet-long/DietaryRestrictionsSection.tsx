import React from "react";
import type {
  UseFormRegister,
  FieldErrors,
  UseFieldArrayReturn,
} from "react-hook-form";
import type { FaceSheetLongFormData } from "@agensy/types";
import { Card, Input, TertiaryButton } from "@agensy/components";
import { ICONS } from "@agensy/constants";

interface DietaryRestrictionsSectionProps {
  register: UseFormRegister<FaceSheetLongFormData>;
  errors: FieldErrors<FaceSheetLongFormData>;
  dietaryRestrictionsArray: UseFieldArrayReturn<
    FaceSheetLongFormData,
    "dietaryRestrictions"
  >;
}

export const DietaryRestrictionsSection: React.FC<
  DietaryRestrictionsSectionProps
> = ({ register, errors, dietaryRestrictionsArray }) => {
  const { fields, append, remove } = dietaryRestrictionsArray;

  return (
    <Card
      title="Dietary Restrictions"
      buttonText={<ICONS.plus size={16} />}
      onButtonClick={() => append({ dietaryRestrictions: "" })}
    >
      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="p-3 rounded-lg border">
            <div className="w-full flex gap-4 items-center">
              <div className="w-full">
                <Input
                  register={register(
                    `dietaryRestrictions.${index}.dietaryRestrictions`
                  )}
                  error={
                    errors.dietaryRestrictions?.[index]?.dietaryRestrictions
                      ?.message
                  }
                />
              </div>
              {fields.length > 1 && (
                <TertiaryButton
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  <ICONS.delete />
                </TertiaryButton>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
