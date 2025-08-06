import {
  type UseFormRegister,
  type FieldErrors,
  type UseFormWatch,
  type UseFormSetValue,
} from "react-hook-form";
import { Card, Input, TertiaryButton } from "@agensy/components";
import { type ComprehensiveCarePlanFormData } from "@agensy/types";
import { ICONS } from "@agensy/constants";

interface GoalsForAssessmentCardProps {
  register: UseFormRegister<ComprehensiveCarePlanFormData>;
  errors: FieldErrors<ComprehensiveCarePlanFormData>;
  watch: UseFormWatch<ComprehensiveCarePlanFormData>;
  setValue: UseFormSetValue<ComprehensiveCarePlanFormData>;
}

export const GoalsForAssessmentCard = ({
  register,
  errors,
  watch,
  setValue,
}: GoalsForAssessmentCardProps) => {
  return (
    <Card
      title="Goals for Assessment"
      buttonText={<ICONS.plus size={16} />}
      onButtonClick={() => {
        const currentGoals = watch("goalsForAssessment") || [];
        setValue("goalsForAssessment", [...currentGoals, ""]);
      }}
      ariaLabel="Add Goal for Assessment"
      showButton={true}
    >
      <div className="space-y-6">
        {(watch("goalsForAssessment") || []).map((goal, index) => (
          <div key={index} className="p-3 rounded-lg border">
            <div className="w-full flex gap-4 items-center">
              <div className="w-full">
                <Input
                  placeholder={`Goal ${index + 1}`}
                  register={register(`goalsForAssessment.${index}`)}
                  error={errors.goalsForAssessment?.[index]?.message}
                />
              </div>
              {(watch("goalsForAssessment") || []).length > 1 && (
                <TertiaryButton
                  type="button"
                  onClick={() => {
                    const currentGoals = watch("goalsForAssessment") || [];
                    console.log(goal);
                    const newGoals = currentGoals.filter((_, i) => i !== index);
                    setValue("goalsForAssessment", newGoals);
                  }}
                  className="text-red-600 border !m-0 border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  <ICONS.delete />
                </TertiaryButton>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
