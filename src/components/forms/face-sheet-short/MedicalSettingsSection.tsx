import type {
  Control,
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { Select, Card } from "@agensy/components";
import {
  CODE_STATUS_OPTIONS,
  ADVANCE_DIRECTIVE_OPTIONS,
} from "@agensy/constants";

interface MedicalSettingsSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

export const MedicalSettingsSection = <T extends FieldValues>({
  control,
}: MedicalSettingsSectionProps<T>) => {
  return (
    <Card title="Medical Settings">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Select
          control={control}
          name={"codeStatus" as Path<T>}
          label="Code Status"
          data={CODE_STATUS_OPTIONS}
          labelOption="Select Code Status"
        />
        <Select
          control={control}
          name={"advanceDirective" as Path<T>}
          label="Advance Directive"
          data={ADVANCE_DIRECTIVE_OPTIONS}
          labelOption="Select Advance Directive"
        />
      </div>
    </Card>
  );
};
