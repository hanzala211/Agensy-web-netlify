import type {
  Control,
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { Input, Card, PhoneNumberInput } from "@agensy/components";

interface PharmacyInformationSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

export const PharmacyInformationSection = <T extends FieldValues>({
  register,
  control,
  errors,
}: PharmacyInformationSectionProps<T>) => {
  return (
    <Card title="Pharmacy Information">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Input
          label="Pharmacy Name"
          register={register("pharmacyName" as Path<T>)}
          error={errors.pharmacyName?.message as string}
        />
        <PhoneNumberInput
          label="Phone"
          control={control}
          name={"pharmacyPhone" as Path<T>}
        />
        <PhoneNumberInput
          label="Fax"
          control={control}
          name={"pharmacyFax" as Path<T>}
        />
        <Input
          label="Address"
          register={register("pharmacyAddress" as Path<T>)}
          error={errors.pharmacyAddress?.message as string}
        />
      </div>
    </Card>
  );
};
