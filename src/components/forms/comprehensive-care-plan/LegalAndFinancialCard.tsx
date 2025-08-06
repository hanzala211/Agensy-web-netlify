import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { type ComprehensiveCarePlanFormData } from "@agensy/types";
import { Card, TextArea } from "@agensy/components";

interface LegalAndFinancialCardProps {
  register: UseFormRegister<ComprehensiveCarePlanFormData>;
  errors: FieldErrors<ComprehensiveCarePlanFormData>;
}

export const LegalAndFinancialCard = ({
  register,
  errors,
}: LegalAndFinancialCardProps) => {
  return (
    <Card title="VI. Legal and Financial">
      <div className="mb-4">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-medium text-gray-700">
            Were deficits noted or recommendations warranted?
          </span>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                {...register("legalAndFinancial.deficitsNoted")}
                value="true"
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                {...register("legalAndFinancial.deficitsNoted")}
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
          register={register("legalAndFinancial.summary")}
          error={errors.legalAndFinancial?.summary?.message}
          rows={6}
          placeholder="Summarize the care recipient's general legal and financial status in a narrative format. Is all legal and financial documentation up to date and appropriate? Do the care recipient or their family have any concerns for the cost of care or other services? Does the care recipient have a designated power of attorney and/or a living will?"
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
                    "legalAndFinancial.detailedTable.identifiedProblem1.identifiedProblem"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem1
                      ?.identifiedProblem?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Intervention / Action"
                  register={register(
                    "legalAndFinancial.detailedTable.identifiedProblem1.interventionAction"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem1
                      ?.interventionAction?.message
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
                    "legalAndFinancial.detailedTable.identifiedProblem1.goal"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem1
                      ?.goal?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Referral Options"
                  register={register(
                    "legalAndFinancial.detailedTable.identifiedProblem1.referralOptions"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem1
                      ?.referralOptions?.message
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
                    "legalAndFinancial.detailedTable.identifiedProblem2.identifiedProblem"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem2
                      ?.identifiedProblem?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Intervention / Action"
                  register={register(
                    "legalAndFinancial.detailedTable.identifiedProblem2.interventionAction"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem2
                      ?.interventionAction?.message
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
                    "legalAndFinancial.detailedTable.identifiedProblem2.goal"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem2
                      ?.goal?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Referral Options"
                  register={register(
                    "legalAndFinancial.detailedTable.identifiedProblem2.referralOptions"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem2
                      ?.referralOptions?.message
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
                    "legalAndFinancial.detailedTable.identifiedProblem3.identifiedProblem"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem3
                      ?.identifiedProblem?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Intervention / Action"
                  register={register(
                    "legalAndFinancial.detailedTable.identifiedProblem3.interventionAction"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem3
                      ?.interventionAction?.message
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
                    "legalAndFinancial.detailedTable.identifiedProblem3.goal"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem3
                      ?.goal?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Referral Options"
                  register={register(
                    "legalAndFinancial.detailedTable.identifiedProblem3.referralOptions"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem3
                      ?.referralOptions?.message
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
                    "legalAndFinancial.detailedTable.identifiedProblem4.identifiedProblem"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem4
                      ?.identifiedProblem?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Intervention / Action"
                  register={register(
                    "legalAndFinancial.detailedTable.identifiedProblem4.interventionAction"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem4
                      ?.interventionAction?.message
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
                    "legalAndFinancial.detailedTable.identifiedProblem4.goal"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem4
                      ?.goal?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Referral Options"
                  register={register(
                    "legalAndFinancial.detailedTable.identifiedProblem4.referralOptions"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem4
                      ?.referralOptions?.message
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
                    "legalAndFinancial.detailedTable.identifiedProblem5.identifiedProblem"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem5
                      ?.identifiedProblem?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Intervention / Action"
                  register={register(
                    "legalAndFinancial.detailedTable.identifiedProblem5.interventionAction"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem5
                      ?.interventionAction?.message
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
                    "legalAndFinancial.detailedTable.identifiedProblem5.goal"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem5
                      ?.goal?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Referral Options"
                  register={register(
                    "legalAndFinancial.detailedTable.identifiedProblem5.referralOptions"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem5
                      ?.referralOptions?.message
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-3">Problem 6</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <TextArea
                  label="Identified Problem"
                  register={register(
                    "legalAndFinancial.detailedTable.identifiedProblem6.identifiedProblem"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem6
                      ?.identifiedProblem?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Intervention / Action"
                  register={register(
                    "legalAndFinancial.detailedTable.identifiedProblem6.interventionAction"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem6
                      ?.interventionAction?.message
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
                    "legalAndFinancial.detailedTable.identifiedProblem6.goal"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem6
                      ?.goal?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Referral Options"
                  register={register(
                    "legalAndFinancial.detailedTable.identifiedProblem6.referralOptions"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem6
                      ?.referralOptions?.message
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-3">Problem 7</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <TextArea
                  label="Identified Problem"
                  register={register(
                    "legalAndFinancial.detailedTable.identifiedProblem7.identifiedProblem"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem7
                      ?.identifiedProblem?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Intervention / Action"
                  register={register(
                    "legalAndFinancial.detailedTable.identifiedProblem7.interventionAction"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem7
                      ?.interventionAction?.message
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
                    "legalAndFinancial.detailedTable.identifiedProblem7.goal"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem7
                      ?.goal?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Referral Options"
                  register={register(
                    "legalAndFinancial.detailedTable.identifiedProblem7.referralOptions"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem7
                      ?.referralOptions?.message
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-3">Problem 8</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <TextArea
                  label="Identified Problem"
                  register={register(
                    "legalAndFinancial.detailedTable.identifiedProblem8.identifiedProblem"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem8
                      ?.identifiedProblem?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Intervention / Action"
                  register={register(
                    "legalAndFinancial.detailedTable.identifiedProblem8.interventionAction"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem8
                      ?.interventionAction?.message
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
                    "legalAndFinancial.detailedTable.identifiedProblem8.goal"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem8
                      ?.goal?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Referral Options"
                  register={register(
                    "legalAndFinancial.detailedTable.identifiedProblem8.referralOptions"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem8
                      ?.referralOptions?.message
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-3">Problem 9</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <TextArea
                  label="Identified Problem"
                  register={register(
                    "legalAndFinancial.detailedTable.identifiedProblem9.identifiedProblem"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem9
                      ?.identifiedProblem?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Intervention / Action"
                  register={register(
                    "legalAndFinancial.detailedTable.identifiedProblem9.interventionAction"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem9
                      ?.interventionAction?.message
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
                    "legalAndFinancial.detailedTable.identifiedProblem9.goal"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem9
                      ?.goal?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Referral Options"
                  register={register(
                    "legalAndFinancial.detailedTable.identifiedProblem9.referralOptions"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem9
                      ?.referralOptions?.message
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-3">Problem 10</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <TextArea
                  label="Identified Problem"
                  register={register(
                    "legalAndFinancial.detailedTable.identifiedProblem10.identifiedProblem"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem10
                      ?.identifiedProblem?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Intervention / Action"
                  register={register(
                    "legalAndFinancial.detailedTable.identifiedProblem10.interventionAction"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem10
                      ?.interventionAction?.message
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
                    "legalAndFinancial.detailedTable.identifiedProblem10.goal"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem10
                      ?.goal?.message
                  }
                  rows={3}
                />
              </div>
              <div>
                <TextArea
                  label="Referral Options"
                  register={register(
                    "legalAndFinancial.detailedTable.identifiedProblem10.referralOptions"
                  )}
                  error={
                    errors.legalAndFinancial?.detailedTable?.identifiedProblem10
                      ?.referralOptions?.message
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
