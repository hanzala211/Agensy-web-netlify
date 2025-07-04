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
  DatePickerField,
  PhoneNumberInput,
} from "@agensy/components";

interface PersonalInformationSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

export const PersonalInformationSection = <T extends FieldValues>({
  register,
  control,
  errors,
}: PersonalInformationSectionProps<T>) => {
  return (
    <Card title="Personal Information">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Input
          label="First Name"
          register={register("firstName" as Path<T>)}
          error={errors.firstName?.message as string}
        />
        <Input
          label="Last Name"
          register={register("lastName" as Path<T>)}
          error={errors.lastName?.message as string}
        />
        <PhoneNumberInput
          label="Phone Number"
          control={control}
          name={"phoneNumber" as Path<T>}
        />
        <DatePickerField
          control={control}
          name={"dateOfBirth" as Path<T>}
          label="Date of Birth"
        />
        <Input
          label="SSN"
          register={register("ssn" as Path<T>)}
          error={errors.ssn?.message as string}
        />
        <Input
          label="Address"
          register={register("address" as Path<T>)}
          error={errors.address?.message as string}
        />
      </div>
    </Card>
  );
};
