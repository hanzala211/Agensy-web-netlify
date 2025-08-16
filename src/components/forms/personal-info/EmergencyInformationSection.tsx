import type {
  Control,
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { Input, Card, Select, PhoneNumberInput } from "@agensy/components";
import { RELATIONSHIP_TO_CLIENT } from "@agensy/constants";

interface EmergencyInformationSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

export const EmergencyInformationSection = <T extends FieldValues>({
  register,
  control,
  errors,
}: EmergencyInformationSectionProps<T>) => {
  return (
    <Card title="Emergency Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="Emergency Contact First Name:"
          register={register("emergencyContactFirstName" as Path<T>)}
          error={errors.emergencyContactFirstName?.message as string}
        />
        <Input
          label="Emergency Contact Last Name:"
          register={register("emergencyContactLastName" as Path<T>)}
          error={errors.emergencyContactLastName?.message as string}
        />

        <PhoneNumberInput
          control={control}
          name={"emergencyContactPhone" as Path<T>}
          label="Phone:"
        />

        <Select
          label="Relationship:"
          data={RELATIONSHIP_TO_CLIENT}
          control={control}
          name={"emergencyContactRelationship" as Path<T>}
          labelOption="Select Relationship"
        />

        <Input
          label="Health Insurance Provider:"
          register={register("healthInsuranceProvider" as Path<T>)}
          error={errors.healthInsuranceProvider?.message as string}
        />

        <Input
          label="Policy Number:"
          register={register("healthInsurancePolicyNumber" as Path<T>)}
          error={errors.healthInsurancePolicyNumber?.message as string}
        />
      </div>
    </Card>
  );
};
