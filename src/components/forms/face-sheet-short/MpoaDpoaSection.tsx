import type {
  Control,
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { Input, Card, PhoneNumberInput } from "@agensy/components";

interface MpoaDpoaSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

export const MpoaDpoaSection = <T extends FieldValues>({
  register,
  control,
  errors,
}: MpoaDpoaSectionProps<T>) => {
  return (
    <Card title="MPOA / DPOA Information">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">MPOA</h3>
          <div className="space-y-4">
            <Input
              label="Name"
              register={register("mpoaName" as Path<T>)}
              error={errors.mpoaName?.message as string}
            />
            <PhoneNumberInput
              label="Phone"
              control={control}
              name={"mpoaPhone" as Path<T>}
            />
            <Input
              label="Address"
              register={register("mpoaAddress" as Path<T>)}
              error={errors.mpoaAddress?.message as string}
            />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">DPOA</h3>
          <div className="space-y-4">
            <Input
              label="Name"
              register={register("dpoaName" as Path<T>)}
              error={errors.dpoaName?.message as string}
            />
            <PhoneNumberInput
              label="Phone"
              control={control}
              name={"dpoaPhone" as Path<T>}
            />
            <Input
              label="Address"
              register={register("dpoaAddress" as Path<T>)}
              error={errors.dpoaAddress?.message as string}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
