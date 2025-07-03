import React from "react";
import type {
  Control,
  UseFormRegister,
  FieldErrors,
  UseFieldArrayReturn,
} from "react-hook-form";
import type { FaceSheetShortFormData } from "@agensy/types";
import {
  Input,
  Card,
  DatePickerField,
  PhoneNumberInput,
} from "@agensy/components";
import { ICONS } from "@agensy/constants";

interface HealthcareProvidersSectionProps {
  register: UseFormRegister<FaceSheetShortFormData>;
  control: Control<FaceSheetShortFormData>;
  errors: FieldErrors<FaceSheetShortFormData>;
  providersArray: UseFieldArrayReturn<FaceSheetShortFormData, "providers">;
}

export const HealthcareProvidersSection: React.FC<
  HealthcareProvidersSectionProps
> = ({ register, control, errors, providersArray }) => {
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
                  register={register(`providers.${index}.providerName`)}
                  error={errors.providers?.[index]?.providerName?.message}
                />
                <Input
                  label="Specialty"
                  register={register(`providers.${index}.specialty`)}
                  error={errors.providers?.[index]?.specialty?.message}
                />
                <Input
                  label="Address"
                  register={register(`providers.${index}.address`)}
                  error={errors.providers?.[index]?.address?.message}
                />

                <PhoneNumberInput
                  label="Phone"
                  control={control}
                  name={`providers.${index}.phone`}
                />

                <DatePickerField
                  control={control}
                  name={`providers.${index}.lastVisit`}
                  label="Last Visit"
                />
                <DatePickerField
                  control={control}
                  name={`providers.${index}.nextVisit`}
                  label="Next Visit"
                />
              </div>
            </div>
            <div className="w-full flex gap-4 items-center mt-4">
              <div className="w-full">
                <PhoneNumberInput
                  label="Fax"
                  control={control}
                  name={`providers.${index}.fax`}
                />
              </div>
            </div>
            {providerFields.length > 1 && (
              <div className="flex justify-end mt-3">
                <button
                  type="button"
                  onClick={() => removeProvider(index)}
                  className="text-red-600 hover:text-red-800 p-1"
                  aria-label="Remove healthcare provider"
                >
                  <ICONS.delete size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
