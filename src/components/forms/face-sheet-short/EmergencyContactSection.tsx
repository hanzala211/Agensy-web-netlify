import type {
  Control,
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { Input, Card, PhoneNumberInput, Select } from "@agensy/components";
import { RELATIONSHIP_TO_CLIENT } from "@agensy/constants";

interface EmergencyContactSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

export const EmergencyContactSection = <T extends FieldValues>({
  register,
  control,
  errors,
}: EmergencyContactSectionProps<T>) => {
  return (
    <Card title="Emergency Contact">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Input
          label="First Name"
          register={register("emergencyContactFirstName" as Path<T>)}
          error={errors.emergencyContactFirstName?.message as string}
        />
        <Input
          label="Last Name"
          register={register("emergencyContactLastName" as Path<T>)}
          error={errors.emergencyContactLastName?.message as string}
        />
        <PhoneNumberInput
          label="Phone"
          control={control}
          name={"emergencyContactPhone" as Path<T>}
        />

        <Select
          control={control}
          name={"emergencyContactRelationship" as Path<T>}
          data={RELATIONSHIP_TO_CLIENT}
          label="Relationship"
          labelOption="Relationship"
        />
        <Input
          label="Email"
          type="email"
          register={register("emergencyContactEmail" as Path<T>)}
          error={errors.emergencyContactEmail?.message as string}
        />
        <Input
          label="Address"
          register={register("emergencyContactAddress" as Path<T>)}
          error={errors.emergencyContactAddress?.message as string}
        />
      </div>
    </Card>
  );
};
