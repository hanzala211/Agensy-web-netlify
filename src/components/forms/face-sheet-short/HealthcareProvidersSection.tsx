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
  PhoneNumberInput,
  TertiaryButton,
  Select,
} from "@agensy/components";
import { ICONS, SPECIALTIES } from "@agensy/constants";

interface HealthcareProvidersSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  providersArray: UseFieldArrayReturn<T>;
}

export const HealthcareProvidersSection = <T extends FieldValues>({
  register,
  control,
  errors,
  providersArray,
}: HealthcareProvidersSectionProps<T>) => {
  const {
    fields: providerFields,
    append: appendProvider,
    remove: removeProvider,
  } = providersArray;

  return (
    <Card
      title="Healthcare Providers"
      buttonText={<ICONS.plus size={16} />}
      onButtonClick={() =>
        appendProvider({
          // @ts-expect-error - TODO: fix this
          providerName: "",
          specialty: "",
          address: "",
          phone: "",
          fax: "",
          lastVisit: "",
          nextVisit: "",
        })
      }
      ariaLabel="Add Healthcare Provider"
      showButton={true}
    >
      <div className="space-y-6">
        {providerFields.map((field, index) => (
          <div key={field.id} className="p-3 rounded-lg border">
            <div className="w-full flex gap-4 items-center">
              <div className="w-full grid md:grid-cols-2 gap-4">
                <Input
                  label="Provider Name"
                  register={register(
                    `providers.${index}.providerName` as Path<T>
                  )}
                  error={
                    // @ts-expect-error - TODO: fix this
                    (errors.providers as FieldErrors<T>)?.[index]?.providerName
                      ?.message as string
                  }
                />

                <Select
                  label="Specialty"
                  control={control}
                  data={SPECIALTIES}
                  name={`providers.${index}.specialty` as Path<T>}
                  labelOption="Select Specialty"
                />
                <Input
                  label="Address"
                  register={register(`providers.${index}.address` as Path<T>)}
                  error={
                    // @ts-expect-error - TODO: fix this
                    (errors.providers as FieldErrors<T>)?.[index]?.address
                      ?.message as string
                  }
                />

                <PhoneNumberInput
                  label="Phone"
                  control={control}
                  name={`providers.${index}.phone` as Path<T>}
                />

                <DatePickerField
                  control={control}
                  name={`providers.${index}.lastVisit` as Path<T>}
                  label="Last Visit"
                />
                <DatePickerField
                  control={control}
                  name={`providers.${index}.nextVisit` as Path<T>}
                  label="Next Visit"
                />
              </div>
            </div>
            <div className="w-full flex gap-4 items-center mt-4">
              <div className="w-full">
                <PhoneNumberInput
                  label="Fax"
                  control={control}
                  name={`providers.${index}.fax` as Path<T>}
                />
              </div>
            </div>
            {providerFields.length > 1 && (
              <div className="flex justify-end mt-3">
                <TertiaryButton
                  type="button"
                  onClick={() => removeProvider(index)}
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
