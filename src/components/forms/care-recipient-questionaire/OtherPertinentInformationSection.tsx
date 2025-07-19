import type {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { Input, Card, TextArea } from "@agensy/components";

interface OtherPertinentInformationSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export const OtherPertinentInformationSection = <T extends FieldValues>({
  register,
  errors,
}: OtherPertinentInformationSectionProps<T>) => {
  return (
    <Card title="Other Pertinent Information">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            <Input
              label="Hospital Preference:"
              register={register("hospitalPreference" as Path<T>)}
              error={errors.hospitalPreference?.message as string}
            />
            <Input
              label="Trust:"
              register={register("trust" as Path<T>)}
              error={errors.trust?.message as string}
            />
            <Input
              label="Will:"
              register={register("will" as Path<T>)}
              error={errors.will?.message as string}
            />
            <Input
              label="Funeral Arrangements:"
              register={register("funeralArrangements" as Path<T>)}
              error={errors.funeralArrangements?.message as string}
            />
            <Input
              label="Monthly Income:"
              register={register("monthlyIncome" as Path<T>)}
              error={errors.monthlyIncome?.message as string}
            />
            <Input
              label="Savings:"
              register={register("savings" as Path<T>)}
              error={errors.savings?.message as string}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <Input
              label="D.N.R. Order:"
              register={register("dnr" as Path<T>)}
              error={errors.dnr?.message as string}
            />
            <Input
              label="Lifecare:"
              register={register("lifecare" as Path<T>)}
              error={errors.lifecare?.message as string}
            />
            <Input
              label="Living Will:"
              register={register("livingWill" as Path<T>)}
              error={errors.livingWill?.message as string}
            />
            <Input
              label="Cemetery Plot:"
              register={register("cemeteryPlot" as Path<T>)}
              error={errors.cemeteryPlot?.message as string}
            />
            <Input
              label="Spouse Income:"
              register={register("spouseIncome" as Path<T>)}
              error={errors.spouseIncome?.message as string}
            />
            <Input
              label="Other Assets:"
              register={register("otherAssets" as Path<T>)}
              error={errors.otherAssets?.message as string}
            />
          </div>
        </div>

        {/* Full Width Text Area */}
        <div>
          <TextArea
            label="Are there financial problems? Please describe."
            register={register("financialProblemsDescription" as Path<T>)}
            error={errors.financialProblemsDescription?.message as string}
            rows={4}
          />
        </div>
      </div>
    </Card>
  );
};
