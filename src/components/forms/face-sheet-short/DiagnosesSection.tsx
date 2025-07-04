import type {
  UseFormRegister,
  FieldErrors,
  UseFieldArrayReturn,
  FieldValues,
  Path,
} from "react-hook-form";
import { Input, Card, TertiaryButton } from "@agensy/components";
import { ICONS } from "@agensy/constants";

interface DiagnosesSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  diagnosesArray: UseFieldArrayReturn<T>;
}

export const DiagnosesSection = <T extends FieldValues>({
  register,
  errors,
  diagnosesArray,
}: DiagnosesSectionProps<T>) => {
  const {
    fields: diagnosisFields,
    append: appendDiagnosis,
    remove: removeDiagnosis,
  } = diagnosesArray;

  return (
    <Card
      title="Diagnoses"
      buttonText={<ICONS.plus size={16} />}
      onButtonClick={() =>
        appendDiagnosis({
          // @ts-expect-error - TODO: fix this
          diagnosis: "",
        })
      }
      ariaLabel="Add Diagnosis"
      showButton={true}
    >
      <div className="space-y-6">
        {diagnosisFields.map((field, index) => (
          <div key={field.id} className="p-3 rounded-lg border">
            <div className="w-full flex gap-4 items-center">
              <div className="w-full">
                <Input
                  register={register(`diagnoses.${index}.diagnosis` as Path<T>)}
                  error={
                    // @ts-expect-error - TODO: fix this
                    errors.diagnoses?.[index]?.diagnosis?.message as string
                  }
                />
              </div>
              {diagnosisFields.length > 1 && (
                <TertiaryButton
                  type="button"
                  onClick={() => removeDiagnosis(index)}
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
