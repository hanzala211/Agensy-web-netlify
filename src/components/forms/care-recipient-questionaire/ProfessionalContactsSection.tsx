import type {
  Control,
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import {
  Input,
  Card,
  PhoneNumberInput,
} from "@agensy/components";

interface ProfessionalContactsSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

export const ProfessionalContactsSection = <T extends FieldValues>({
  register,
  control,
  errors,
}: ProfessionalContactsSectionProps<T>) => {
  return (
    <Card title="List lawyer, accountant, significant others">
      <div className="space-y-4">
        {/* Lawyer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Lawyer"
            register={register("lawyerName" as Path<T>)}
            error={errors.lawyerName?.message as string}
          />
          <PhoneNumberInput
            label="Phone"
            control={control}
            name={"lawyerPhone" as Path<T>}
          />
        </div>

        {/* Power of Attorney (Finances) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Power of Atty. (Finances)"
            register={register("powerOfAttorneyFinancesName" as Path<T>)}
            error={errors.powerOfAttorneyFinancesName?.message as string}
          />
          <PhoneNumberInput
            label="Phone"
            control={control}
            name={"powerOfAttorneyFinancesPhone" as Path<T>}
          />
        </div>

        {/* Power of Attorney (Healthcare) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Medical Power of Atty. (Healthcare)"
            register={register("powerOfAttorneyHealthcareName" as Path<T>)}
            error={errors.powerOfAttorneyHealthcareName?.message as string}
          />
          <PhoneNumberInput
            label="Phone"
            control={control}
            name={"powerOfAttorneyHealthcarePhone" as Path<T>}
          />
        </div>

        {/* Tax Professional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Tax Professional"
            register={register("taxProfessionalName" as Path<T>)}
            error={errors.taxProfessionalName?.message as string}
          />
          <PhoneNumberInput
            label="Phone"
            control={control}
            name={"taxProfessionalPhone" as Path<T>}
          />
        </div>

        {/* Accountant */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Accountant"
            register={register("accountantName" as Path<T>)}
            error={errors.accountantName?.message as string}
          />
          <PhoneNumberInput
            label="Phone"
            control={control}
            name={"accountantPhone" as Path<T>}
          />
        </div>

        {/* Financial Advisor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Financial Advisor"
            register={register("financialAdvisorName" as Path<T>)}
            error={errors.financialAdvisorName?.message as string}
          />
          <PhoneNumberInput
            label="Phone"
            control={control}
            name={"financialAdvisorPhone" as Path<T>}
          />
        </div>

        {/* Significant Other 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Significant other(s)"
            register={register("significantOther1Name" as Path<T>)}
            error={errors.significantOther1Name?.message as string}
          />
          <PhoneNumberInput
            label="Phone"
            control={control}
            name={"significantOther1Phone" as Path<T>}
          />
        </div>

        {/* Significant Other 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Significant other(s)"
            register={register("significantOther2Name" as Path<T>)}
            error={errors.significantOther2Name?.message as string}
          />
          <PhoneNumberInput
            label="Phone"
            control={control}
            name={"significantOther2Phone" as Path<T>}
          />
        </div>
      </div>
    </Card>
  );
}; 