import type {
  Control,
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { Input, Card, PhoneNumberInput } from "@agensy/components";

interface HospitalPreferenceSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

export const HospitalPreferenceSection = <T extends FieldValues>({
  register,
  control,
  errors,
}: HospitalPreferenceSectionProps<T>) => {
  return (
    <Card title="Hospital Preference">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Input
          label="Hospital Preference"
          register={register("hospitalPreference" as Path<T>)}
          error={errors.hospitalPreference?.message as string}
        />
        <PhoneNumberInput
          label="Phone Number"
          control={control}
          name={"hospitalPhoneNumber" as Path<T>}
        />
        <Input
          label="Address"
          register={register("hospitalAddress" as Path<T>)}
          error={errors.hospitalAddress?.message as string}
        />
      </div>
    </Card>
  );
};
