import {
  type UseFormRegister,
  type FieldErrors,
  type UseFormWatch,
  type UseFormSetValue,
  type UseFieldArrayReturn,
} from "react-hook-form";
import {
  Card,
  Input,
  TertiaryButton,
  MultipleTextInputs,
} from "@agensy/components";
import { type ComprehensiveCarePlanFormData } from "@agensy/types";
import { ICONS } from "@agensy/constants";

interface FocusedRecommendationsCardProps {
  register: UseFormRegister<ComprehensiveCarePlanFormData>;
  errors: FieldErrors<ComprehensiveCarePlanFormData>;
  watch: UseFormWatch<ComprehensiveCarePlanFormData>;
  setValue: UseFormSetValue<ComprehensiveCarePlanFormData>;
  focusedRecommendationsFields: UseFieldArrayReturn<
    ComprehensiveCarePlanFormData,
    "focusedRecommendations",
    "id"
  >["fields"];
  appendFocusedRecommendation: UseFieldArrayReturn<
    ComprehensiveCarePlanFormData,
    "focusedRecommendations",
    "id"
  >["append"];
  removeFocusedRecommendation: UseFieldArrayReturn<
    ComprehensiveCarePlanFormData,
    "focusedRecommendations",
    "id"
  >["remove"];
}

export const FocusedRecommendationsCard = ({
  register,
  errors,
  watch,
  setValue,
  focusedRecommendationsFields,
  appendFocusedRecommendation,
  removeFocusedRecommendation,
}: FocusedRecommendationsCardProps) => {
  return (
    <Card
      title="Focused Recommendations"
      buttonText={<ICONS.plus size={16} />}
      onButtonClick={() =>
        appendFocusedRecommendation({
          id: null,
          name: "",
          description: "",
          details: [],
        })
      }
      ariaLabel="Add Focused Recommendation"
      showButton={true}
    >
      <div className="space-y-6">
        {focusedRecommendationsFields.map((field, index) => (
          <div key={field.id} className="p-4 rounded-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <span className="text-sm font-medium text-gray-700 mr-2">
                Option {index + 1}:
              </span>
            </div>
            <div className="mb-4">
              <Input
                label="Name"
                register={register(`focusedRecommendations.${index}.name`)}
                error={errors.focusedRecommendations?.[index]?.name?.message}
              />
            </div>
            <div className="mb-4">
              <Input
                label="Description"
                register={register(
                  `focusedRecommendations.${index}.description`
                )}
                error={
                  errors.focusedRecommendations?.[index]?.description?.message
                }
              />
            </div>
            <div className="mb-4">
              <MultipleTextInputs
                label="Details"
                value={watch(`focusedRecommendations.${index}.details`) || []}
                onChange={(newValue) => {
                  setValue(`focusedRecommendations.${index}.details`, newValue);
                }}
                error={errors.focusedRecommendations?.[index]?.details?.message}
              />
            </div>
            {focusedRecommendationsFields.length > 1 && (
              <div className="flex justify-end">
                <TertiaryButton
                  type="button"
                  onClick={() => removeFocusedRecommendation(index)}
                  className="text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  <ICONS.delete />
                </TertiaryButton>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
