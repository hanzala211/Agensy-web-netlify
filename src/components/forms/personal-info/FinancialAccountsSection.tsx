import type {
  Control,
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { Input, Card, Select } from "@agensy/components";
import { ACCOUNT_TYPE_OPTIONS } from "@agensy/constants";

interface FinancialAccountsSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

export const FinancialAccountsSection = <T extends FieldValues>({
  register,
  control,
  errors,
}: FinancialAccountsSectionProps<T>) => {
  return (
    <Card title="Financial Accounts">
      <div className="space-y-6">
        {/* Bank Account Details */}
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Bank Name:"
              register={register("bankName" as Path<T>)}
              error={errors.bankName?.message as string}
            />
            <Input
              label="Account Number (partial):"
              register={register("bankAccountNumberPartial" as Path<T>)}
              error={errors.bankAccountNumberPartial?.message as string}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Select
              label="Account Type:"
              data={ACCOUNT_TYPE_OPTIONS}
              control={control}
              name={"bankAccountType" as Path<T>}
              labelOption="Select Account Type"
            />
            <Input
              label="Online Login Info:"
              register={register("bankOnlineLoginInfo" as Path<T>)}
              error={errors.bankOnlineLoginInfo?.message as string}
            />
          </div>
        </div>

        {/* Credit Card Details */}
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Credit Card Issuer:"
              register={register("creditCardIssuer" as Path<T>)}
              error={errors.creditCardIssuer?.message as string}
            />
            <Input
              label="Last 4 Digits:"
              register={register("creditCardLastFourDigits" as Path<T>)}
              error={errors.creditCardLastFourDigits?.message as string}
            />
            <div className="md:col-span-2">
              <Input
                label="Online Login Info:"
                register={register("creditCardOnlineLoginInfo" as Path<T>)}
                error={errors.creditCardOnlineLoginInfo?.message as string}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
