import { DatePickerField, Input, TextArea } from "@agensy/components";
import type { LabsTrackerFormData } from "@agensy/types";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

interface LabsTrackerCardProps {
  index: number;
  errors: FieldErrors<LabsTrackerFormData>;
  register: UseFormRegister<LabsTrackerFormData>;
  control: Control<LabsTrackerFormData>;
}

export const LabsTrackerCard = ({
  index,
  errors,
  register,
  control,
}: LabsTrackerCardProps) => {
  const dateField = `date${index}` as keyof LabsTrackerFormData;
  const doctorNameField = `doctorName${index}` as keyof LabsTrackerFormData;
  const typeField = `type${index}` as keyof LabsTrackerFormData;
  const providerCompanyUsedField =
    `providerCompanyUsed${index}` as keyof LabsTrackerFormData;
  const purposeField = `purpose${index}` as keyof LabsTrackerFormData;
  const resultsField = `results${index}` as keyof LabsTrackerFormData;
  return (
    <div
      key={index}
      className={`p-6 border border-gray-200 rounded-lg ${
        index % 2 === 0 ? "bg-gray-50" : "bg-white"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Date and Doctor's Name row */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <DatePickerField
            control={control}
            name={dateField}
            className="w-full"
          />
          {errors[dateField] && (
            <span className="text-red-500 text-sm">
              {errors[dateField]?.message}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Doctor's Name
          </label>
          <Input
            register={register(doctorNameField)}
            placeholder="Enter doctor's name"
            inputClassname="w-full"
          />
          {errors[doctorNameField] && (
            <span className="text-red-500 text-sm">
              {errors[doctorNameField]?.message}
            </span>
          )}
        </div>
      </div>

      {/* Type field */}
      <div className="space-y-2 mb-4">
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <Input
          register={register(typeField)}
          placeholder="Enter lab type"
          inputClassname="w-full"
        />
        {errors[typeField] && (
          <span className="text-red-500 text-sm">
            {errors[typeField]?.message}
          </span>
        )}
      </div>

      {/* Provider / Company Used field */}
      <div className="space-y-2 mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Provider / Company Used
        </label>
        <Input
          register={register(providerCompanyUsedField)}
          placeholder="Enter provider or company name"
          inputClassname="w-full"
        />
        {errors[providerCompanyUsedField] && (
          <span className="text-red-500 text-sm">
            {errors[providerCompanyUsedField]?.message}
          </span>
        )}
      </div>

      {/* Purpose field */}
      <div className="space-y-2 mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Purpose
        </label>
        <TextArea
          register={register(purposeField)}
          placeholder="Enter purpose of the lab test"
          className="w-full"
          rows={2}
        />
        {errors[purposeField] && (
          <span className="text-red-500 text-sm">
            {errors[purposeField]?.message}
          </span>
        )}
      </div>

      {/* Results field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Results
        </label>
        <TextArea
          register={register(resultsField)}
          placeholder="Enter lab results"
          className="w-full"
          rows={3}
        />
        {errors[resultsField] && (
          <span className="text-red-500 text-sm">
            {errors[resultsField]?.message}
          </span>
        )}
      </div>
    </div>
  );
};
