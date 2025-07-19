import type {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
  Control,
} from "react-hook-form";
import {
  Input,
  Card,
  TextArea,
  RadioInput,
  DatePickerField,
} from "@agensy/components";

interface MedicalInfoSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  control: Control<T>;
}

export const MedicalInfoSection = <T extends FieldValues>({
  register,
  errors,
  control,
}: MedicalInfoSectionProps<T>) => {
  return (
    <Card title="Medical Information">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePickerField
            label="Date of last checkup"
            control={control}
            name={"lastCheckupDate" as Path<T>}
          />
          <Input
            label="Known allergies (comma separated)"
            register={register("allergies" as Path<T>)}
            error={errors.allergies?.message as string}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Recent hospitalization, name and address of hospital, length of
            stay, do you have records from stay?
          </label>
          <div className="flex gap-4">
            <RadioInput
              label="Yes"
              value="true"
              register={register("recentHospitalization" as Path<T>)}
            />
            <RadioInput
              label="No"
              value="false"
              register={register("recentHospitalization" as Path<T>)}
            />
          </div>
          {errors.recentHospitalization && (
            <p className="text-red-500 text-sm">
              {errors.recentHospitalization.message as string}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Describe reason and outcome:
          </label>
          <TextArea
            register={register("hospitalDetails" as Path<T>)}
            error={errors.hospitalDetails?.message as string}
            placeholder="Describe hospitalization details..."
            rows={3}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Thoughts on current support system, is care recipient receptive, is
            it adequate, what are the gaps? Do you foresee needing additional
            support in the future, if so what:
          </label>
          <TextArea
            register={register("supportSystemThoughts" as Path<T>)}
            error={errors.supportSystemThoughts?.message as string}
            placeholder="Describe support system thoughts and future needs..."
            rows={3}
          />
        </div>
      </div>
    </Card>
  );
};
