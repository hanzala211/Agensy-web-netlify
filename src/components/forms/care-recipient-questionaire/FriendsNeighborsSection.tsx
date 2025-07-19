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
  TextArea,
  Select,
} from "@agensy/components";
import { ICONS, RELATIONSHIP_TO_CLIENT } from "@agensy/constants";

interface FriendsNeighborsSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  friendsNeighborsArray: UseFieldArrayReturn<T>;
}

export const FriendsNeighborsSection = <T extends FieldValues>({
  register,
  control,
  errors,
  friendsNeighborsArray,
}: FriendsNeighborsSectionProps<T>) => {
  const {
    fields: friendNeighborFields,
    append: appendFriendNeighbor,
    remove: removeFriendNeighbor,
  } = friendsNeighborsArray;

  return (
    <Card
      title="List friends, neighbors and relatives who help care recipient"
      buttonText={<ICONS.plus size={16} />}
      onButtonClick={() =>
        appendFriendNeighbor({
          // @ts-expect-error - TODO: fix this
          name: "",
          address: "",
          helpDescription: "",
          relationship: "",
          phone: "",
        })
      }
      ariaLabel="Add Friend/Neighbor"
      showButton={true}
    >
      <div className="space-y-6">
        {friendNeighborFields.map((field, index) => (
          <div key={field.id} className="p-4 rounded-lg border border-gray-200">
            {/* First Row: Name and Relationship */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Name"
                register={register(`friendsNeighbors.${index}.name` as Path<T>)}
                error={
                  // @ts-expect-error - TODO: fix this
                  errors.friendsNeighbors?.[index]?.name?.message as string
                }
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

            {/* Second Row: Address and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Address"
                register={register(
                  `friendsNeighbors.${index}.address` as Path<T>
                )}
                error={
                  // @ts-expect-error - TODO: fix this
                  errors.friendsNeighbors?.[index]?.address?.message as string
                }
              />
              <PhoneNumberInput
                label="Phone"
                control={control}
                name={`friendsNeighbors.${index}.phone` as Path<T>}
              />
            </div>

            {/* Third Row: Help Description (Full Width) */}
            <div className="w-full">
              <TextArea
                label="Specifically, how does he/she help?"
                register={register(
                  `friendsNeighbors.${index}.helpDescription` as Path<T>
                )}
                error={
                  // @ts-expect-error - TODO: fix this
                  errors.friendsNeighbors?.[index]?.helpDescription
                    ?.message as string
                }
                rows={3}
              />
            </div>

            {/* Remove Button */}
            {friendNeighborFields.length > 1 && (
              <div className="flex justify-end mt-4">
                <TertiaryButton
                  type="button"
                  onClick={() => removeFriendNeighbor(index)}
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
