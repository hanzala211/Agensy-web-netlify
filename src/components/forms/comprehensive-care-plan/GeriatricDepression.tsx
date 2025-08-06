import { Card, TextArea } from "@agensy/components";
import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { type ComprehensiveCarePlanFormData } from "@agensy/types";

interface GeriatricDepressionProps {
  register: UseFormRegister<ComprehensiveCarePlanFormData>;
  errors: FieldErrors<ComprehensiveCarePlanFormData>;
}

export const GeriatricDepression = ({
  register,
  errors,
}: GeriatricDepressionProps) => {
  return (
    <Card title="IV. Geriatric Depression">
      <div className="mb-4">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-medium text-gray-700">
            Were deficits noted or recommendations warranted?
          </span>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                {...register("geriatricDepression.deficitsNoted")}
                value="true"
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                {...register("geriatricDepression.deficitsNoted")}
                value="false"
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">No</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <TextArea
          label="Summary"
          register={register("geriatricDepression.summary")}
          error={errors.geriatricDepression?.summary?.message}
          rows={6}
          placeholder="Summarize any evidence of depression gleaned from care recipients self-report, collateral report, or direct observation. How often and to what degree does the care recipient express or demonstrate feeling sad, unmotivated, discouraged, or hopeless? Does the care recipient have opportunities to engage in activities relevant to their interests and intellect? Have others expressed any concerns for the care recipient's emotional wellbeing? If evidence of depression is noted, please indicate any suspected or suggested causes or contributing factors."
        />
      </div>

      <div className="mt-6">
        <h4 className="font-medium text-gray-700 mb-4">Identified Problems:</h4>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-3">Problem 1</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <TextArea
                  label="Identified Problem"
                  register={register(
                    "geriatricDepression.detailedTable.identifiedProblem1.identifiedProblem"
                  )}
                  error={
                    errors.geriatricDepression?.detailedTable
                      ?.identifiedProblem1?.identifiedProblem?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Intervention / Action"
                  register={register(
                    "geriatricDepression.detailedTable.identifiedProblem1.interventionAction"
                  )}
                  error={
                    errors.geriatricDepression?.detailedTable
                      ?.identifiedProblem1?.interventionAction?.message
                  }
                  rows={3}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <TextArea
                  label="Goal"
                  register={register(
                    "geriatricDepression.detailedTable.identifiedProblem1.goal"
                  )}
                  error={
                    errors.geriatricDepression?.detailedTable
                      ?.identifiedProblem1?.goal?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Referral Options"
                  register={register(
                    "geriatricDepression.detailedTable.identifiedProblem1.referralOptions"
                  )}
                  error={
                    errors.geriatricDepression?.detailedTable
                      ?.identifiedProblem1?.referralOptions?.message
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-3">Problem 2</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <TextArea
                  label="Identified Problem"
                  register={register(
                    "geriatricDepression.detailedTable.identifiedProblem2.identifiedProblem"
                  )}
                  error={
                    errors.geriatricDepression?.detailedTable
                      ?.identifiedProblem2?.identifiedProblem?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Intervention / Action"
                  register={register(
                    "geriatricDepression.detailedTable.identifiedProblem2.interventionAction"
                  )}
                  error={
                    errors.geriatricDepression?.detailedTable
                      ?.identifiedProblem2?.interventionAction?.message
                  }
                  rows={3}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <TextArea
                  label="Goal"
                  register={register(
                    "geriatricDepression.detailedTable.identifiedProblem2.goal"
                  )}
                  error={
                    errors.geriatricDepression?.detailedTable
                      ?.identifiedProblem2?.goal?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Referral Options"
                  register={register(
                    "geriatricDepression.detailedTable.identifiedProblem2.referralOptions"
                  )}
                  error={
                    errors.geriatricDepression?.detailedTable
                      ?.identifiedProblem2?.referralOptions?.message
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-3">Problem 3</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <TextArea
                  label="Identified Problem"
                  register={register(
                    "geriatricDepression.detailedTable.identifiedProblem3.identifiedProblem"
                  )}
                  error={
                    errors.geriatricDepression?.detailedTable
                      ?.identifiedProblem3?.identifiedProblem?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Intervention / Action"
                  register={register(
                    "geriatricDepression.detailedTable.identifiedProblem3.interventionAction"
                  )}
                  error={
                    errors.geriatricDepression?.detailedTable
                      ?.identifiedProblem3?.interventionAction?.message
                  }
                  rows={3}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <TextArea
                  label="Goal"
                  register={register(
                    "geriatricDepression.detailedTable.identifiedProblem3.goal"
                  )}
                  error={
                    errors.geriatricDepression?.detailedTable
                      ?.identifiedProblem3?.goal?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Referral Options"
                  register={register(
                    "geriatricDepression.detailedTable.identifiedProblem3.referralOptions"
                  )}
                  error={
                    errors.geriatricDepression?.detailedTable
                      ?.identifiedProblem3?.referralOptions?.message
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-3">Problem 4</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <TextArea
                  label="Identified Problem"
                  register={register(
                    "geriatricDepression.detailedTable.identifiedProblem4.identifiedProblem"
                  )}
                  error={
                    errors.geriatricDepression?.detailedTable
                      ?.identifiedProblem4?.identifiedProblem?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Intervention / Action"
                  register={register(
                    "geriatricDepression.detailedTable.identifiedProblem4.interventionAction"
                  )}
                  error={
                    errors.geriatricDepression?.detailedTable
                      ?.identifiedProblem4?.interventionAction?.message
                  }
                  rows={3}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <TextArea
                  label="Goal"
                  register={register(
                    "geriatricDepression.detailedTable.identifiedProblem4.goal"
                  )}
                  error={
                    errors.geriatricDepression?.detailedTable
                      ?.identifiedProblem4?.goal?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Referral Options"
                  register={register(
                    "geriatricDepression.detailedTable.identifiedProblem4.referralOptions"
                  )}
                  error={
                    errors.geriatricDepression?.detailedTable
                      ?.identifiedProblem4?.referralOptions?.message
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-3">Problem 5</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <TextArea
                  label="Identified Problem"
                  register={register(
                    "geriatricDepression.detailedTable.identifiedProblem5.identifiedProblem"
                  )}
                  error={
                    errors.geriatricDepression?.detailedTable
                      ?.identifiedProblem5?.identifiedProblem?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Intervention / Action"
                  register={register(
                    "geriatricDepression.detailedTable.identifiedProblem5.interventionAction"
                  )}
                  error={
                    errors.geriatricDepression?.detailedTable
                      ?.identifiedProblem5?.interventionAction?.message
                  }
                  rows={3}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <TextArea
                  label="Goal"
                  register={register(
                    "geriatricDepression.detailedTable.identifiedProblem5.goal"
                  )}
                  error={
                    errors.geriatricDepression?.detailedTable
                      ?.identifiedProblem5?.goal?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Referral Options"
                  register={register(
                    "geriatricDepression.detailedTable.identifiedProblem5.referralOptions"
                  )}
                  error={
                    errors.geriatricDepression?.detailedTable
                      ?.identifiedProblem5?.referralOptions?.message
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
