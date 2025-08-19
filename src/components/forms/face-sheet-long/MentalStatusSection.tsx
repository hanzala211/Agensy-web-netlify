import React from "react";
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";
import type { FaceSheetLongFormData } from "@agensy/types";
import {
  Card,
  TextArea,
  DatePickerField,
  Select,
  ScoringInput,
} from "@agensy/components";
import { COGNITIVE_STATUS, TEST_TYPES } from "@agensy/constants";

interface MentalStatusSectionProps {
  register: UseFormRegister<FaceSheetLongFormData>;
  control: Control<FaceSheetLongFormData>;
  errors: FieldErrors<FaceSheetLongFormData>;
}

export const MentalStatusSection: React.FC<MentalStatusSectionProps> = ({
  register,
  control,
  errors,
}) => {
  const mentalStatusValue =
    (useWatch({ control, name: "mentalStatus" }) as string) || "";
  const mentalStatusText =
    (useWatch({ control, name: "mentalStatusText" }) as string) || "";
  return (
    <Card title="Mental Status">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-neutralGray">Cognitive Status</label>
            <Controller
              name="mentalStatus"
              control={control}
              render={({ field }) => {
                const rawValue = mentalStatusValue;
                const otherText = mentalStatusText;
                const validValues = new Set(
                  COGNITIVE_STATUS.map((o) => o.value)
                );
                const tokens = rawValue ? rawValue.split(", ") : [];
                const selected = Array.from(
                  new Set(tokens.map((t) => (validValues.has(t) ? t : "Other")))
                );

                const updateValue = (
                  nextSelections: string[],
                  other: string
                ) => {
                  const composed = nextSelections
                    .map((s) =>
                      s === "Other"
                        ? other?.trim()
                          ? other.trim()
                          : "Other"
                        : s
                    )
                    .join(", ");
                  field.onChange(composed);
                };

                const toggle = (value: string) => {
                  const set = new Set(selected);
                  if (set.has(value)) set.delete(value);
                  else set.add(value);
                  updateValue(Array.from(set), otherText);
                };

                return (
                  <>
                    <div className="flex flex-wrap gap-4">
                      {COGNITIVE_STATUS.map((opt) => (
                        <label
                          key={opt.value}
                          className="inline-flex items-center"
                        >
                          <input
                            type="checkbox"
                            checked={selected.includes(opt.value)}
                            onChange={() => toggle(opt.value)}
                            className="mr-2"
                          />
                          <span className="md:text-[16px] text-[13px]">
                            {opt.label}
                          </span>
                        </label>
                      ))}
                    </div>
                    {selected.includes("Other") && (
                      <input
                        type="text"
                        placeholder="Enter Cognitive Status"
                        {...register("mentalStatusText", {
                          onChange: (e) =>
                            updateValue(selected, e.target.value),
                        })}
                        className={`text-darkGray bg-lightGray placeholder:text-darkGray p-2 border-[1px] border-mediumGray rounded-xl w-full outline-none focus-within:border-basicBlue focus-within:shadow-sm focus-within:shadow-blue-200 transition-all duration-200`}
                      />
                    )}
                  </>
                );
              }}
            />
          </div>
          <DatePickerField
            label="Cognitive Screening Date"
            control={control}
            name="cognitiveScreeningDate"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <ScoringInput
            control={control}
            name="cognitiveScreeningScore"
            label="Cognitive Score"
            placeholder="e.g., 26/30 (from MMSE or SLUMS)"
          />
          <Select
            label="Test Type"
            control={control}
            labelOption="Select Test Type"
            name="test_type"
            data={TEST_TYPES as { label: string; value: string }[]}
          />
        </div>

        <TextArea
          label="Notes / Concerns"
          register={register("notesAndConcerns")}
          error={errors.notesAndConcerns?.message}
          rows={4}
          placeholder="Please specify assessment type (MMSE or SLUMS) and any additional observations..."
        />
      </div>
    </Card>
  );
};
