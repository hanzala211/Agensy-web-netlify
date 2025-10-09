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
  Select,
} from "@agensy/components";
import { GENDER_OPTIONS, STATES } from "@agensy/constants";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
        <Input
          label="Preferred Name"
          register={register("preferredName" as Path<T>)}
          error={errors.preferredName?.message as string}
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
        <Select
          data={GENDER_OPTIONS}
          labelOption="Select Gender"
          label="Gender"
          control={control}
          name={"gender" as Path<T>}
        />

        <Input
          label="City"
          register={register("city" as Path<T>)}
          error={errors.city?.message as string}
        />
        <Select
          data={STATES}
          labelOption="Select State"
          label="State"
          control={control}
          name={"state" as Path<T>}
        />
        <Input
          label="Zip Code"
          register={register("zip" as Path<T>)}
          error={errors.zip?.message as string}
        />
        <div className="md:col-span-2">
          <Input
            label="Address"
            register={register("address" as Path<T>)}
            error={errors.address?.message as string}
          />
        </div>
      </div>
    </Card>
  );
};
