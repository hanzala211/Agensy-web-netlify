import type {
  Control,
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { Input, Card, PhoneNumberInput, Select } from "@agensy/components";
import { RELATIONSHIP_TO_CLIENT } from "@agensy/constants";

interface KeyContactsSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

export const KeyContactsSection = <T extends FieldValues>({
  register,
  control,
  errors,
}: KeyContactsSectionProps<T>) => {
  return (
    <Card title="Key Contacts">
      <div className="space-y-8">
        {/* Person Responsible for Arrangements */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Person Responsible for Arrangements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Name"
              register={register("personResponsibleName" as Path<T>)}
              error={errors.personResponsibleName?.message as string}
            />
            <PhoneNumberInput
              control={control}
              name={"personResponsiblePhone" as Path<T>}
              label="Phone"
            />
            <Select
              label="Relationship"
              control={control}
              name={"personResponsibleRelationship" as Path<T>}
              data={RELATIONSHIP_TO_CLIENT}
              labelOption="Select Relationship"
            />
          </div>
        </div>

        {/* Legal/Medical Power of Attorney */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Legal/Medical Power of Attorney
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              register={register("legalMedicalPowerOfAttorneyName" as Path<T>)}
              error={errors.legalMedicalPowerOfAttorneyName?.message as string}
            />
            <PhoneNumberInput
              control={control}
              name={"legalMedicalPowerOfAttorneyPhone" as Path<T>}
              label="Phone"
            />
          </div>
        </div>

        {/* Clergy or Spiritual Advisor */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Clergy or Spiritual Advisor (if desired)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              register={register("clergySpiritualAdvisorName" as Path<T>)}
              error={errors.clergySpiritualAdvisorName?.message as string}
            />
            <PhoneNumberInput
              control={control}
              name={"clergySpiritualAdvisorPhone" as Path<T>}
              label="Phone"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
