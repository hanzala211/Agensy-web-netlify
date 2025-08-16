import type {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
  UseFormWatch,
} from "react-hook-form";
import { Input, Card } from "@agensy/components";
import { BURIAL_TYPES } from "@agensy/constants";

interface BurialPreferencesSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  watch: UseFormWatch<T>;
}

export const BurialPreferencesSection = <T extends FieldValues>({
  register,
  errors,
  watch,
}: BurialPreferencesSectionProps<T>) => {
  const burialType = watch("burialType" as Path<T>);
  const plotOwned = watch("plotOwned" as Path<T>);
  const ashesDisposition = watch("ashesDisposition" as Path<T>);

  return (
    <Card title="Burial Preferences">
      <div className="space-y-6">
        {/* Burial Type Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Burial Type Selection
          </label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="traditional-burial"
                value={BURIAL_TYPES.TRADITIONAL_BURIAL}
                {...register("burialType" as Path<T>)}
                className="text-primaryColor focus:ring-primaryColor"
              />
              <label
                htmlFor="traditional-burial"
                className="text-sm text-gray-700"
              >
                Traditional Burial
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="green-burial"
                value={BURIAL_TYPES.GREEN_BURIAL}
                {...register("burialType" as Path<T>)}
                className="text-primaryColor focus:ring-primaryColor"
              />
              <label htmlFor="green-burial" className="text-sm text-gray-700">
                Green/Natural Burial
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="cremation"
                value={BURIAL_TYPES.CREMATION}
                {...register("burialType" as Path<T>)}
                className="text-primaryColor focus:ring-primaryColor"
              />
              <label htmlFor="cremation" className="text-sm text-gray-700">
                Cremation
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="other-burial"
                value={BURIAL_TYPES.OTHER}
                {...register("burialType" as Path<T>)}
                className="text-primaryColor focus:ring-primaryColor"
              />
              <label htmlFor="other-burial" className="text-sm text-gray-700">
                Other:
              </label>
              {burialType === BURIAL_TYPES.OTHER && (
                <Input
                  register={register("burialTypeOther" as Path<T>)}
                  error={errors.burialTypeOther?.message as string}
                />
              )}
            </div>
          </div>
        </div>

        {/* Preferred Cemetery */}
        <div>
          <Input
            label="Preferred Cemetery or Location for Burial/Interment"
            register={register("preferredCemetery" as Path<T>)}
            error={errors.preferredCemetery?.message as string}
          />
        </div>

        {/* Plot Ownership */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Plot Owned
          </label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="plot-yes"
                value="yes"
                {...register("plotOwned" as Path<T>)}
                className="text-primaryColor focus:ring-primaryColor"
              />
              <label htmlFor="plot-yes" className="text-sm text-gray-700">
                Yes
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="plot-no"
                value="no"
                {...register("plotOwned" as Path<T>)}
                className="text-primaryColor focus:ring-primaryColor"
              />
              <label htmlFor="plot-no" className="text-sm text-gray-700">
                No
              </label>
            </div>
          </div>
          {plotOwned === "yes" && (
            <div className="mt-3">
              <Input
                label="If YES, Plot Number/Location"
                register={register("plotNumberLocation" as Path<T>)}
                error={errors.plotNumberLocation?.message as string}
              />
            </div>
          )}
        </div>

        {/* Funeral Home */}
        <div>
          <Input
            label="Funeral Home (if pre-selected)"
            register={register("funeralHome" as Path<T>)}
            error={errors.funeralHome?.message as string}
          />
        </div>

        {/* Vault or Casket Preferences */}
        <div>
          <Input
            label="Vault or Casket Preferences"
            register={register("vaultCasketPreferences" as Path<T>)}
            error={errors.vaultCasketPreferences?.message as string}
          />
        </div>

        {/* Urn Selection - Only show if cremation is selected */}
        {burialType === BURIAL_TYPES.CREMATION && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Urn (if cremated)
            </label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="urn-purchased"
                  value="already-purchased"
                  {...register("urnSelection" as Path<T>)}
                  className="text-primaryColor focus:ring-primaryColor"
                />
                <label
                  htmlFor="urn-purchased"
                  className="text-sm text-gray-700"
                >
                  Already purchased
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="urn-later"
                  value="will-be-chosen-later"
                  {...register("urnSelection" as Path<T>)}
                  className="text-primaryColor focus:ring-primaryColor"
                />
                <label htmlFor="urn-later" className="text-sm text-gray-700">
                  Will be chosen later
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Ashes Disposition - Only show if cremation is selected */}
        {burialType === BURIAL_TYPES.CREMATION && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Ashes to be
            </label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="ashes-buried"
                  value="buried"
                  {...register("ashesDisposition" as Path<T>)}
                  className="text-primaryColor focus:ring-primaryColor"
                />
                <label htmlFor="ashes-buried" className="text-sm text-gray-700">
                  Buried
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="ashes-scattered"
                  value="scattered"
                  {...register("ashesDisposition" as Path<T>)}
                  className="text-primaryColor focus:ring-primaryColor"
                />
                <label
                  htmlFor="ashes-scattered"
                  className="text-sm text-gray-700"
                >
                  Scattered
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="ashes-kept"
                  value="kept-by-family"
                  {...register("ashesDisposition" as Path<T>)}
                  className="text-primaryColor focus:ring-primaryColor"
                />
                <label htmlFor="ashes-kept" className="text-sm text-gray-700">
                  Kept by family
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="ashes-other"
                  value="other"
                  {...register("ashesDisposition" as Path<T>)}
                  className="text-primaryColor focus:ring-primaryColor"
                />
                <label htmlFor="ashes-other" className="text-sm text-gray-700">
                  Other:
                </label>
              </div>
              {ashesDisposition === "other" && (
                <div className="ml-6">
                  <Input
                    register={register("ashesDispositionOther" as Path<T>)}
                    error={errors.ashesDispositionOther?.message as string}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
