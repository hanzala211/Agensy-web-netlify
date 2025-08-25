import { Input, Select, TertiaryButton } from "@agensy/components";
import { ICONS } from "@agensy/constants";
import type { ImportantPeopleInLifeFormData } from "@agensy/types";
import type {
  UseFormRegister,
  UseFormWatch,
  FieldErrors,
  Control,
} from "react-hook-form";

interface ImportantPersonCardProps {
  register: UseFormRegister<ImportantPeopleInLifeFormData>;
  errors: FieldErrors<ImportantPeopleInLifeFormData>;
  watch: UseFormWatch<ImportantPeopleInLifeFormData>;
  index: number;
  onRemove: (index: number) => void;
  canRemove: boolean;
  control: Control<ImportantPeopleInLifeFormData>;
}

const PERSON_TYPES = [
  {
    value: "medical_poa",
    label: "Medical Power of Attorney",
    fields: ["name", "phone", "relationship"],
  },
  {
    value: "financial_poa",
    label: "Financial Power of Attorney",
    fields: ["name", "phone", "relationship"],
  },
  { value: "lawyer", label: "Lawyer", fields: ["name", "phone", "firm"] },
  {
    value: "accountant",
    label: "Accountant or Tax Preparer",
    fields: ["name", "phone", "firm"],
  },
  {
    value: "financial_advisor",
    label: "Financial Advisor",
    fields: ["name", "phone", "firm"],
  },
  {
    value: "trust_officer",
    label: "Trust Officer",
    fields: ["name", "phone", "agency"],
  },
  {
    value: "emergency_contact_1",
    label: "Emergency Contact #1",
    fields: ["name", "phone", "relationship"],
  },
  {
    value: "emergency_contact_2",
    label: "Emergency Contact #2",
    fields: ["name", "phone", "relationship"],
  },
  {
    value: "neighbor",
    label: "Neighbor",
    fields: ["name", "phone", "address"],
  },
  {
    value: "close_friend",
    label: "Close Friend or Relative",
    fields: ["name", "phone", "relationship"],
  },
  {
    value: "faith_contact",
    label: "Faith or Spiritual Contact",
    fields: ["name", "phone", "affiliation"],
  },
  { value: "club_group", label: "Club or Group", fields: ["name", "phone"] },
];

export const ImportantPersonCard = ({
  register,
  errors,
  watch,
  index,
  onRemove,
  canRemove,
  control,
}: ImportantPersonCardProps) => {
  const getFieldLabel = (field: string) => {
    switch (field) {
      case "name":
        return "Name";
      case "phone":
        return "Phone";
      case "relationship":
        return "Relationship";
      case "firm":
        return "Firm";
      case "agency":
        return "Agency";
      case "affiliation":
        return "Affiliation";
      case "address":
        return "Address";
      default:
        return field.charAt(0).toUpperCase() + field.slice(1);
    }
  };

  const allImportantPeople = watch("importantPeople") || [];
  const selectedTypes = allImportantPeople
    .map((person, idx) => (idx !== index ? person.type : null))
    .filter(Boolean);

  const availableTypes = PERSON_TYPES.filter(
    (type) => !selectedTypes.includes(type.value)
  );

  return (
    <div className="p-4 rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-700">
          Contact {index + 1}:
        </span>
        {canRemove && (
          <TertiaryButton
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
          >
            <ICONS.delete />
          </TertiaryButton>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Select
          control={control}
          data={availableTypes}
          name={`importantPeople.${index}.type`}
          label="Type"
        />

        {(() => {
          const selectedType = watch(`importantPeople.${index}.type`);
          const typeConfig = PERSON_TYPES.find((t) => t.value === selectedType);

          if (!typeConfig) return null;

          return typeConfig.fields.map((field) => {
            let fieldPath: string;
            let errorMessage: string | undefined;

            switch (field) {
              case "name":
                fieldPath = `importantPeople.${index}.name`;
                errorMessage = errors.importantPeople?.[index]?.name?.message;
                break;
              case "phone":
                fieldPath = `importantPeople.${index}.phone`;
                errorMessage = errors.importantPeople?.[index]?.phone?.message;
                break;
              case "relationship":
                fieldPath = `importantPeople.${index}.relationship`;
                errorMessage =
                  errors.importantPeople?.[index]?.relationship?.message;
                break;
              case "firm":
                fieldPath = `importantPeople.${index}.firm`;
                errorMessage = errors.importantPeople?.[index]?.firm?.message;
                break;
              case "agency":
                fieldPath = `importantPeople.${index}.agency`;
                errorMessage = errors.importantPeople?.[index]?.agency?.message;
                break;
              case "affiliation":
                fieldPath = `importantPeople.${index}.affiliation`;
                errorMessage =
                  errors.importantPeople?.[index]?.affiliation?.message;
                break;
              case "address":
                fieldPath = `importantPeople.${index}.address`;
                errorMessage =
                  errors.importantPeople?.[index]?.address?.message;
                break;
              default:
                fieldPath = `importantPeople.${index}.name`;
                errorMessage = "";
            }

            return (
              <Input
                key={field}
                label={getFieldLabel(field)}
                register={register(
                  fieldPath as keyof ImportantPeopleInLifeFormData
                )}
                error={errorMessage}
              />
            );
          });
        })()}
      </div>
    </div>
  );
};
