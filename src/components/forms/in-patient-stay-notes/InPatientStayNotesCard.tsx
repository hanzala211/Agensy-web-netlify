import {
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import type { InPatientStayNotesFormData } from "@agensy/types";
import {
  Card,
  Input,
  DatePickerField,
  TertiaryButton,
} from "@agensy/components";
import { ICONS } from "@agensy/constants";

interface InPatientStayNotesCardProps {
  index: number;
  register: UseFormRegister<InPatientStayNotesFormData>;
  control: Control<InPatientStayNotesFormData>;
  errors: FieldErrors<InPatientStayNotesFormData>;
  onRemove: () => void;
  canRemove: boolean;
}

export const InPatientStayNotesCard = ({
  index,
  register,
  control,
  errors,
  onRemove,
  canRemove,
}: InPatientStayNotesCardProps) => {
  const {
    fields: questionsFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: `inPatientStayNotes.${index}.questionsForProvider`,
  });

  const {
    fields: updatesFields,
    append: appendUpdate,
    remove: removeUpdate,
  } = useFieldArray({
    control,
    name: `inPatientStayNotes.${index}.updatesFromProvider`,
  });

  const {
    fields: recommendationsFields,
    append: appendRecommendation,
    remove: removeRecommendation,
  } = useFieldArray({
    control,
    name: `inPatientStayNotes.${index}.recommendationsNextSteps`,
  });

  return (
    <Card
      title={`In-Patient Stay Notes #${index + 1}`}
      className="mb-6"
      buttonText={canRemove ? <ICONS.delete size={16} /> : undefined}
      onButtonClick={canRemove ? onRemove : undefined}
      ariaLabel={canRemove ? "Remove Entry" : undefined}
      showButton={canRemove}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <DatePickerField
            control={control}
            name={`inPatientStayNotes.${index}.date`}
            label="Date:"
          />
          <Input
            label="Facility Name:"
            register={register(`inPatientStayNotes.${index}.facilityName`)}
            error={
              errors.inPatientStayNotes?.[index]?.facilityName
                ?.message as string
            }
          />
          <Input
            label="Medical Provider:"
            register={register(`inPatientStayNotes.${index}.medicalProvider`)}
            error={
              errors.inPatientStayNotes?.[index]?.medicalProvider
                ?.message as string
            }
          />
          <Input
            label="Specialty:"
            register={register(`inPatientStayNotes.${index}.specialty`)}
            error={
              errors.inPatientStayNotes?.[index]?.specialty?.message as string
            }
          />
        </div>

        {/* Questions for Provider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900">
              Questions for Provider
            </h4>
            <TertiaryButton
              type="button"
              onClick={() => appendQuestion({ question: "" })}
              className="flex items-center gap-2"
            >
              <ICONS.plus size={14} />
              Add Question
            </TertiaryButton>
          </div>
          <div className="space-y-3">
            {questionsFields.length === 0 ? (
              <p className="text-gray-500 text-sm">No questions added yet.</p>
            ) : (
              questionsFields.map((field, questionIndex) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    label=""
                    register={register(
                      `inPatientStayNotes.${index}.questionsForProvider.${questionIndex}.question`
                    )}
                    error={
                      errors.inPatientStayNotes?.[index]
                        ?.questionsForProvider?.[questionIndex]?.question
                        ?.message as string
                    }
                    placeholder="Enter your question..."
                    mainClassname="w-full"
                  />
                  <TertiaryButton
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    className="text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
                  >
                    <ICONS.delete size={14} />
                  </TertiaryButton>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Updates from Provider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900">
              Updates from Provider
            </h4>
            <TertiaryButton
              type="button"
              onClick={() => appendUpdate({ update: "" })}
              className="flex items-center gap-2"
            >
              <ICONS.plus size={14} />
              Add Update
            </TertiaryButton>
          </div>
          <div className="space-y-3">
            {updatesFields.length === 0 ? (
              <p className="text-gray-500 text-sm">No updates added yet.</p>
            ) : (
              updatesFields.map((field, updateIndex) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    label=""
                    register={register(
                      `inPatientStayNotes.${index}.updatesFromProvider.${updateIndex}.update`
                    )}
                    error={
                      errors.inPatientStayNotes?.[index]?.updatesFromProvider?.[
                        updateIndex
                      ]?.update?.message as string
                    }
                    placeholder="Enter update from provider..."
                    mainClassname="w-full"
                  />
                  <TertiaryButton
                    type="button"
                    onClick={() => removeUpdate(updateIndex)}
                    className="text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
                  >
                    <ICONS.delete size={14} />
                  </TertiaryButton>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recommendations/Next Steps */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900">
              Recommendations/Next Steps
            </h4>
            <TertiaryButton
              type="button"
              onClick={() => appendRecommendation({ recommendation: "" })}
              className="flex items-center gap-2"
            >
              <ICONS.plus size={14} />
              Add Recommendation
            </TertiaryButton>
          </div>
          <div className="space-y-3">
            {recommendationsFields.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No recommendations added yet.
              </p>
            ) : (
              recommendationsFields.map((field, recommendationIndex) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    label=""
                    register={register(
                      `inPatientStayNotes.${index}.recommendationsNextSteps.${recommendationIndex}.recommendation`
                    )}
                    error={
                      errors.inPatientStayNotes?.[index]
                        ?.recommendationsNextSteps?.[recommendationIndex]
                        ?.recommendation?.message as string
                    }
                    placeholder="Enter recommendation or next step..."
                    mainClassname="w-full"
                  />
                  <TertiaryButton
                    type="button"
                    onClick={() => removeRecommendation(recommendationIndex)}
                    className="text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
                  >
                    <ICONS.delete size={14} />
                  </TertiaryButton>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
