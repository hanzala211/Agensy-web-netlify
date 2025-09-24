import React from "react";
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import type { ClientFormData, IUser } from "@agensy/types";
import {
  MARITAL_STATUS_OPTIONS,
  LIVING_SITUATION_OPTIONS,
  GENDER_OPTIONS,
  STATES,
} from "@agensy/constants";
import { DatePickerField, Select, Input } from "@agensy/components";
import { useAuthContext } from "@agensy/context";

interface ClientPersonalInfoStepProps {
  register: UseFormRegister<ClientFormData>;
  control: Control<ClientFormData>;
  errors: FieldErrors<ClientFormData>;
  showLabel?: boolean;
  hasAdminRole?: boolean;
  familyAdmins: IUser[];
}

export const ClientPersonalInfoStep: React.FC<ClientPersonalInfoStepProps> = ({
  register,
  control,
  errors,
  showLabel = true,
  hasAdminRole = false,
  familyAdmins,
}) => {
  const { userData } = useAuthContext();
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
          <Input
            label="Preferred Name"
            register={register("preferredName")}
            error={errors.preferredName?.message}
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
          {hasAdminRole && (
            <Select
              control={control}
              name="familyAdminId"
              label="Family Admin"
              data={(() => {
                const dropdownData = familyAdmins.map((user: IUser) => ({
                  label:
                    user.id === userData?.id
                      ? `${user.first_name} ${user.last_name} (You)`
                      : `${user.first_name} ${user.last_name}`,
                  value: user.id as string,
                }));
                return dropdownData;
              })()}
              aria_label="Select family admin"
              labelOption="Select family admin"
              buttonLabel="Add Family Admin"
              showButton={false}
            />
          )}
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

          <Select
            label="State"
            control={control}
            name="state"
            data={STATES}
            labelOption="Select state"
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
