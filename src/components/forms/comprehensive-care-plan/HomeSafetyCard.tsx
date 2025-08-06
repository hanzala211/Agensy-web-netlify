import { Card, TextArea } from "@agensy/components";
import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { type ComprehensiveCarePlanFormData } from "@agensy/types";

interface HomeSafetyCardProps {
  register: UseFormRegister<ComprehensiveCarePlanFormData>;
  errors: FieldErrors<ComprehensiveCarePlanFormData>;
}

export const HomeSafetyCard = ({ register, errors }: HomeSafetyCardProps) => {
  return (
    <Card title="II. Home Safety">
      <div className="mb-4">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-medium text-gray-700">
            Were deficits noted or recommendations warranted?
          </span>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                {...register("homeSafety.deficitsNoted")}
                value="true"
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                {...register("homeSafety.deficitsNoted")}
                value="false"
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">No</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-medium text-gray-700 mb-4">
          Home Environment Safety Checklist:
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">Are pathways clear?</span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.arePathwaysClear")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">Are there throw rugs?</span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.areThereThrowRugs")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">
              Are stairs safe (carpets, railings, etc)?
            </span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.areStairsSafe")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">
              Is there notable clutter or evidence of hoarding?
            </span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.isThereClutterOrHoarding")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">
              Is there an accessible fire escape route?
            </span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.isThereFireEscapeRoute")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">Are floors slippery?</span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.areFloorsSlippery")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">
              What is the condition of floor surfaces?
            </span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.conditionOfFloorSurfaces")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">
              What is the condition of carpeting?
            </span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.conditionOfCarpeting")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">
              Are chairs sturdy and stable?
            </span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.areChairsSturdyAndStable")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">
              Electricity fully functional?
            </span>
            <input
              type="checkbox"
              {...register(
                "homeSafety.detailedTable.electricityFullyFunctional"
              )}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">Adequate lighting?</span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.adequateLighting")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">
              Exposed wires or cords?
            </span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.exposedWiresOrCords")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">
              Condition of wires and plugs?
            </span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.conditionOfWiresAndPlugs")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">
              Smoke detectors present?
            </span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.smokeDetectorsPresent")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">
              Are there space heaters?
            </span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.areThereSpaceHeaters")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">
              Care recipient smokes?
            </span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.careRecipientSmokes")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">
              Fire extinguisher accessible?
            </span>
            <input
              type="checkbox"
              {...register(
                "homeSafety.detailedTable.fireExtinguisherAccessible"
              )}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">
              Condition of appliances?
            </span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.conditionOfAppliances")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">
              Kitchen safety hazards?
            </span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.kitchenSafetyHazards")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">
              Locks on doors and windows?
            </span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.locksOnDoorsAndWindows")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">
              Emergency numbers posted?
            </span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.emergencyNumbersPosted")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">
              Accessible telephones?
            </span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.accessibleTelephones")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">
              Weapons or firearms present?
            </span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.weaponsOrFirearmsPresent")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">Pets present?</span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.petsPresent")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">
              Unsanitary conditions present?
            </span>
            <input
              type="checkbox"
              {...register(
                "homeSafety.detailedTable.unsanitaryConditionsPresent"
              )}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">
              Medications safely stored?
            </span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.medicationsSafelyStored")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">
              Adequate air conditioning or heat?
            </span>
            <input
              type="checkbox"
              {...register(
                "homeSafety.detailedTable.adequateAirConditioningOrHeat"
              )}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">
              Condition of tub or shower?
            </span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.conditionOfTubOrShower")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">Condition of bed?</span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.conditionOfBed")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">Other?</span>
            <input
              type="checkbox"
              {...register("homeSafety.detailedTable.other")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <TextArea
          label="Summary"
          register={register("homeSafety.summary")}
          error={errors.homeSafety?.summary?.message}
          rows={4}
        />
      </div>
    </Card>
  );
};
