import type {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
  UseFieldArrayReturn,
} from "react-hook-form";
import { Input, Card, TextArea, TertiaryButton } from "@agensy/components";
import { ICONS } from "@agensy/constants";

interface DigitalAccountsSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  // @ts-expect-error - TODO: fix this
  digitalAccountsArray: UseFieldArrayReturn<T, "digitalAccounts", "id">;
}

export const DigitalAccountsSection = <T extends FieldValues>({
  register,
  errors,
  digitalAccountsArray,
}: DigitalAccountsSectionProps<T>) => {
  return (
    <Card
      title="Digital Accounts & Passwords"
      buttonText={<ICONS.plus size={16} />}
      onButtonClick={() =>
        digitalAccountsArray.append({
          // @ts-expect-error - TODO: fix this
          accountWebsite: "",
          usernameEmail: "",
          password: "",
          notes: "",
        })
      }
      ariaLabel="Add New Digital Account"
      showButton={true}
    >
      <div className="space-y-6">
        {digitalAccountsArray.fields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 rounded-lg border space-y-4 border-gray-200"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Account/Website:"
                register={register(
                  `digitalAccounts.${index}.accountWebsite` as Path<T>
                )}
                error={
                  // @ts-expect-error - TODO: fix this
                  errors.digitalAccounts?.[index]?.accountWebsite
                    ?.message as string
                }
              />
              <Input
                label="Username or Email:"
                register={register(
                  `digitalAccounts.${index}.usernameEmail` as Path<T>
                )}
                error={
                  // @ts-expect-error - TODO: fix this
                  errors.digitalAccounts?.[index]?.usernameEmail
                    ?.message as string
                }
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Password:"
                  type="password"
                  register={register(
                    `digitalAccounts.${index}.password` as Path<T>
                  )}
                  error={
                    // @ts-expect-error - TODO: fix this
                    errors.digitalAccounts?.[index]?.password?.message as string
                  }
                />
              </div>
              <div className="md:col-span-2">
                <TextArea
                  label="Notes (2FA, recovery, etc.):"
                  register={register(
                    `digitalAccounts.${index}.notes` as Path<T>
                  )}
                  error={
                    // @ts-expect-error - TODO: fix this
                    errors.digitalAccounts?.[index]?.notes?.message as string
                  }
                  rows={3}
                />
              </div>
            </div>
            {digitalAccountsArray.fields.length > 1 && (
              <div className="flex justify-end mt-4">
                <TertiaryButton
                  type="button"
                  onClick={() => digitalAccountsArray.remove(index)}
                  className="text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  <ICONS.delete />
                </TertiaryButton>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
