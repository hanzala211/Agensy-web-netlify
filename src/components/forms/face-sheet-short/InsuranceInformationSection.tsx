import type {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { Input, Card } from "@agensy/components";

interface InsuranceInformationSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export const InsuranceInformationSection = <T extends FieldValues>({
  register,
  errors,
}: InsuranceInformationSectionProps<T>) => {
  return (
    <Card title="Insurance Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="Medicare"
          register={register("medicare" as Path<T>)}
          error={errors.medicare?.message as string}
        />
        <Input
          label="Insurance"
          register={register("insurance" as Path<T>)}
          error={errors.insurance?.message as string}
        />
        <Input
          label="ID Number"
          register={register("idNumber" as Path<T>)}
          error={errors.idNumber?.message as string}
        />
        <Input
          label="Group Number"
          register={register("groupNumber" as Path<T>)}
          error={errors.groupNumber?.message as string}
        />
      </div>
    </Card>
  );
};
