import type {
  UseFormRegister,
  FieldErrors,
  UseFieldArrayReturn,
  FieldValues,
  Path,
} from "react-hook-form";
import { Input, Card, TertiaryButton } from "@agensy/components";
import { ICONS } from "@agensy/constants";

interface AllergiesSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  allergiesArray: UseFieldArrayReturn<T>;
}

export const AllergiesSection = <T extends FieldValues>({
  register,
  errors,
  allergiesArray,
}: AllergiesSectionProps<T>) => {
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
          // @ts-expect-error - TODO: fix this
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
                  register={register(`allergies.${index}.allergen` as Path<T>)}
                  error={
                    // @ts-expect-error - TODO: fix this
                    errors.allergies?.[index]?.allergen?.message as string
                  }
                />
              </div>
              {allergyFields.length > 1 && (
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
