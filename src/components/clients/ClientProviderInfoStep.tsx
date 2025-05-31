import type { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import type { UseFormRegister } from "react-hook-form";
import { Input, PhoneNumberInput } from "@agensy/components";

interface ClientProviderInfoStepProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  showLabel?: boolean;
}

export const ClientProviderInfoStep = <T extends FieldValues>({
  register,
  control,
  errors,
  showLabel = true,
}: ClientProviderInfoStepProps<T>) => {
  return (
    <div className="space-y-3">
      {showLabel && (
        <h3 className={`text-lg mt-3 font-medium`}>Healthcare Information</h3>
      )}
      <div className="bg-gray-50 p-5 grid md:grid-cols-2 gap-5 rounded-lg shadow-sm">
        <Input
          label="Preferred Hospital Name"
          register={register("preferred_hospital" as Path<T>)}
          error={errors.preferred_hospital?.message as string}
        />

        <PhoneNumberInput
          control={control}
          label="Hospital Phone"
          name={"hospital_phone" as Path<T>}
        />

        <div className="md:col-span-2">
          <Input
            label="Hospital Address"
            register={register("hospital_address" as Path<T>)}
            error={errors.hospital_address?.message as string}
          />
        </div>

        <Input
          label="Pharmacy Name"
          register={register("pharmacy_name" as Path<T>)}
          error={errors.pharmacy_name?.message as string}
        />

        <PhoneNumberInput
          control={control}
          label="Pharmacy Phone"
          name={"pharmacy_phone" as Path<T>}
        />
        <div className="md:col-span-2">
          <Input
            label="Pharmacy Address"
            register={register("pharmacy_address" as Path<T>)}
            error={errors.pharmacy_address?.message as string}
          />
        </div>
        <PhoneNumberInput
          control={control}
          label="Pharmacy Fax"
          name={"pharmacy_fax" as Path<T>}
        />
      </div>
    </div>
  );
};

export default ClientProviderInfoStep;
