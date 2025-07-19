import type {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { Input, Card, RadioInput, TextArea } from "@agensy/components";

interface SupportSystemSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export const SupportSystemSection = <T extends FieldValues>({
  register,
  errors,
}: SupportSystemSectionProps<T>) => {
  return (
    <Card title="Support System & Emergency Contacts">
      <div className="space-y-6">
        {/* Support System Rating */}
        <div className="flex gap-4 lg:flex-row flex-col lg:items-center">
          <label className="text-sm font-medium text-gray-700">
            How would you rate the present support system?
          </label>
          <div className="md:space-x-8 space-x-2">
            {["Excellent", "Good", "Fair", "Poor"].map((rating) => (
              <RadioInput
                key={rating}
                label={rating}
                value={rating}
                register={register("supportSystemRating" as Path<T>)}
              />
            ))}
          </div>
          {errors.supportSystemRating && (
            <p className="text-red-500 text-sm">
              {errors.supportSystemRating.message as string}
            </p>
          )}
        </div>

        {/* Support System Problems */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Any recent problems with this support system?
          </label>
          <div className="space-y-2">
            <TextArea
              register={register("supportSystemProblems" as Path<T>)}
              error={errors.supportSystemProblems?.message as string}
              placeholder="Describe any problems..."
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Which of these people would care recipient call in an emergency?
          </label>
          <Input
            register={register("emergencyContacts" as Path<T>)}
            error={errors.emergencyContacts?.message as string}
            placeholder="Enter emergency contact names..."
          />
        </div>
      </div>
    </Card>
  );
};
