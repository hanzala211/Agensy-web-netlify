import {
  type UseFormRegister,
  type FieldErrors,
  type UseFieldArrayReturn,
} from "react-hook-form";
import { Card, Input, TertiaryButton } from "@agensy/components";
import { type ComprehensiveCarePlanFormData } from "@agensy/types";
import { ICONS } from "@agensy/constants";

interface AllergiesCardProps {
  register: UseFormRegister<ComprehensiveCarePlanFormData>;
  errors: FieldErrors<ComprehensiveCarePlanFormData>;
  allergiesFields: UseFieldArrayReturn<
    ComprehensiveCarePlanFormData,
    "allergies",
    "id"
  >["fields"];
  appendAllergy: UseFieldArrayReturn<
    ComprehensiveCarePlanFormData,
    "allergies",
    "id"
  >["append"];
  removeAllergy: UseFieldArrayReturn<
    ComprehensiveCarePlanFormData,
    "allergies",
    "id"
  >["remove"];
}

export const AllergiesCard = ({
  register,
  errors,
  allergiesFields,
  appendAllergy,
  removeAllergy,
}: AllergiesCardProps) => {
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
        {allergiesFields.map((field, index) => (
          <div key={field.id} className="p-3 rounded-lg border">
            <div className="w-full flex gap-4 items-center">
              <div className="w-full">
                <Input
                  label="Allergen"
                  register={register(`allergies.${index}.allergen`)}
                  error={errors.allergies?.[index]?.allergen?.message}
                  placeholder="e.g., Penicillin, Sulfa drugs, Latex"
                />
              </div>
              {allergiesFields.length > 1 && (
                <TertiaryButton
                  type="button"
                  onClick={() => removeAllergy(index)}
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
