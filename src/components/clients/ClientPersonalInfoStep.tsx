import React from "react";
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import type { ClientFormData } from "@agensy/types";
import {
  MARITAL_STATUS_OPTIONS,
  LIVING_SITUATION_OPTIONS,
  GENDER_OPTIONS,
} from "@agensy/constants";
import { DatePickerField, Select, Input } from "@agensy/components";

interface ClientPersonalInfoStepProps {
  register: UseFormRegister<ClientFormData>;
  control: Control<ClientFormData>;
  errors: FieldErrors<ClientFormData>;
  showLabel?: boolean;
}

export const ClientPersonalInfoStep: React.FC<ClientPersonalInfoStepProps> = ({
  register,
  control,
  errors,
  showLabel = true,
}) => {
  return (
    <div className="space-y-3">
      {showLabel && (
        <h3 className="text-lg font-medium">Personal Information</h3>
      )}
      <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="First Name"
            register={register("firstName")}
            error={errors.firstName?.message}
          />

          <Input
            label="Last Name"
            register={register("lastName")}
            error={errors.lastName?.message}
          />

          <DatePickerField
            control={control}
            name="dateOfBirth"
            label="Date of Birth"
          />

          <Select
            control={control}
            name="gender"
            label="Gender"
            data={GENDER_OPTIONS}
          />

          <Select
            control={control}
            name="maritalStatus"
            label="Marital Status"
            data={MARITAL_STATUS_OPTIONS}
            labelOption="Select status"
          />

          <Select
            control={control}
            name="livingSituation"
            label="Living Situation"
            data={LIVING_SITUATION_OPTIONS}
            labelOption="Select living situation"
          />
          <div className="md:col-span-2">
            <Input
              label="Address"
              register={register("address")}
              error={errors.address?.message}
            />
          </div>

          <Input
            label="City"
            register={register("city")}
            error={errors.city?.message}
          />

          <Input
            label="State"
            register={register("state")}
            error={errors.state?.message}
          />

          <Input
            label="ZIP Code"
            register={register("zipCode")}
            error={errors.zipCode?.message}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientPersonalInfoStep;
