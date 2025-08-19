import {
  type UseFormRegister,
  type FieldErrors,
  type Control,
  type UseFieldArrayReturn,
} from "react-hook-form";
import {
  Card,
  Input,
  TertiaryButton,
  DatePickerField,
  Select,
} from "@agensy/components";
import { type ComprehensiveCarePlanFormData } from "@agensy/types";
import { ICONS, MEDICATION_FREQUENCY_OPTIONS } from "@agensy/constants";

interface MedicationsCardProps {
  register: UseFormRegister<ComprehensiveCarePlanFormData>;
  errors: FieldErrors<ComprehensiveCarePlanFormData>;
  control: Control<ComprehensiveCarePlanFormData>;
  medicationsFields: UseFieldArrayReturn<
    ComprehensiveCarePlanFormData,
    "medications",
    "id"
  >["fields"];
  appendMedication: UseFieldArrayReturn<
    ComprehensiveCarePlanFormData,
    "medications",
    "id"
  >["append"];
  removeMedication: UseFieldArrayReturn<
    ComprehensiveCarePlanFormData,
    "medications",
    "id"
  >["remove"];
}

export const MedicationsCard = ({
  register,
  errors,
  control,
  medicationsFields,
  appendMedication,
  removeMedication,
}: MedicationsCardProps) => {
  return (
    <Card
      title="Medications"
      buttonText={<ICONS.plus size={16} />}
      onButtonClick={() =>
        appendMedication({
          id: null,
          medicationName: "",
          dosage: "",
          frequency: "",
          startDate: "",
          endDate: "",
          usedToTreat: "",
        })
      }
      ariaLabel="Add Medication"
      showButton={true}
    >
      <div className="space-y-6">
        {medicationsFields.map((field, index) => (
          <div key={field.id} className="p-4 rounded-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <span className="text-sm font-medium text-gray-700 mr-2">
                Medication {index + 1}:
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Medication Name"
                register={register(`medications.${index}.medicationName`)}
                error={errors.medications?.[index]?.medicationName?.message}
              />
              <Input
                label="Dosage"
                register={register(`medications.${index}.dosage`)}
                error={errors.medications?.[index]?.dosage?.message}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Select
                label="Frequency"
                control={control}
                name={`medications.${index}.frequency`}
                data={MEDICATION_FREQUENCY_OPTIONS}
                labelOption="Select Frequency"
              />
              <Input
                label="Used to Treat"
                register={register(`medications.${index}.usedToTreat`)}
                error={errors.medications?.[index]?.usedToTreat?.message}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <DatePickerField
                control={control}
                name={`medications.${index}.startDate`}
                label="Start Date"
              />
              <DatePickerField
                control={control}
                name={`medications.${index}.endDate`}
                label="End Date"
              />
            </div>
            {medicationsFields.length > 1 && (
              <div className="flex justify-end">
                <TertiaryButton
                  type="button"
                  onClick={() => removeMedication(index)}
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
