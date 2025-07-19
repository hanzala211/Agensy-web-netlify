import type {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
  Control,
  UseFormSetValue,
  PathValue as PathValueImpl,
} from "react-hook-form";
import { useWatch } from "react-hook-form";
import { Card, TextArea } from "@agensy/components";

interface ProblemAreasSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  errors: FieldErrors<T>;
}

const problemAreas = [
  "Driving",
  "Using other transportation",
  "Using telephone",
  "Preparing light meal",
  "Cleaning/laundry",
  "Eating",
  "Bathing",
  "Dressing",
  "Managing money",
  "Taking medications",
  "House maintenance",
  "Grocery shopping",
  "Decision making",
  "Toileting",
  "Transfer",
  "Walking",
  "Other",
];

export const ProblemAreasSection = <T extends FieldValues>({
  register,
  control,
  setValue,
  errors,
}: ProblemAreasSectionProps<T>) => {
  const problemAreasDailyLiving = useWatch({
    control,
    name: "problemAreasDailyLiving" as Path<T>,
  }) || [];

  return (
    <Card title="Check problem areas in daily living">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-3">
            {problemAreas.slice(0, 5).map((area) => (
              <div key={area} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={area}
                  onChange={(e) => {
                    const currentValues = problemAreasDailyLiving as string[];
                    if (e.target.checked) {
                      if (!currentValues.includes(area)) {
                        setValue(
                          "problemAreasDailyLiving" as Path<T>,
                          [...currentValues, area] as PathValueImpl<T, Path<T>>
                        );
                      }
                    } else {
                      setValue(
                        "problemAreasDailyLiving" as Path<T>,
                        currentValues.filter((val: string) => val !== area) as PathValueImpl<T, Path<T>>
                      );
                    }
                  }}
                  checked={(problemAreasDailyLiving as string[]).includes(area)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={area} className="text-sm text-gray-700">
                  {area}
                </label>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {problemAreas.slice(5, 10).map((area) => (
              <div key={area} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={area}
                  onChange={(e) => {
                    const currentValues = problemAreasDailyLiving as string[];
                    if (e.target.checked) {
                      if (!currentValues.includes(area)) {
                        setValue(
                          "problemAreasDailyLiving" as Path<T>,
                          [...currentValues, area] as PathValueImpl<T, Path<T>>
                        );
                      }
                    } else {
                      setValue(
                        "problemAreasDailyLiving" as Path<T>,
                        currentValues.filter((val: string) => val !== area) as PathValueImpl<T, Path<T>>
                      );
                    }
                  }}
                  checked={(problemAreasDailyLiving as string[]).includes(area)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={area} className="text-sm text-gray-700">
                  {area}
                </label>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {problemAreas.slice(10, 15).map((area) => (
              <div key={area} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={area}
                  onChange={(e) => {
                    const currentValues = problemAreasDailyLiving as string[];
                    if (e.target.checked) {
                      if (!currentValues.includes(area)) {
                        setValue(
                          "problemAreasDailyLiving" as Path<T>,
                          [...currentValues, area] as PathValueImpl<T, Path<T>>
                        );
                      }
                    } else {
                      setValue(
                        "problemAreasDailyLiving" as Path<T>,
                        currentValues.filter((val: string) => val !== area) as PathValueImpl<T, Path<T>>
                      );
                    }
                  }}
                  checked={(problemAreasDailyLiving as string[]).includes(area)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={area} className="text-sm text-gray-700">
                  {area}
                </label>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {problemAreas.slice(15).map((area) => (
              <div key={area} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={area}
                  onChange={(e) => {
                    const currentValues = problemAreasDailyLiving as string[];
                    if (e.target.checked) {
                      if (!currentValues.includes(area)) {
                        setValue(
                          "problemAreasDailyLiving" as Path<T>,
                          [...currentValues, area] as PathValueImpl<T, Path<T>>
                        );
                      }
                    } else {
                      setValue(
                        "problemAreasDailyLiving" as Path<T>,
                        currentValues.filter((val: string) => val !== area) as PathValueImpl<T, Path<T>>
                      );
                    }
                  }}
                  checked={(problemAreasDailyLiving as string[]).includes(area)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={area} className="text-sm text-gray-700">
                  {area}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Please explain:
          </label>
          <TextArea
            register={register("problemAreasExplanation" as Path<T>)}
            error={errors.problemAreasExplanation?.message as string}
            placeholder="Explain the problem areas and any additional details..."
            rows={4}
          />
        </div>
      </div>
    </Card>
  );
};
