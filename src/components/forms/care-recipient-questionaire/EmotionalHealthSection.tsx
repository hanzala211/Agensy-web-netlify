import type {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { Card, TextArea } from "@agensy/components";

interface EmotionalHealthSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export const EmotionalHealthSection = <T extends FieldValues>({
  register,
  errors,
}: EmotionalHealthSectionProps<T>) => {
  return (
    <Card title="Emotional Health">
      <div className="space-y-6">
        {/* Personality and Coping */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Describe basic personality. How does care recipient cope? Do you see
            care recipient as dependent, anxious, withdrawn, content, lonely,
            other?
          </label>
          <TextArea
            register={register("personalityCoping" as Path<T>)}
            error={errors.personalityCoping?.message as string}
            placeholder="Describe personality traits and coping mechanisms..."
            rows={4}
          />
        </div>

        {/* Recent Behavior Changes */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Are you concerned about any recent changes in behavior or sense of
            well-being? If so describe. (What hints have you received lately?)
          </label>
          <TextArea
            register={register("recentBehaviorChanges" as Path<T>)}
            error={errors.recentBehaviorChanges?.message as string}
            placeholder="Describe any recent behavioral changes or concerns..."
            rows={4}
          />
        </div>

        {/* Recipient Shares Concerns */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Does care recipient share your same concerns or worries as stated
            above?
          </label>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="shares_concerns_yes"
                value="true"
                {...register("recipientSharesConcerns" as Path<T>)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="shares_concerns_yes"
                className="text-sm text-gray-700"
              >
                Yes
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="shares_concerns_no"
                value="false"
                {...register("recipientSharesConcerns" as Path<T>)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="shares_concerns_no"
                className="text-sm text-gray-700"
              >
                No
              </label>
            </div>
          </div>
          {errors.recipientSharesConcerns && (
            <p className="text-red-500 text-sm">
              {errors.recipientSharesConcerns.message as string}
            </p>
          )}
        </div>

        {/* Recipient Shares Concerns Notes */}
        <div className="space-y-3">
          <TextArea
            register={register("recipientSharesConcernsNotes" as Path<T>)}
            error={errors.recipientSharesConcernsNotes?.message as string}
            placeholder="Describe how the care recipient shares or expresses their concerns..."
            rows={4}
          />
        </div>

        {/* General Emotional Health Notes */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Additional emotional health notes:
          </label>
          <TextArea
            register={register("emotionalHealthNotes" as Path<T>)}
            error={errors.emotionalHealthNotes?.message as string}
            placeholder="Any additional observations about emotional health and well-being..."
            rows={4}
          />
        </div>

        {/* Emotional Problems History */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Any history of emotional problems?
          </label>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="emotional_problems_yes"
                value="true"
                {...register("emotionalProblemsHistory" as Path<T>)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="emotional_problems_yes"
                className="text-sm text-gray-700"
              >
                Yes
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="emotional_problems_no"
                value="false"
                {...register("emotionalProblemsHistory" as Path<T>)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="emotional_problems_no"
                className="text-sm text-gray-700"
              >
                No
              </label>
            </div>
          </div>
          {errors.emotionalProblemsHistory && (
            <p className="text-red-500 text-sm">
              {errors.emotionalProblemsHistory.message as string}
            </p>
          )}
        </div>

        {/* Emotional Problems Treatment */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Past or present treatment?
          </label>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="emotional_treatment_yes"
                value="true"
                {...register("emotionalProblemsTreatment" as Path<T>)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="emotional_treatment_yes"
                className="text-sm text-gray-700"
              >
                Yes
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="emotional_treatment_no"
                value="false"
                {...register("emotionalProblemsTreatment" as Path<T>)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="emotional_treatment_no"
                className="text-sm text-gray-700"
              >
                No
              </label>
            </div>
          </div>
          {errors.emotionalProblemsTreatment && (
            <p className="text-red-500 text-sm">
              {errors.emotionalProblemsTreatment.message as string}
            </p>
          )}
        </div>

        {/* Emotional Problems Notes */}
        <div className="space-y-3">
          <TextArea
            register={register("emotionalProblemsNotes" as Path<T>)}
            error={errors.emotionalProblemsNotes?.message as string}
            placeholder="Describe any history of emotional problems and past or present treatment..."
            rows={4}
          />
        </div>

        {/* Recent Losses Impact */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Has care recipient experienced recent losses of any kind (health,
            loved ones, job, driving, etc.)? Describe impact.
          </label>
          <TextArea
            register={register("recentLossesImpact" as Path<T>)}
            error={errors.recentLossesImpact?.message as string}
            placeholder="Describe any recent losses and their impact on the care recipient..."
            rows={4}
          />
        </div>
      </div>
    </Card>
  );
};
