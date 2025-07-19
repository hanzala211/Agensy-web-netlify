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

interface ProblemsRisksSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  errors: FieldErrors<T>;
}

const problemsRisksOptions = [
  "Suicide",
  "Drinking",
  "Sleeping",
  "Wandering",
  "Setting Fire",
  "Memory Issues",
  "Isolation",
  "Medication Compliance",
  "Personal Hygiene",
  "Falls/Fall Risk",
  "Mental Health",
  "Other",
];

export const ProblemsRisksSection = <T extends FieldValues>({
  register,
  control,
  setValue,
  errors,
}: ProblemsRisksSectionProps<T>) => {
  const problemsRisks =
    useWatch({
      control,
      name: "problemsRisks" as Path<T>,
    }) || [];

  return (
    <Card title="Which of the following are problems/risks? Please check">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-3">
            {problemsRisksOptions.slice(0, 3).map((problem) => (
              <div key={problem} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={problem}
                  onChange={(e) => {
                    const currentValues = problemsRisks as string[];
                    if (e.target.checked) {
                      if (!currentValues.includes(problem)) {
                        setValue(
                          "problemsRisks" as Path<T>,
                          [...currentValues, problem] as PathValueImpl<
                            T,
                            Path<T>
                          >
                        );
                      }
                    } else {
                      setValue(
                        "problemsRisks" as Path<T>,
                        currentValues.filter(
                          (val: string) => val !== problem
                        ) as PathValueImpl<T, Path<T>>
                      );
                    }
                  }}
                  checked={(problemsRisks as string[]).includes(problem)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={problem} className="text-sm text-gray-700">
                  {problem}
                </label>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {problemsRisksOptions.slice(3, 6).map((problem) => (
              <div key={problem} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={problem}
                  onChange={(e) => {
                    const currentValues = problemsRisks as string[];
                    if (e.target.checked) {
                      if (!currentValues.includes(problem)) {
                        setValue(
                          "problemsRisks" as Path<T>,
                          [...currentValues, problem] as PathValueImpl<
                            T,
                            Path<T>
                          >
                        );
                      }
                    } else {
                      setValue(
                        "problemsRisks" as Path<T>,
                        currentValues.filter(
                          (val: string) => val !== problem
                        ) as PathValueImpl<T, Path<T>>
                      );
                    }
                  }}
                  checked={(problemsRisks as string[]).includes(problem)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={problem} className="text-sm text-gray-700">
                  {problem}
                </label>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {problemsRisksOptions.slice(6, 9).map((problem) => (
              <div key={problem} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={problem}
                  onChange={(e) => {
                    const currentValues = problemsRisks as string[];
                    if (e.target.checked) {
                      if (!currentValues.includes(problem)) {
                        setValue(
                          "problemsRisks" as Path<T>,
                          [...currentValues, problem] as PathValueImpl<
                            T,
                            Path<T>
                          >
                        );
                      }
                    } else {
                      setValue(
                        "problemsRisks" as Path<T>,
                        currentValues.filter(
                          (val: string) => val !== problem
                        ) as PathValueImpl<T, Path<T>>
                      );
                    }
                  }}
                  checked={(problemsRisks as string[]).includes(problem)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={problem} className="text-sm text-gray-700">
                  {problem}
                </label>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {problemsRisksOptions.slice(9).map((problem) => (
              <div key={problem} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={problem}
                  onChange={(e) => {
                    const currentValues = problemsRisks as string[];
                    if (e.target.checked) {
                      if (!currentValues.includes(problem)) {
                        setValue(
                          "problemsRisks" as Path<T>,
                          [...currentValues, problem] as PathValueImpl<
                            T,
                            Path<T>
                          >
                        );
                      }
                    } else {
                      setValue(
                        "problemsRisks" as Path<T>,
                        currentValues.filter(
                          (val: string) => val !== problem
                        ) as PathValueImpl<T, Path<T>>
                      );
                    }
                  }}
                  checked={(problemsRisks as string[]).includes(problem)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={problem} className="text-sm text-gray-700">
                  {problem}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Who buys groceries, prepares meals? State if there are any
            nutritional concerns?
          </label>
          <TextArea
            register={register("nutritionConcerns" as Path<T>)}
            error={errors.nutritionConcerns?.message as string}
            placeholder="Describe grocery shopping, meal preparation, and nutritional concerns..."
            rows={3}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Summarize present capacity for self-care:
          </label>
          <TextArea
            register={register("selfCareCapacitySummary" as Path<T>)}
            error={errors.selfCareCapacitySummary?.message as string}
            placeholder="Summarize the care recipient's current self-care capacity..."
            rows={3}
          />
        </div>
      </div>
    </Card>
  );
};
