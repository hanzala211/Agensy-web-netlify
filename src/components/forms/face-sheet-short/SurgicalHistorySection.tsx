import type {
  UseFormRegister,
  FieldErrors,
  UseFieldArrayReturn,
  Control,
  FieldValues,
  Path,
} from "react-hook-form";
import { Input, Card, TertiaryButton } from "@agensy/components";
import { ICONS } from "@agensy/constants";

interface SurgicalHistorySectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  surgicalHistoryArray: UseFieldArrayReturn<T>;
}

export const SurgicalHistorySection = <T extends FieldValues>({
  register,
  errors,
  surgicalHistoryArray,
}: SurgicalHistorySectionProps<T>) => {
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
          // @ts-expect-error - TODO: fix this
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
                    `surgicalHistory.${index}.surgicalHistory` as Path<T>
                  )}
                  error={
                    // @ts-expect-error - TODO: fix this
                    errors.surgicalHistory?.[index]?.surgicalHistory?.message
                  }
                />
              </div>
              {surgicalHistoryFields.length > 1 && (
                <TertiaryButton
                  type="button"
                  onClick={() => removeSurgicalHistory(index)}
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
