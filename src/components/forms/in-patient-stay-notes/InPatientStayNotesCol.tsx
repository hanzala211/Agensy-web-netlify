import {
  Card,
  DatePickerField,
  Input,
  TertiaryButton,
} from "@agensy/components";
import { ICONS } from "@agensy/constants";
import type { InPatientStayNotesFormData } from "@agensy/types";
import type {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import type { Path } from "react-hook-form";

interface InPatientStayNotesProps {
  control: Control<InPatientStayNotesFormData>;
  register: UseFormRegister<InPatientStayNotesFormData>;
  facilityFieldName: Path<InPatientStayNotesFormData>;
  medicalProviderFieldName: Path<InPatientStayNotesFormData>;
  specialtyFieldName: Path<InPatientStayNotesFormData>;
  dateField: Path<InPatientStayNotesFormData>;
  questionsFieldName: string;
  updatesFieldName: string;
  recommendationsFieldName: string;
  appendQuestion: (value: { question: string }) => void;
  questionsFields: FieldArrayWithId<
    InPatientStayNotesFormData,
    "questionsForProvider1" | "questionsForProvider2",
    "id"
  >[];
  removeQuestion: (index: number) => void;
  appendUpdate: (value: { update: string }) => void;
  updatesFields: FieldArrayWithId<
    InPatientStayNotesFormData,
    "updatesFromProvider1" | "updatesFromProvider2",
    "id"
  >[];
  removeUpdate: (index: number) => void;
  appendRecommendation: (value: { recommendation: string }) => void;
  recommendationsFields: FieldArrayWithId<
    InPatientStayNotesFormData,
    "recommendationsNextSteps1" | "recommendationsNextSteps2",
    "id"
  >[];
  removeRecommendation: (index: number) => void;
  errors: FieldErrors<InPatientStayNotesFormData>;
}

export const InPatientStayNotesCol = ({
  control,
  facilityFieldName,
  medicalProviderFieldName,
  specialtyFieldName,
  questionsFieldName,
  updatesFieldName,
  recommendationsFieldName,
  appendQuestion,
  questionsFields,
  register,
  removeQuestion,
  appendUpdate,
  removeUpdate,
  updatesFields,
  appendRecommendation,
  removeRecommendation,
  recommendationsFields,
  errors,
  dateField,
}: InPatientStayNotesProps) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Administrative Information Card */}
      <Card title="Administrative Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePickerField control={control} name={dateField} label="Date" />
          <Input
            label="Facility Name"
            register={register(facilityFieldName)}
            error={errors.facilityName1?.message}
          />
          <Input
            label="Medical Provider"
            register={register(medicalProviderFieldName)}
            error={errors.medicalProvider1?.message}
          />
          <Input
            label="Specialty"
            register={register(specialtyFieldName)}
            error={errors.specialty1?.message}
          />
        </div>
      </Card>

      {/* Questions For Provider Card */}
      <Card
        title="Questions For Provider"
        buttonText={<ICONS.plus size={16} />}
        onButtonClick={() =>
          appendQuestion({
            question: "",
          })
        }
        ariaLabel="Add Question"
        showButton={true}
      >
        <div className="space-y-4">
          {questionsFields.map((field, index) => (
            <div
              key={field.id}
              className="p-3 rounded-lg border border-gray-200"
            >
              <div className="w-full flex gap-4 items-center">
                <div className="w-full">
                  <Input
                    label=""
                    register={register(
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      `${questionsFieldName}.${index}.question` as any
                    )}
                    error={
                      // @ts-expect-error // TODO fix this
                      errors[questionsFieldName]?.[index]?.question?.message
                    }
                    placeholder="Enter your question for provider"
                  />
                </div>
                {questionsFields.length > 1 && (
                  <TertiaryButton
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
                  >
                    <ICONS.delete />
                  </TertiaryButton>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Updates from Provider Card */}
      <Card
        title="Updates from Provider (Medication Changes, Progress Updates)"
        buttonText={<ICONS.plus size={16} />}
        onButtonClick={() =>
          appendUpdate({
            update: "",
          })
        }
        ariaLabel="Add Update"
        showButton={true}
      >
        <div className="space-y-4">
          {updatesFields.map((field, index) => (
            <div
              key={field.id}
              className="p-3 rounded-lg border border-gray-200"
            >
              <div className="w-full flex gap-4 items-center">
                <div className="w-full">
                  <Input
                    label=""
                    // @ts-expect-error // TODO fix this
                    register={register(`${updatesFieldName}.${index}.update`)}
                    // @ts-expect-error // TODO fix this
                    error={errors[updatesFieldName]?.[index]?.update?.message}
                    placeholder="Enter update from provider"
                  />
                </div>
                {updatesFields.length > 1 && (
                  <TertiaryButton
                    type="button"
                    onClick={() => removeUpdate(index)}
                    className="text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
                  >
                    <ICONS.delete />
                  </TertiaryButton>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommendations/Next Steps Card */}
      <Card
        title="Recommendations/Next Steps (Discharge Updates, Services Needed)"
        buttonText={<ICONS.plus size={16} />}
        onButtonClick={() =>
          appendRecommendation({
            recommendation: "",
          })
        }
        ariaLabel="Add Recommendation"
        showButton={true}
      >
        <div className="space-y-4">
          {recommendationsFields.map((field, index) => (
            <div
              key={field.id}
              className="p-3 rounded-lg border border-gray-200"
            >
              <div className="w-full flex gap-4 items-center">
                <div className="w-full">
                  <Input
                    label=""
                    register={register(
                      // @ts-expect-error // TODO fix this
                      `${recommendationsFieldName}.${index}.recommendation`
                    )}
                    error={
                      // @ts-expect-error // TODO fix this
                      errors[recommendationsFieldName]?.[index]?.recommendation
                        ?.message
                    }
                    placeholder="Enter recommendation or next step"
                  />
                </div>
                {recommendationsFields.length > 1 && (
                  <TertiaryButton
                    type="button"
                    onClick={() => removeRecommendation(index)}
                    className="text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
                  >
                    <ICONS.delete />
                  </TertiaryButton>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
