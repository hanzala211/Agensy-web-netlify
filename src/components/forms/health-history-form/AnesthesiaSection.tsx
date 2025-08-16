import type {
  UseFormRegister,
  FieldErrors,
  UseFieldArrayReturn,
  FieldValues,
  Path,
} from "react-hook-form";
import { Input, Card, TertiaryButton } from "@agensy/components";
import { ICONS } from "@agensy/constants";

interface AnesthesiaSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  anesthesiaArray: UseFieldArrayReturn<T>;
}

export const AnesthesiaSection = <T extends FieldValues>({
  register,
  errors,
  anesthesiaArray,
}: AnesthesiaSectionProps<T>) => {
  const {
    fields: anesthesiaFields,
    append: appendAnesthesia,
    remove: removeAnesthesia,
  } = anesthesiaArray;

  return (
    <Card
      title="Medication and Anesthesia Reactions and Side Effects"
      buttonText={<ICONS.plus size={16} />}
      onButtonClick={() =>
        appendAnesthesia({
          // @ts-expect-error - TODO: fix this
          diagnosis: "",
        })
      }
      ariaLabel="Add Anesthesia"
      showButton={true}
    >
      <div className="space-y-6">
        {anesthesiaFields.map((field, index) => (
          <div key={field.id} className="p-3 rounded-lg border">
            <div className="w-full flex gap-4 items-center">
              <div className="w-full">
                <Input
                  register={register(
                    `anesthesia.${index}.anesthesia` as Path<T>
                  )}
                  error={
                    // @ts-expect-error - TODO: fix this
                    errors.anesthesia?.[index]?.anesthesia?.message as string
                  }
                />
              </div>
              {anesthesiaFields.length > 1 && (
                <TertiaryButton
                  type="button"
                  onClick={() => removeAnesthesia(index)}
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
