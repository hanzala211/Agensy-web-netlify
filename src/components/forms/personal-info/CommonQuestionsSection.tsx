import type {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { Input, Card } from "@agensy/components";

interface CommonQuestionsSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export const CommonQuestionsSection = <T extends FieldValues>({
  register,
  errors,
}: CommonQuestionsSectionProps<T>) => {
  return (
    <Card title="Identity Verification Questions">
      <div className="space-y-4">
        <Input
          label="Institutions you have banking history with:"
          register={register("bankingHistoryInstitutions" as Path<T>)}
          error={errors.bankingHistoryInstitutions?.message as string}
        />

        <Input
          label="Approximate amount of monthly car or mortgage payment:"
          register={register("monthlyCarMortgagePayment" as Path<T>)}
          error={errors.monthlyCarMortgagePayment?.message as string}
        />

        <Input
          label="Street names where you previously lived:"
          register={register("previousStreetNames" as Path<T>)}
          error={errors.previousStreetNames?.message as string}
        />

        <Input
          label="Institutions you have/had a credit card with:"
          register={register("creditCardInstitutions" as Path<T>)}
          error={errors.creditCardInstitutions?.message as string}
        />

        <Input
          label="Mother's maiden name:"
          register={register("mothersMaidenName" as Path<T>)}
          error={errors.mothersMaidenName?.message as string}
        />
      </div>
    </Card>
  );
};
