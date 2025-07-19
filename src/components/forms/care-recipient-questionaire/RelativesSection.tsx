import type {
  Control,
  UseFormRegister,
  FieldErrors,
  UseFieldArrayReturn,
  FieldValues,
  Path,
} from "react-hook-form";
import {
  Input,
  Card,
  PhoneNumberInput,
  TertiaryButton,
  Select,
} from "@agensy/components";
import { ICONS, RELATIONSHIP_TO_CLIENT } from "@agensy/constants";

interface RelativesSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  relativesArray: UseFieldArrayReturn<T>;
}

export const RelativesSection = <T extends FieldValues>({
  register,
  control,
  errors,
  relativesArray,
}: RelativesSectionProps<T>) => {
  const {
    fields: relativeFields,
    append: appendRelative,
    remove: removeRelative,
  } = relativesArray;

  return (
    <Card
      title="Relatives of care recipient"
      buttonText={<ICONS.plus size={16} />}
      onButtonClick={() =>
        appendRelative({
          // @ts-expect-error - TODO: fix this
          name: "",
          address: "",
          homePhone: "",
          workPhone: "",
          relationship: "",
          email: "",
        })
      }
      ariaLabel="Add Relative"
      showButton={true}
    >
      <div className="space-y-6">
        {relativeFields.map((field, index) => (
          <div key={field.id} className="p-4 rounded-lg border border-gray-200">
            {/* First Row: Name, Home Phone, Relationship */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Input
                label="Name"
                register={register(`relatives.${index}.name` as Path<T>)}
                error={
                  // @ts-expect-error - TODO: fix this
                  errors.relatives?.[index]?.name?.message as string
                }
              />
              <PhoneNumberInput
                label="Home Phone"
                control={control}
                name={`relatives.${index}.homePhone` as Path<T>}
              />
              <Select
                label="Relationship"
                control={control}
                labelOption="Relationship"
                name={`friendsNeighbors.${index}.relationship` as Path<T>}
                data={
                  RELATIONSHIP_TO_CLIENT as { label: string; value: string }[]
                }
              />
            </div>

            {/* Second Row: Address, Work Phone, Email */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Address"
                register={register(`relatives.${index}.address` as Path<T>)}
                error={
                  // @ts-expect-error - TODO: fix this
                  errors.relatives?.[index]?.address?.message as string
                }
              />
              <PhoneNumberInput
                label="Work Phone"
                control={control}
                name={`relatives.${index}.workPhone` as Path<T>}
              />
              <Input
                label="Email"
                type="email"
                register={register(`relatives.${index}.email` as Path<T>)}
                error={
                  // @ts-expect-error - TODO: fix this
                  errors.relatives?.[index]?.email?.message as string
                }
              />
            </div>

            {/* Remove Button */}
            {relativeFields.length > 1 && (
              <div className="flex justify-end mt-4">
                <TertiaryButton
                  type="button"
                  onClick={() => removeRelative(index)}
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
