import type {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
  Control,
} from "react-hook-form";
import { Input, Card, TextArea, PhoneNumberInput } from "@agensy/components";

interface NotesBackupContactsSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  control: Control<T>;
}

export const NotesBackupContactsSection = <T extends FieldValues>({
  register,
  errors,
  control,
}: NotesBackupContactsSectionProps<T>) => {
  return (
    <Card title="Notes & Backup Contact">
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">
            Trusted person who knows where this document is stored
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Name:"
              register={register("trustedPersonName" as Path<T>)}
              error={errors.trustedPersonName?.message as string}
            />
            <PhoneNumberInput
              label="Phone:"
              name={"trustedPersonPhone" as Path<T>}
              control={control}
            />
          </div>
        </div>

        {/* Additional notes */}
        <div className="space-y-4">
          <TextArea
            label="Additional notes:"
            register={register("additionalNotes" as Path<T>)}
            error={errors.additionalNotes?.message as string}
            rows={4}
          />
        </div>
      </div>
    </Card>
  );
};
