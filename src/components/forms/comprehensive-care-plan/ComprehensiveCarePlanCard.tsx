import {
  type UseFormRegister,
  type Control,
  type FieldErrors,
} from "react-hook-form";
import { Card, Input, DatePickerField } from "@agensy/components";
import { type ComprehensiveCarePlanFormData } from "@agensy/types";

interface ComprehensiveCarePlanCardProps {
  register: UseFormRegister<ComprehensiveCarePlanFormData>;
  control: Control<ComprehensiveCarePlanFormData>;
  errors: FieldErrors<ComprehensiveCarePlanFormData>;
}

export const ComprehensiveCarePlanCard = ({
  register,
  control,
  errors,
}: ComprehensiveCarePlanCardProps) => {
  return (
    <Card title="Comprehensive Care Plan">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
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
      </div>
      <div className="mb-5">
        <DatePickerField
          control={control}
          name="dateOfBirth"
          label="Date of Birth"
        />
        {errors.dateOfBirth && (
          <p className="text-red-500 text-xs mt-1">
            {errors.dateOfBirth.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <Input
          label="Preferred Hospital"
          register={register("preferredHospital")}
          error={errors.preferredHospital?.message}
        />
        <Input
          label="Pharmacy Name"
          register={register("pharmacyName")}
          error={errors.pharmacyName?.message}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <DatePickerField
          control={control}
          name="dateOfAssessment"
          label="Date of Assessment"
        />
        <DatePickerField
          control={control}
          name="dateOfCarePlan"
          label="Date of Care Plan"
        />
      </div>
    </Card>
  );
};
