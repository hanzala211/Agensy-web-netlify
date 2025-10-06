import { DatePickerField, Input, TertiaryButton } from "@agensy/components";
import { ICONS } from "@agensy/constants";
import type { VitalsTrackerFormData } from "@agensy/types";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
  FieldArrayWithId,
} from "react-hook-form";

interface VitalsTrackerTableProps {
  fields: FieldArrayWithId<VitalsTrackerFormData, "vitals", "id">[];
  vitalsFields: {
    key: string;
    label: string;
    type: string;
    placeholder?: string;
  }[];
  control: Control<VitalsTrackerFormData>;
  register: UseFormRegister<VitalsTrackerFormData>;
  errors: FieldErrors<VitalsTrackerFormData>;
  onDeleteRow: (index: number) => void;
}

export const VitalsTrackerTable = ({
  fields,
  vitalsFields,
  control,
  register,
  errors,
  onDeleteRow,
}: VitalsTrackerTableProps) => {
  return (
    <div className="overflow-x-auto w-screen md:max-w-[calc(100vw-400px)] max-w-[calc(100vw-120px)]">
      <table className="min-w-[800px] border-collapse border border-blue-800">
        <thead>
          <tr className="bg-blue-50">
            <th className="border border-blue-800 px-4 py-3 text-left text-blue-800 font-semibold italic min-w-[120px]">
              Date
            </th>
            {vitalsFields.map((field) => (
              <th
                key={field.key}
                className="border border-blue-800 px-4 py-3 text-left text-blue-800 font-semibold italic min-w-[120px]"
              >
                {field.label}
              </th>
            ))}
            <th className="border border-blue-800 px-4 py-3 text-left text-blue-800 font-semibold italic min-w-[80px]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {fields.length === 0 ? (
            <tr>
              <td
                colSpan={vitalsFields.length + 2}
                className="border border-blue-800 px-4 py-8 text-center text-gray-500"
              >
                No vitals entries yet. Click the "+" button above to add your
                first entry.
              </td>
            </tr>
          ) : (
            fields.map((field, rowIndex) => (
              <tr
                key={field.id}
                className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="border border-blue-800 px-4 py-3 text-blue-800 font-semibold italic min-w-[120px]">
                  Date {rowIndex + 1}
                </td>
                {vitalsFields.map((vitalField) => {
                  const fieldName =
                    `vitals.${rowIndex}.${vitalField.key}` as const;
                  return (
                    <td
                      key={vitalField.key}
                      className="border border-blue-800 px-4 py-3 min-w-[120px]"
                    >
                      {vitalField.key === "date" ? (
                        <DatePickerField
                          label=""
                          control={control}
                          // @ts-expect-error // fix this
                          name={fieldName}
                          className="w-full min-w-[100px]"
                        />
                      ) : (
                        <Input
                          label=""
                          type={vitalField.type}
                          // @ts-expect-error // fix this
                          register={register(fieldName)}
                          step="0.1"
                          error={
                            errors.vitals?.[rowIndex]?.[
                              vitalField.key as keyof NonNullable<
                                VitalsTrackerFormData["vitals"]
                              >[0]
                            ]?.message
                          }
                          placeholder={vitalField.placeholder}
                          inputClassname="w-full min-w-[100px]"
                        />
                      )}
                    </td>
                  );
                })}
                <td className="border border-blue-800 px-4 py-3 min-w-[80px]">
                  {fields.length > 1 && (
                    <TertiaryButton
                      type="button"
                      onClick={() => onDeleteRow(rowIndex)}
                      className="text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      <ICONS.delete />
                    </TertiaryButton>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
