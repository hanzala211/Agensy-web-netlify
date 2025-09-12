import type {
  Control,
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import {
  Input,
  Card,
  PhoneNumberInput,
  RadioInput,
  DatePickerField,
} from "@agensy/components";

interface InsuranceSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

export const InsuranceSection = <T extends FieldValues>({
  register,
  control,
  errors,
}: InsuranceSectionProps<T>) => {
  return (
    <Card title="Insurance Information">
      <div className="space-y-6">
        {/* Medicare Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DatePickerField
              label="Medicare A"
              control={control}
              name={"medicareA" as Path<T>}
            />
            <DatePickerField
              label="Medicare B"
              control={control}
              name={"medicareB" as Path<T>}
            />
            <Input
              label="Medicare #s"
              register={register("medicareNumbers" as Path<T>)}
              error={errors.medicareNumbers?.message as string}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Medicare Supplement/ Advantage/ Secondary Plan"
            register={register("medicareSupplementPlan" as Path<T>)}
            error={errors.medicareSupplementPlan?.message as string}
          />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Insurance Provider"
              register={register("insuranceProvider" as Path<T>)}
              error={errors.insuranceProvider?.message as string}
            />
            <Input
              label="Policy #"
              register={register("insurancePolicyNumber" as Path<T>)}
              error={errors.insurancePolicyNumber?.message as string}
            />
            <PhoneNumberInput
              label="Phone"
              control={control}
              name={"insurancePhone" as Path<T>}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Does policy cover mental health benefits?
            </label>
            <div className="flex items-center space-x-6">
              <RadioInput
                label="Yes"
                register={register("mentalHealthCoverage" as Path<T>)}
                value="true"
              />
              <RadioInput
                label="No"
                register={register("mentalHealthCoverage" as Path<T>)}
                value="false"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="HMO"
              register={register("hmo" as Path<T>)}
              error={errors.hmo?.message as string}
            />
            <Input
              label="HMO Policy #"
              register={register("hmoPolicyNumber" as Path<T>)}
              error={errors.hmoPolicyNumber?.message as string}
            />
            <PhoneNumberInput
              label="Phone"
              control={control}
              name={"hmoPhone" as Path<T>}
            />
          </div>
        </div>

        {/* Long-Term Care Insurance Section */}
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-4">
              Do you have long-term care insurance? If so list name, policy
              number and phone number
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Name"
                register={register("longTermCareInsuranceName" as Path<T>)}
                error={errors.longTermCareInsuranceName?.message as string}
              />
              <Input
                label="Policy #"
                register={register(
                  "longTermCareInsurancePolicyNumber" as Path<T>
                )}
                error={
                  errors.longTermCareInsurancePolicyNumber?.message as string
                }
              />
              <PhoneNumberInput
                label="Phone"
                control={control}
                name={"longTermCareInsurancePhone" as Path<T>}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
