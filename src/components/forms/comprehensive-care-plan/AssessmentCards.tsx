import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { Card, Input } from "@agensy/components";
import { type ComprehensiveCarePlanFormData } from "@agensy/types";

interface AssessmentCardsProps {
  register: UseFormRegister<ComprehensiveCarePlanFormData>;
  errors: FieldErrors<ComprehensiveCarePlanFormData>;
}

export const AssessmentCards = ({ register, errors }: AssessmentCardsProps) => {
  return (
    <>
      <Card title="Assessment Information">
        <div className="mb-5">
          <Input
            label="Person Completing Assessment"
            register={register("personCompletingAssessment")}
            error={errors.personCompletingAssessment?.message}
          />
        </div>
      </Card>

      <Card title="Assessment Details">
        <div className="mb-5">
          <Input
            label="Present for Assessment"
            register={register("presentForAssessment")}
            error={errors.presentForAssessment?.message}
          />
        </div>
      </Card>
    </>
  );
};
