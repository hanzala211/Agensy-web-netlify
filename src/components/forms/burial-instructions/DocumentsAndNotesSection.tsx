import type {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { Input, Card, TextArea } from "@agensy/components";

interface DocumentsAndNotesSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export const DocumentsAndNotesSection = <T extends FieldValues>({
  register,
  errors,
}: DocumentsAndNotesSectionProps<T>) => {
  return (
    <Card title="Documents and Notes">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Will Location"
            register={register("willLocation" as Path<T>)}
            error={errors.willLocation?.message as string}
          />
          <Input
            label="Advance Directive or Living Will Location"
            register={register("advanceDirectiveLocation" as Path<T>)}
            error={errors.advanceDirectiveLocation?.message as string}
          />
          <Input
            label="Life Insurance Info"
            register={register("lifeInsuranceInfo" as Path<T>)}
            error={errors.lifeInsuranceInfo?.message as string}
          />
          <Input
            label="Relationship"
            register={register("relationship" as Path<T>)}
            error={errors.relationship?.message as string}
          />
        </div>

        <div>
          <TextArea
            label="Obituary Wishes (who will write, preferred details, where to post):"
            register={register("obituaryWishes" as Path<T>)}
            error={errors.obituaryWishes?.message as string}
            rows={4}
          />
        </div>
      </div>
    </Card>
  );
};
