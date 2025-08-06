import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { Card, TextArea } from "@agensy/components";
import { type ComprehensiveCarePlanFormData } from "@agensy/types";

interface FunctionalIadlsCardProps {
  register: UseFormRegister<ComprehensiveCarePlanFormData>;
  errors: FieldErrors<ComprehensiveCarePlanFormData>;
}

export const FunctionalIadlsCard = ({
  register,
  errors,
}: FunctionalIadlsCardProps) => {
  return (
    <Card title="Independent Activities of Daily Living (IADL's)">
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>IADL Scale</strong> - measuring eight (8) aspects of living
          that are critical to living independently
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">
            1. Ability to use telephone
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            Can the care recipient use a telephone independently? Does the care
            recipient own a cellphone?
          </p>
          <div className="mb-3">
            <TextArea
              label="Answer and describe:"
              register={register(
                "functionalIadls.detailedTable.telephone.description"
              )}
              error={
                errors.functionalIadls?.detailedTable?.telephone?.description
                  ?.message
              }
              rows={3}
              placeholder="Describe the care recipient's ability to use telephone and cellphone independently"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              IADL Scale Score:
            </span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("functionalIadls.detailedTable.telephone.score")}
                  value="0"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">0</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("functionalIadls.detailedTable.telephone.score")}
                  value="1"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">1</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">2. Shopping</h4>
          <p className="text-sm text-gray-600 mb-3">
            Can the care recipient shop independently, either in-person or
            online such as Amazon, etc.?
          </p>
          <div className="mb-3">
            <TextArea
              label="Answer and describe:"
              register={register(
                "functionalIadls.detailedTable.shopping.description"
              )}
              error={
                errors.functionalIadls?.detailedTable?.shopping?.description
                  ?.message
              }
              rows={3}
              placeholder="Describe the care recipient's ability to shop independently"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              IADL Scale Score:
            </span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("functionalIadls.detailedTable.shopping.score")}
                  value="0"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">0</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("functionalIadls.detailedTable.shopping.score")}
                  value="1"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">1</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">
            3. Food preparation
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            Can the care recipient prepare meals independently?
          </p>
          <div className="mb-3">
            <TextArea
              label="Answer and describe:"
              register={register(
                "functionalIadls.detailedTable.foodPreparation.description"
              )}
              error={
                errors.functionalIadls?.detailedTable?.foodPreparation
                  ?.description?.message
              }
              rows={3}
              placeholder="Describe the care recipient's ability to prepare meals independently"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              IADL Scale Score:
            </span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register(
                    "functionalIadls.detailedTable.foodPreparation.score"
                  )}
                  value="0"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">0</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register(
                    "functionalIadls.detailedTable.foodPreparation.score"
                  )}
                  value="1"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">1</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">4. Housekeeping</h4>
          <p className="text-sm text-gray-600 mb-3">
            Can the care recipient maintain the home independently?
          </p>
          <div className="mb-3">
            <TextArea
              label="Answer and describe:"
              register={register(
                "functionalIadls.detailedTable.housekeeping.description"
              )}
              error={
                errors.functionalIadls?.detailedTable?.housekeeping?.description
                  ?.message
              }
              rows={3}
              placeholder="Describe the care recipient's ability to maintain the home independently"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              IADL Scale Score:
            </span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register(
                    "functionalIadls.detailedTable.housekeeping.score"
                  )}
                  value="0"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">0</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register(
                    "functionalIadls.detailedTable.housekeeping.score"
                  )}
                  value="1"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">1</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">5. Laundry</h4>
          <p className="text-sm text-gray-600 mb-3">
            Can the care recipient do laundry independently?
          </p>
          <div className="mb-3">
            <TextArea
              label="Answer and describe:"
              register={register(
                "functionalIadls.detailedTable.laundry.description"
              )}
              error={
                errors.functionalIadls?.detailedTable?.laundry?.description
                  ?.message
              }
              rows={3}
              placeholder="Describe the care recipient's ability to do laundry independently"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              IADL Scale Score:
            </span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("functionalIadls.detailedTable.laundry.score")}
                  value="0"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">0</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("functionalIadls.detailedTable.laundry.score")}
                  value="1"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">1</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">6. Transportation</h4>
          <p className="text-sm text-gray-600 mb-3">
            Can the care recipient use transportation independently?
          </p>
          <div className="mb-3">
            <TextArea
              label="Answer and describe:"
              register={register(
                "functionalIadls.detailedTable.transportation.description"
              )}
              error={
                errors.functionalIadls?.detailedTable?.transportation
                  ?.description?.message
              }
              rows={3}
              placeholder="Describe the care recipient's ability to use transportation independently"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              IADL Scale Score:
            </span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register(
                    "functionalIadls.detailedTable.transportation.score"
                  )}
                  value="0"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">0</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register(
                    "functionalIadls.detailedTable.transportation.score"
                  )}
                  value="1"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">1</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">7. Medication</h4>
          <p className="text-sm text-gray-600 mb-3">
            Can the care recipient manage medications independently?
          </p>
          <div className="mb-3">
            <TextArea
              label="Answer and describe:"
              register={register(
                "functionalIadls.detailedTable.medication.description"
              )}
              error={
                errors.functionalIadls?.detailedTable?.medication?.description
                  ?.message
              }
              rows={3}
              placeholder="Describe the care recipient's ability to manage medications independently"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              IADL Scale Score:
            </span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register(
                    "functionalIadls.detailedTable.medication.score"
                  )}
                  value="0"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">0</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register(
                    "functionalIadls.detailedTable.medication.score"
                  )}
                  value="1"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">1</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">8. Finances</h4>
          <p className="text-sm text-gray-600 mb-3">
            Can the care recipient manage finances independently?
          </p>
          <div className="mb-3">
            <TextArea
              label="Answer and describe:"
              register={register(
                "functionalIadls.detailedTable.finances.description"
              )}
              error={
                errors.functionalIadls?.detailedTable?.finances?.description
                  ?.message
              }
              rows={3}
              placeholder="Describe the care recipient's ability to manage finances independently"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              IADL Scale Score:
            </span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("functionalIadls.detailedTable.finances.score")}
                  value="0"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">0</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("functionalIadls.detailedTable.finances.score")}
                  value="1"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">1</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <TextArea
          label="Summary"
          register={register("functionalIadls.summary")}
          error={errors.functionalIadls?.summary?.message}
          rows={4}
        />
      </div>

      <div className="mt-6">
        <h4 className="font-medium text-gray-700 mb-4">Additional Data</h4>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-2">
              Identified Problem 1
            </h5>
            <div className="space-y-3">
              <TextArea
                label="Identified Problem"
                register={register(
                  "functionalIadls.additionalData.identifiedProblem1.identifiedProblem"
                )}
                error={
                  errors.functionalIadls?.additionalData?.identifiedProblem1
                    ?.identifiedProblem?.message
                }
                rows={2}
              />
              <TextArea
                label="Intervention Action"
                register={register(
                  "functionalIadls.additionalData.identifiedProblem1.interventionAction"
                )}
                error={
                  errors.functionalIadls?.additionalData?.identifiedProblem1
                    ?.interventionAction?.message
                }
                rows={2}
              />
              <TextArea
                label="Goal"
                register={register(
                  "functionalIadls.additionalData.identifiedProblem1.goal"
                )}
                error={
                  errors.functionalIadls?.additionalData?.identifiedProblem1
                    ?.goal?.message
                }
                rows={2}
              />
              <TextArea
                label="Referral Options"
                register={register(
                  "functionalIadls.additionalData.identifiedProblem1.referralOptions"
                )}
                error={
                  errors.functionalIadls?.additionalData?.identifiedProblem1
                    ?.referralOptions?.message
                }
                rows={2}
              />
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-2">
              Identified Problem 2
            </h5>
            <div className="space-y-3">
              <TextArea
                label="Identified Problem"
                register={register(
                  "functionalIadls.additionalData.identifiedProblem2.identifiedProblem"
                )}
                error={
                  errors.functionalIadls?.additionalData?.identifiedProblem2
                    ?.identifiedProblem?.message
                }
                rows={2}
              />
              <TextArea
                label="Intervention Action"
                register={register(
                  "functionalIadls.additionalData.identifiedProblem2.interventionAction"
                )}
                error={
                  errors.functionalIadls?.additionalData?.identifiedProblem2
                    ?.interventionAction?.message
                }
                rows={2}
              />
              <TextArea
                label="Goal"
                register={register(
                  "functionalIadls.additionalData.identifiedProblem2.goal"
                )}
                error={
                  errors.functionalIadls?.additionalData?.identifiedProblem2
                    ?.goal?.message
                }
                rows={2}
              />
              <TextArea
                label="Referral Options"
                register={register(
                  "functionalIadls.additionalData.identifiedProblem2.referralOptions"
                )}
                error={
                  errors.functionalIadls?.additionalData?.identifiedProblem2
                    ?.referralOptions?.message
                }
                rows={2}
              />
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-2">
              Identified Problem 3
            </h5>
            <div className="space-y-3">
              <TextArea
                label="Identified Problem"
                register={register(
                  "functionalIadls.additionalData.identifiedProblem3.identifiedProblem"
                )}
                error={
                  errors.functionalIadls?.additionalData?.identifiedProblem3
                    ?.identifiedProblem?.message
                }
                rows={2}
              />
              <TextArea
                label="Intervention Action"
                register={register(
                  "functionalIadls.additionalData.identifiedProblem3.interventionAction"
                )}
                error={
                  errors.functionalIadls?.additionalData?.identifiedProblem3
                    ?.interventionAction?.message
                }
                rows={2}
              />
              <TextArea
                label="Goal"
                register={register(
                  "functionalIadls.additionalData.identifiedProblem3.goal"
                )}
                error={
                  errors.functionalIadls?.additionalData?.identifiedProblem3
                    ?.goal?.message
                }
                rows={2}
              />
              <TextArea
                label="Referral Options"
                register={register(
                  "functionalIadls.additionalData.identifiedProblem3.referralOptions"
                )}
                error={
                  errors.functionalIadls?.additionalData?.identifiedProblem3
                    ?.referralOptions?.message
                }
                rows={2}
              />
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-2">
              Identified Problem 4
            </h5>
            <div className="space-y-3">
              <TextArea
                label="Identified Problem"
                register={register(
                  "functionalIadls.additionalData.identifiedProblem4.identifiedProblem"
                )}
                error={
                  errors.functionalIadls?.additionalData?.identifiedProblem4
                    ?.identifiedProblem?.message
                }
                rows={2}
              />
              <TextArea
                label="Intervention Action"
                register={register(
                  "functionalIadls.additionalData.identifiedProblem4.interventionAction"
                )}
                error={
                  errors.functionalIadls?.additionalData?.identifiedProblem4
                    ?.interventionAction?.message
                }
                rows={2}
              />
              <TextArea
                label="Goal"
                register={register(
                  "functionalIadls.additionalData.identifiedProblem4.goal"
                )}
                error={
                  errors.functionalIadls?.additionalData?.identifiedProblem4
                    ?.goal?.message
                }
                rows={2}
              />
              <TextArea
                label="Referral Options"
                register={register(
                  "functionalIadls.additionalData.identifiedProblem4.referralOptions"
                )}
                error={
                  errors.functionalIadls?.additionalData?.identifiedProblem4
                    ?.referralOptions?.message
                }
                rows={2}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
