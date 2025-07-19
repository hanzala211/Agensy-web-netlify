import type {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { Card, TextArea } from "@agensy/components";

interface MemoryOrientationJudgmentSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export const MemoryOrientationJudgmentSection = <T extends FieldValues>({
  register,
  errors,
}: MemoryOrientationJudgmentSectionProps<T>) => {
  return (
    <Card title="Memory, Orientation and Judgment">
      <div className="space-y-4">
        {/* Guiding Questions */}
        <p className="text-sm text-gray-700 leading-relaxed">
          If any memory problems exist, how debilitating are they? Consider,
          does care recipient recognize family and friends, the time, location?
          Does s/he make sense most of the time? Has there been any recent
          long-term or short-term memory loss? Would you rate memory problems as
          mild, moderate, or severe? Is there a medical diagnosis and current
          treatment?
        </p>

        {/* Memory Problems Text Area */}
        <div className="space-y-3">
          <TextArea
            register={register("memoryProblems" as Path<T>)}
            error={errors.memoryProblems?.message as string}
            placeholder="Describe memory problems, orientation, judgment, and any cognitive concerns..."
            rows={6}
          />
        </div>
      </div>
    </Card>
  );
};
