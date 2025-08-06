import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { Card, TextArea } from "@agensy/components";
import { type ComprehensiveCarePlanFormData } from "@agensy/types";

interface TextAreaCardsProps {
  register: UseFormRegister<ComprehensiveCarePlanFormData>;
  errors: FieldErrors<ComprehensiveCarePlanFormData>;
}

export const TextAreaCards = ({ register, errors }: TextAreaCardsProps) => {
  return (
    <>
      <Card title="Initial Request">
        <div className="mb-5">
          <TextArea
            label="Initial Request"
            register={register("initialRequest")}
            error={errors.initialRequest?.message}
            rows={4}
            placeholder="Provide details and reasons for assessment and reason for assessment and engagement with services."
          />
        </div>
      </Card>

      <Card title="Care Recipients Stated Goals">
        <div className="mb-5">
          <TextArea
            label="Care Recipients Stated Goals"
            register={register("careRecipientGoals")}
            error={errors.careRecipientGoals?.message}
            rows={4}
            placeholder="Provide details of the care recipients stated goals and requests pertaining to service provision."
          />
        </div>
      </Card>

      <Card title="Demographic and Historic Information">
        <div className="mb-5">
          <TextArea
            label="Demographic and Historic Information"
            register={register("demographicAndHistoricInformation")}
            error={errors.demographicAndHistoricInformation?.message}
            rows={4}
            placeholder="Provide demographic and historic information about the care recipient."
          />
        </div>
      </Card>

      <Card title="Medical History">
        <div className="mb-5">
          <TextArea
            label="Medical History"
            register={register("medicalHistory")}
            error={errors.medicalHistory?.message}
            rows={4}
            placeholder="Provide detailed medical history including diagnoses, treatments, medications, and any relevant medical conditions."
          />
        </div>
      </Card>
    </>
  );
};
