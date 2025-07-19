import type {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { Card, TextArea } from "@agensy/components";

interface SummarySectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export const SummarySection = <T extends FieldValues>({
  register,
  errors,
}: SummarySectionProps<T>) => {
  return (
    <Card title="Summary">
      <div className="space-y-6">
        {/* First Text Area */}
        <div>
          <TextArea
            label="Now that you have had time to outline this information, please share what your major concerns are and what type of assistance you seek."
            register={register("majorConcernsAndAssistance" as Path<T>)}
            error={errors.majorConcernsAndAssistance?.message as string}
            rows={6}
          />
        </div>

        {/* Second Text Area */}
        <div>
          <TextArea
            label="In your opinion, in what areas of life would care recipient be accepting of help (i.e. help with personal chores, companionship, memory, personal problems)? Give this some thought, as this is key to developing and implementing a successful approach to care."
            register={register("areasAcceptingHelp" as Path<T>)}
            error={errors.areasAcceptingHelp?.message as string}
            rows={6}
          />
        </div>
      </div>
    </Card>
  );
};
