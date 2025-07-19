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
  PhoneNumberInput,
  TertiaryButton,
} from "@agensy/components";
import { ICONS } from "@agensy/constants";

interface HealthcareProvidersSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  healthcareProvidersArray: UseFieldArrayReturn<T>;
}

export const HealthcareProvidersSection = <T extends FieldValues>({
  register,
  control,
  errors,
  healthcareProvidersArray,
}: HealthcareProvidersSectionProps<T>) => {
  const {
fields: healthcareProviderFields,
    append: appendHealthcareProvider,
    remove: removeHealthcareProvider,
  } = healthcareProvidersArray;

  return (
    <Card
      title="List current doctors and other health specialists"
      buttonText={<ICONS.plus size={16} />}
      onButtonClick={() =>
        appendHealthcareProvider({
          // @ts-expect-error - TODO: fix this
          providerName: "",
          phone: "",
          forWhatProblem: "",
        })
      }
      ariaLabel="Add Healthcare Provider"
      showButton={true}
    >
      <div className="space-y-6">
        {healthcareProviderFields.map((field, index) => (
          <div key={field.id} className="p-4 rounded-lg border border-gray-200">
            {/* Three columns: Name, Phone, For what problem */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Name"
                register={register(
                  `healthcareProviders.${index}.providerName` as Path<T>
                )}
                error={
                  // @ts-expect-error - TODO: fix this
                  errors.healthcareProviders?.[index]?.providerName?.message as string
                }
              />
              <PhoneNumberInput
                label="Phone"
                control={control}
                name={`healthcareProviders.${index}.phone` as Path<T>}
              />
              <Input
                label="For what problem..."
                register={register(
                  `healthcareProviders.${index}.forWhatProblem` as Path<T>
                )}
                error={
                  // @ts-expect-error - TODO: fix this
                  errors.healthcareProviders?.[index]?.forWhatProblem?.message as string
                }
              />
            </div>

            {/* Remove Button */}
            {healthcareProviderFields.length > 1 && (
              <div className="flex justify-end mt-4">
                <TertiaryButton
                  type="button"
                  onClick={() => removeHealthcareProvider(index)}
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