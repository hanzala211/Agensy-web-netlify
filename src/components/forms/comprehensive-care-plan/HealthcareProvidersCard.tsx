import {
  type UseFormRegister,
  type FieldErrors,
  type Control,
  type UseFieldArrayReturn,
} from "react-hook-form";
import {
  Card,
  Input,
  TertiaryButton,
  Select,
  PhoneNumberInput,
} from "@agensy/components";
import { type ComprehensiveCarePlanFormData } from "@agensy/types";
import { ICONS, PROVIDER_TYPES, SPECIALTIES } from "@agensy/constants";

interface HealthcareProvidersCardProps {
  register: UseFormRegister<ComprehensiveCarePlanFormData>;
  errors: FieldErrors<ComprehensiveCarePlanFormData>;
  control: Control<ComprehensiveCarePlanFormData>;
  healthcareProvidersFields: UseFieldArrayReturn<
    ComprehensiveCarePlanFormData,
    "healthcareProviders",
    "id"
  >["fields"];
  appendHealthcareProvider: UseFieldArrayReturn<
    ComprehensiveCarePlanFormData,
    "healthcareProviders",
    "id"
  >["append"];
  removeHealthcareProvider: UseFieldArrayReturn<
    ComprehensiveCarePlanFormData,
    "healthcareProviders",
    "id"
  >["remove"];
}

export const HealthcareProvidersCard = ({
  register,
  errors,
  control,
  healthcareProvidersFields,
  appendHealthcareProvider,
  removeHealthcareProvider,
}: HealthcareProvidersCardProps) => {
  return (
    <Card
      title="Healthcare Providers"
      buttonText={<ICONS.plus size={16} />}
      onButtonClick={() =>
        appendHealthcareProvider({
          id: null,
          providerName: "",
          providerType: "",
          specialty: "",
          specialty_custom: "",
          address: "",
          phone: "",
        })
      }
      ariaLabel="Add Healthcare Provider"
      showButton={true}
    >
      <div className="space-y-6">
        {healthcareProvidersFields.map((field, index) => (
          <div key={field.id} className="p-4 rounded-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <span className="text-sm font-medium text-gray-700 mr-2">
                Provider {index + 1}:
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Provider Name"
                register={register(`healthcareProviders.${index}.providerName`)}
                error={
                  errors.healthcareProviders?.[index]?.providerName?.message
                }
              />
              <Select
                label="Provider Type"
                control={control}
                name={`healthcareProviders.${index}.providerType`}
                data={PROVIDER_TYPES}
                labelOption="Select Provider Type"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Select
                label="Specialty"
                name={`healthcareProviders.${index}.specialty`}
                control={control}
                data={SPECIALTIES}
                labelOption="Select Specialty"
                enableTextInput={true}
                textInputTriggerValue="Other"
                textInputName={`healthcareProviders.${index}.specialty_custom`}
                textInputPlaceholder="Enter specialty"
              />
              <PhoneNumberInput
                label="Phone"
                name={`healthcareProviders.${index}.phone`}
                control={control}
              />
            </div>
            <div className="mb-4">
              <Input
                label="Address"
                register={register(`healthcareProviders.${index}.address`)}
                error={errors.healthcareProviders?.[index]?.address?.message}
              />
            </div>
            {healthcareProvidersFields.length > 1 && (
              <div className="flex justify-end">
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
