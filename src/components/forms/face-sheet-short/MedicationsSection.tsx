import type {
  Control,
  UseFormRegister,
  FieldErrors,
  UseFieldArrayReturn,
  FieldValues,
  Path,
} from "react-hook-form";
import {
  Input,
  Card,
  DatePickerField,
  TertiaryButton,
} from "@agensy/components";
import { ICONS } from "@agensy/constants";

interface MedicationsSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  medicationsArray: UseFieldArrayReturn<T>;
}

export const MedicationsSection = <T extends FieldValues>({
  register,
  control,
  errors,
  medicationsArray,
}: MedicationsSectionProps<T>) => {
  const {
    fields: medicationFields,
    append: appendMedication,
    remove: removeMedication,
  } = medicationsArray;

  return (
    <Card
      title="Medications"
      buttonText={<ICONS.plus size={16} />}
      onButtonClick={() =>
        appendMedication({
          // @ts-expect-error - TODO: fix this
          medicationName: "",
          dose: "",
          usedToTreat: "",
          prescriber: "",
          refillDue: "",
        })
      }
      ariaLabel="Add Medication"
      showButton={true}
    >
      <div className="space-y-6">
        {medicationFields.map((field, index) => (
          <div key={field.id} className="p-3 rounded-lg border">
            <div className="w-full flex gap-4 items-center">
              <div className="w-full grid md:grid-cols-2 gap-4">
                <Input
                  label="Medication Name"
                  register={register(
                    `medications.${index}.medicationName` as Path<T>
                  )}
                  error={
                    // @ts-expect-error - TODO: fix this
                    errors.medications?.[index]?.medicationName
                      ?.message as string
                  }
                />
                <Input
                  label="Dose"
                  register={register(`medications.${index}.dose` as Path<T>)}
                  // @ts-expect-error - TODO: fix this
                  error={errors.medications?.[index]?.dose?.message as string}
                />
                <Input
                  label="Used to Treat"
                  register={register(
                    `medications.${index}.usedToTreat` as Path<T>
                  )}
                  error={
                    // @ts-expect-error - TODO: fix this
                    errors.medications?.[index]?.usedToTreat?.message as string
                  }
                />
                <Input
                  label="Prescriber"
                  register={register(
                    `medications.${index}.prescriber` as Path<T>
                  )}
                  error={
                    // @ts-expect-error - TODO: fix this
                    errors.medications?.[index]?.prescriber?.message as string
                  }
                />
              </div>
            </div>
            <div className="w-full mt-4">
              <DatePickerField
                control={control}
                label="Refill Due"
                name={`medications.${index}.refillDue` as Path<T>}
              />
            </div>
            {medicationFields.length > 1 && (
              <div className="flex justify-end mt-3">
                <TertiaryButton
                  type="button"
                  onClick={() => removeMedication(index)}
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
