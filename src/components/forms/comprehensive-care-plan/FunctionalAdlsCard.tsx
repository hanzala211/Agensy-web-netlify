import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { Card, TextArea } from "@agensy/components";
import { type ComprehensiveCarePlanFormData } from "@agensy/types";

interface FunctionalAdlsCardProps {
  register: UseFormRegister<ComprehensiveCarePlanFormData>;
  errors: FieldErrors<ComprehensiveCarePlanFormData>;
}

export const FunctionalAdlsCard = ({
  register,
  errors,
}: FunctionalAdlsCardProps) => {
  return (
    <Card title="I. Functional - Activities of Daily Living (ADLs)">
      <div className="mb-4">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-medium text-gray-700">
            Were deficits noted or recommendations warranted?
          </span>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                {...register("functionalAdls.deficitsNoted")}
                value="true"
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                {...register("functionalAdls.deficitsNoted")}
                value="false"
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">No</span>
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">1. Bathing</h4>
          <div className="mb-3">
            <TextArea
              label="Description"
              register={register(
                "functionalAdls.detailedTable.bathing.description"
              )}
              error={
                errors.functionalAdls?.detailedTable?.bathing?.description
                  ?.message
              }
              rows={3}
              placeholder="Describe the extent to which the care recipient requires assistance with bathing themselves, and any specific needs related to the activity of bathing such as special shampoos, etc."
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              Katz Index Score:
            </span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("functionalAdls.detailedTable.bathing.score")}
                  value="0"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">0</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("functionalAdls.detailedTable.bathing.score")}
                  value="1"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">1</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">2. Dressing</h4>
          <div className="mb-3">
            <TextArea
              label="Description"
              register={register(
                "functionalAdls.detailedTable.dressing.description"
              )}
              error={
                errors.functionalAdls?.detailedTable?.dressing?.description
                  ?.message
              }
              rows={3}
              placeholder="Describe the extent to which the care recipient requires assistance with dressing themselves, identifying whether clothing is clean, etc."
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              Katz Index Score:
            </span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("functionalAdls.detailedTable.dressing.score")}
                  value="0"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">0</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("functionalAdls.detailedTable.dressing.score")}
                  value="1"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">1</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">3. Toileting</h4>
          <div className="mb-3">
            <TextArea
              label="Description"
              register={register(
                "functionalAdls.detailedTable.toileting.description"
              )}
              error={
                errors.functionalAdls?.detailedTable?.toileting?.description
                  ?.message
              }
              rows={3}
              placeholder="Describe the extent to which the care recipient requires assistance with toileting, including getting to and from the toilet, cleaning themselves, and managing clothing."
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              Katz Index Score:
            </span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("functionalAdls.detailedTable.toileting.score")}
                  value="0"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">0</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("functionalAdls.detailedTable.toileting.score")}
                  value="1"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">1</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">4. Transfers</h4>
          <div className="mb-3">
            <TextArea
              label="Description"
              register={register(
                "functionalAdls.detailedTable.transfers.description"
              )}
              error={
                errors.functionalAdls?.detailedTable?.transfers?.description
                  ?.message
              }
              rows={3}
              placeholder="Describe the extent to which the care recipient requires assistance with moving from bed to chair, chair to chair, etc."
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              Katz Index Score:
            </span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("functionalAdls.detailedTable.transfers.score")}
                  value="0"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">0</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("functionalAdls.detailedTable.transfers.score")}
                  value="1"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">1</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">5. Continence</h4>
          <div className="mb-3">
            <TextArea
              label="Description"
              register={register(
                "functionalAdls.detailedTable.continence.description"
              )}
              error={
                errors.functionalAdls?.detailedTable?.continence?.description
                  ?.message
              }
              rows={3}
              placeholder="Describe the extent to which the care recipient has control over bladder and bowel function."
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              Katz Index Score:
            </span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("functionalAdls.detailedTable.continence.score")}
                  value="0"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">0</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("functionalAdls.detailedTable.continence.score")}
                  value="1"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">1</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">6. Feeding</h4>
          <div className="mb-3">
            <TextArea
              label="Description"
              register={register(
                "functionalAdls.detailedTable.feeding.description"
              )}
              error={
                errors.functionalAdls?.detailedTable?.feeding?.description
                  ?.message
              }
              rows={3}
              placeholder="Describe the extent to which the care recipient requires any assistance with feeding."
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              Katz Index Score:
            </span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("functionalAdls.detailedTable.feeding.score")}
                  value="0"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">0</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("functionalAdls.detailedTable.feeding.score")}
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
          register={register("functionalAdls.summary")}
          error={errors.functionalAdls?.summary?.message}
          rows={4}
        />
      </div>

      <div className="mt-4 p-3 bg-blue-100 rounded border-l-4 border-blue-500 text-sm text-gray-700">
        <p className="font-medium mb-2">Definition of Independence:</p>
        <p>
          Independence means without supervision, direction, or active personal
          assistance, except as specially noted below. This is based on actual
          status and not ability. A patient who refuses to perform a function is
          considered as not performing the function, even though he or she is
          deemed able.
        </p>
        <p className="mt-2 text-xs italic">
          Source: Katz- Progress in the Development of the Index ADL (tool)
        </p>
      </div>
    </Card>
  );
};
