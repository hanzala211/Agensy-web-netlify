import {
  DatePickerField,
  Input,
  TextArea,
  TertiaryButton,
  Select,
} from "@agensy/components";
import { ICONS } from "@agensy/constants";
import type { LabsTrackerFormData } from "@agensy/types";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

interface LabsTrackerCardProps {
  index: number;
  errors: FieldErrors<LabsTrackerFormData>;
  register: UseFormRegister<LabsTrackerFormData>;
  control: Control<LabsTrackerFormData>;
  onRemove: () => void;
  canRemove: boolean;
  providers: { label: string; value: string }[];
}

export const LabsTrackerCard = ({
  index,
  errors,
  register,
  control,
  onRemove,
  canRemove,
  providers = [],
}: LabsTrackerCardProps) => {
  return (
    <div key={index} className="p-6 border border-gray-200 rounded-lg bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800">
          Lab Test {index + 1}
        </h3>
        {canRemove && (
          <TertiaryButton
            type="button"
            onClick={onRemove}
            className="text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
          >
            <ICONS.delete />
          </TertiaryButton>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Date and Doctor's Name row */}
        <div className="space-y-2">
          <DatePickerField
            label="Date"
            control={control}
            name={`labs.${index}.date`}
            className="w-full"
          />
          {errors.labs?.[index]?.date && (
            <span className="text-red-500 text-sm">
              {errors.labs?.[index]?.date?.message}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <Select
            label="Doctor's Name"
            name={`labs.${index}.doctorName`}
            control={control}
            data={providers}
            labelOption="Select Doctor's Name"
          />
        </div>
      </div>

      {/* Type field */}
      <div className="space-y-2 mb-4">
        <Input
          register={register(`labs.${index}.type`)}
          label="Type"
          inputClassname="w-full"
          error={
            // @ts-expect-error - TODO: fix this
            errors.labs?.[index]?.type?.message as string
          }
        />
      </div>

      {/* Provider / Company Used field */}
      <div className="space-y-2 mb-4">
        <Input
          label="Provider / Company Used"
          register={register(`labs.${index}.providerCompanyUsed`)}
          inputClassname="w-full"
          error={errors.labs?.[index]?.providerCompanyUsed?.message as string}
        />
      </div>

      {/* Purpose field */}
      <div className="space-y-2 mb-4">
        <TextArea
          register={register(`labs.${index}.purpose`)}
          label="Purposes"
          className="w-full"
          rows={2}
          error={errors.labs?.[index]?.purpose?.message as string}
        />
      </div>

      {/* Results field */}
      <div className="space-y-2">
        <TextArea
          label="Results"
          register={register(`labs.${index}.results`)}
          className="w-full"
          rows={3}
          error={errors.labs?.[index]?.results?.message as string}
        />
      </div>
    </div>
  );
};
