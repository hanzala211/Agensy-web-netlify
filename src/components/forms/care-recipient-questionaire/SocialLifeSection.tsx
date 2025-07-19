import type {
  Path,
  FieldErrors,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";
import { Card } from "@agensy/components";
import { TextArea } from "@agensy/components";

interface SocialLifeSectionProps<T extends FieldValues> {
  errors: FieldErrors<T>;
  register: UseFormRegister<T>;
}

export const SocialLifeSection = <T extends FieldValues>({
  errors,
  register,
}: SocialLifeSectionProps<T>) => {
  return (
    <Card title="Social Life">
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 italic">
            What is the extent of care recipient social life, interests? Do you
            feel it is satisfactory? Any significant changes? Does care
            recipient feel satisfied? Please explain.
          </label>
          <TextArea
            register={register("socialLifeNotes" as Path<T>)}
            error={errors.socialLifeNotes?.message as string}
            placeholder="Describe the care recipient's social activities, interests, satisfaction level, and any recent changes..."
            rows={6}
          />
        </div>
      </div>
    </Card>
  );
};
