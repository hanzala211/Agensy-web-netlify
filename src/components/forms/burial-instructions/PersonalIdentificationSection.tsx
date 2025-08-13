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
        <div className="md:col-span-2">
          <Input
            label="Full Name of Deceased"
            register={register("fullNameOfDeceased" as Path<T>)}
            error={errors.fullNameOfDeceased?.message as string}
          />
        </div>
        <DatePickerField
          control={control}
          name={"dateOfBirth" as Path<T>}
          label="Date of Birth"
        />
        <Input
          label="Time of Death"
          register={register("timeOfDeath" as Path<T>)}
          error={errors.timeOfDeath?.message as string}
        />
        <DatePickerField
          control={control}
          name={"dateOfDeath" as Path<T>}
          label="Date of Death"
        />
        <Input
          label="County That Issued Death Certificate"
          register={register("countyThatIssuedDeathCertificate" as Path<T>)}
          error={errors.countyThatIssuedDeathCertificate?.message as string}
        />
        <Input
          label="Number of Death Certificates Ordered"
          register={register("numberOfDeathCertificatesOrdered" as Path<T>)}
          error={errors.numberOfDeathCertificatesOrdered?.message as string}
        />
      </div>
    </Card>
  );
};
