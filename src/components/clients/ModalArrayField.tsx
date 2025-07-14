import { Input, TertiaryButton } from "@agensy/components";
import { ICONS } from "@agensy/constants";
import type {
  MedicalHistoryArrayField,
  MedicalHistoryFormData,
} from "@agensy/types";
import type React from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

interface ModalArrayFieldProps {
  label?: string;
  items: string[];
  register: UseFormRegister<MedicalHistoryFormData>;
  errors: FieldErrors<MedicalHistoryFormData>;
  removeArrayItem: (field: MedicalHistoryArrayField, index: number) => void;
  addArrayItem: (field: MedicalHistoryArrayField) => void;
  field: MedicalHistoryArrayField;
}

export const ModalArrayField: React.FC<ModalArrayFieldProps> = ({
  label,
  items,
  register,
  errors,
  removeArrayItem,
  addArrayItem,
  field,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {items?.map((_, index) => (
        <div key={index} className="flex gap-2">
          <div className="flex-1">
            <Input
              register={register(`${field}.${index}`)}
              error={errors[field]?.[index]?.message}
            />
          </div>
          {items?.length > 1 && (
            <TertiaryButton
              type="button"
              onClick={() => removeArrayItem(field, index)}
              className="text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <ICONS.delete />
            </TertiaryButton>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayItem(field)}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
      >
        <ICONS.plus />
        Add {label}
      </button>
    </div>
  );
};
