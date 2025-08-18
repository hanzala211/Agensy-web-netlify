import { DatePickerField, Input } from "@agensy/components";
import type { VitalsTrackerFormData } from "@agensy/types";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

interface VitalsTrackerTableProps {
  columns: number[];
  vitalsFields: {
    key?: string;
    label?: string;
    type?: string;
    placeholder?: string;
  }[];
  control: Control<VitalsTrackerFormData>;
  register: UseFormRegister<VitalsTrackerFormData>;
  errors: FieldErrors<VitalsTrackerFormData>;
}

export const VitalsTrackerTable = ({
  columns,
  vitalsFields,
  control,
  register,
  errors,
}: VitalsTrackerTableProps) => {
  const getFieldName = (
    fieldKey: string,
    col: number
  ): keyof VitalsTrackerFormData => {
    return `${fieldKey}${col}` as keyof VitalsTrackerFormData;
  };
  return (
    <div className="overflow-x-auto w-screen md:max-w-[calc(100vw-400px)] max-w-[calc(100vw-120px)]">
      <table className="min-w-[800px] border-collapse border border-blue-800">
        <thead>
          <tr className="bg-blue-50">
            <th className="border border-blue-800 px-4 py-3 text-left text-blue-800 font-semibold italic min-w-[150px]">
              Vital Signs
            </th>
            {columns.map((col) => (
              <th
                key={col}
                className="border border-blue-800 px-4 py-3 text-left text-blue-800 font-semibold italic min-w-[120px]"
              >
                Date {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vitalsFields.map((field, rowIndex) => (
            <tr
              key={field.key}
              className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}
            >
              <td className="border border-blue-800 px-4 py-3 text-blue-800 font-semibold italic min-w-[150px]">
                {field.label}
              </td>
              {columns.map((col) => {
                const fieldName = getFieldName(field?.key || "", col);
                return (
                  <td
                    key={col}
                    className="border border-blue-800 px-4 py-3 min-w-[120px]"
                  >
                    {field.key === "date" ? (
                      <DatePickerField
                        label=""
                        control={control}
                        name={fieldName}
                        className="w-full min-w-[100px]"
                      />
                    ) : (
                      <Input
                        label=""
                        type={field.type}
                        register={register(fieldName)}
                        error={errors[fieldName]?.message}
                        placeholder={field.placeholder}
                        inputClassname="w-full min-w-[100px]"
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
