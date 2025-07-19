import type {
  UseFormRegister,
  FieldErrors,
  UseFieldArrayReturn,
  FieldValues,
  Path,
} from "react-hook-form";
import { Card, TertiaryButton, Input } from "@agensy/components";
import { ICONS } from "@agensy/constants";

interface MedicalConditionsSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  medicalConditionsArray: UseFieldArrayReturn<T>;
}

export const MedicalConditionsSection = <T extends FieldValues>({
  register,
  errors,
  medicalConditionsArray,
}: MedicalConditionsSectionProps<T>) => {
  const {
    fields: medicalConditionFields,
    append: appendMedicalCondition,
    remove: removeMedicalCondition,
  } = medicalConditionsArray;

  return (
    <Card
      title="Describe the most significant health problems, treatments, and medications"
      buttonText={<ICONS.plus size={16} />}
      onButtonClick={() =>
        appendMedicalCondition({
          // @ts-expect-error - TODO: fix this
          problem: "",
          treatment: "",
          medications: "",
        })
      }
      ariaLabel="Add Medical Condition"
      showButton={true}
    >
      <div className="space-y-6">
        {medicalConditionFields.map((field, index) => (
          <div key={field.id} className="p-4 rounded-lg border border-gray-200">
            {/* Three columns: Problem, Treatment, Medications */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Problem"
                register={register(
                  `medicalConditions.${index}.problem` as Path<T>
                )}
                error={
                  // @ts-expect-error - TODO: fix this
                  errors.medicalConditions?.[index]?.problem?.message as string
                }
                placeholder="Enter health problems..."
              />
              <Input
                label="Treatment"
                register={register(
                  `medicalConditions.${index}.treatment` as Path<T>
                )}
                error={
                  // @ts-expect-error - TODO: fix this
                  errors.medicalConditions?.[index]?.treatment
                    ?.message as string
                }
                placeholder="Enter treatments..."
              />
              <Input
                label="Medications"
                register={register(
                  `medicalConditions.${index}.medications` as Path<T>
                )}
                error={
                  // @ts-expect-error - TODO: fix this
                  errors.medicalConditions?.[index]?.medications
                    ?.message as string
                }
                placeholder="Enter medications..."
              />
            </div>

            {/* Remove Button */}
            {medicalConditionFields.length > 1 && (
              <div className="flex justify-end mt-4">
                <TertiaryButton
                  type="button"
                  onClick={() => removeMedicalCondition(index)}
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
