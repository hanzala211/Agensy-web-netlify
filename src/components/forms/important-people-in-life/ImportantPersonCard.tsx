import type {
  Control,
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { Input, PhoneNumberInput, Select } from "@agensy/components";
import { RELATIONSHIP_TO_CLIENT } from "@agensy/constants";

interface ImportantPersonCardProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  nameField: Path<T>;
  phoneField: Path<T>;
  relationshipField?: Path<T>;
  relationshipLabel?: string;
}

export const ImportantPersonCard = <T extends FieldValues>({
  register,
  control,
  errors,
  nameField,
  phoneField,
  relationshipField,
  relationshipLabel,
}: ImportantPersonCardProps<T>) => {
  return (
    <div className="space-y-4">
      <Input
        label="Name"
        register={register(nameField)}
        error={errors[nameField]?.message as string}
      />
      <PhoneNumberInput label="Phone" control={control} name={phoneField} />
      {relationshipField &&
        relationshipLabel &&
        (relationshipLabel === "Relationship" ? (
          <Select
            label={relationshipLabel}
            control={control}
            data={RELATIONSHIP_TO_CLIENT}
            name={relationshipField}
            labelOption="Select Relationship"
          />
        ) : (
          <Input
            label={relationshipLabel}
            register={register(relationshipField)}
            error={errors[relationshipField]?.message as string}
          />
        ))}
    </div>
  );
};
