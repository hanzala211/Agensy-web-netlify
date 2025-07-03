import React from "react";
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import type { FaceSheetShortFormData } from "@agensy/types";
import { Select, Card } from "@agensy/components";
import {
  CODE_STATUS_OPTIONS,
  ADVANCE_DIRECTIVE_OPTIONS,
} from "@agensy/constants";

interface MedicalSettingsSectionProps {
  register: UseFormRegister<FaceSheetShortFormData>;
  control: Control<FaceSheetShortFormData>;
  errors: FieldErrors<FaceSheetShortFormData>;
}

export const MedicalSettingsSection: React.FC<MedicalSettingsSectionProps> = ({
  control,
}) => {
  return (
    <Card title="Medical Settings">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Select
          control={control}
          name="codeStatus"
          label="Code Status"
          data={CODE_STATUS_OPTIONS}
          labelOption="Select Code Status"
        />
        <Select
          control={control}
          name="advanceDirective"
          label="Advance Directive"
          data={ADVANCE_DIRECTIVE_OPTIONS}
          labelOption="Select Advance Directive"
        />
      </div>
    </Card>
  );
};
