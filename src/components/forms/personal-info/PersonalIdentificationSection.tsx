import type {
  Control,
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { Input, Card, DatePickerField } from "@agensy/components";

interface PersonalIdentificationSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

export const PersonalIdentificationSection = <T extends FieldValues>({
  register,
  control,
  errors,
}: PersonalIdentificationSectionProps<T>) => {
  return (
    <Card title="Personal Identification">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="First Name:"
          register={register("firstName" as Path<T>)}
          error={errors.firstName?.message as string}
        />
        <Input
          label="Last Name:"
          register={register("lastName" as Path<T>)}
          error={errors.lastName?.message as string}
        />

        <DatePickerField
          control={control}
          name={"dateOfBirth" as Path<T>}
          label="Date of Birth:"
        />

        <Input
          label="Social Security Number (last 4 digits recommended):"
          register={register("socialSecurityNumber" as Path<T>)}
          error={errors.socialSecurityNumber?.message as string}
        />

        <Input
          label="Driver's License Number & State:"
          register={register("driversLicenseNumber" as Path<T>)}
          error={errors.driversLicenseNumber?.message as string}
        />

        <Input
          label="Passport Number:"
          register={register("passportNumber" as Path<T>)}
          error={errors.passportNumber?.message as string}
        />
      </div>
    </Card>
  );
};
