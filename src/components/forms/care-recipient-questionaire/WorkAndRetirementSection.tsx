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
  TextArea,
} from "@agensy/components";

interface WorkAndRetirementSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

export const WorkAndRetirementSection = <T extends FieldValues>({
  register,
  control,
  errors,
}: WorkAndRetirementSectionProps<T>) => {
  return (
    <Card title="Work and Retirement">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="What was care recipient occupation or profession?"
            register={register("occupationProfession" as Path<T>)}
            error={errors.occupationProfession?.message as string}
          />
          <DatePickerField
            control={control}
            name={"retirementDate" as Path<T>}
            label="Date of retirement:"
          />
        </div>
        <div>
          <TextArea
            label="How was the adjustment to retirement? Please describe."
            register={register("retirementAdjustment" as Path<T>)}
            error={errors.retirementAdjustment?.message as string}
            rows={4}
          />
        </div>
      </div>
    </Card>
  );
}; 