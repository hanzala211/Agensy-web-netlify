import type {
  Control,
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import {
  Input,
  Card,
  DatePickerField,
  PhoneNumberInput,
  TextArea,
  Select,
} from "@agensy/components";
import {
  FILLING_FOR_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  STATES,
} from "@agensy/constants";

interface InfoSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

export const InfoSection = <T extends FieldValues>({
  register,
  control,
  errors,
}: InfoSectionProps<T>) => {
  return (
    <div className="space-y-6">
      <Card title="Form Filler's Information">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Your Name"
              register={register("formFillerName" as Path<T>)}
              error={errors.formFillerName?.message as string}
            />
            <DatePickerField
              control={control}
              name={"formFillerDate" as Path<T>}
              label="Date"
            />
          </div>
          <Select
            label="I am filling this out for:"
            control={control}
            labelOption="Filling for"
            name={"fillingForOtherSpecify" as Path<T>}
            data={FILLING_FOR_OPTIONS as { label: string; value: string }[]}
            enableTextInput={true}
            textInputTriggerValue="Other"
            textInputName={"fillingForOtherSpecifyText" as Path<T>}
            textInputPlaceholder="Filling For"
          />
        </div>
      </Card>

      {/* Care Recipient's Personal Information */}
      <Card title="Care Recipient's Personal Information">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="His/Her Firstname"
              register={register("careRecipientFirstName" as Path<T>)}
              error={errors.careRecipientName?.message as string}
            />
            <Input
              label="His/Her Lastname"
              register={register("careRecipientLastName" as Path<T>)}
              error={errors.careRecipientName?.message as string}
            />
            <Input
              label="His/Her Preferred name"
              register={register("careRecipientPreferredName" as Path<T>)}
              error={errors.careRecipientPreferredName?.message as string}
            />
            <Input
              label="Address"
              register={register("careRecipientAddress" as Path<T>)}
              error={errors.careRecipientAddress?.message as string}
            />
            <Input
              label="City"
              register={register("careRecipientCity" as Path<T>)}
              error={errors.careRecipientCity?.message as string}
            />
            <Select
              label="State"
              control={control}
              name={"careRecipientState" as Path<T>}
              data={STATES}
              labelOption="Select state"
            />
            <Input
              label="Zip"
              register={register("careRecipientZip" as Path<T>)}
              error={errors.careRecipientZip?.message as string}
            />
            <DatePickerField
              control={control}
              name={"careRecipientBirthdate" as Path<T>}
              label="Birthdate"
            />
            <Input
              label="Birthplace"
              register={register("careRecipientBirthplace" as Path<T>)}
              error={errors.careRecipientBirthplace?.message as string}
            />
            <Input
              label="S.S. #"
              register={register("careRecipientSSN" as Path<T>)}
              error={errors.careRecipientSSN?.message as string}
            />
            <PhoneNumberInput
              label="Phone"
              control={control}
              name={"careRecipientPhone" as Path<T>}
            />
            <Input
              label="Email"
              type="email"
              register={register("careRecipientEmail" as Path<T>)}
              error={errors.careRecipientEmail?.message as string}
            />
            <Input
              label="Ethnic, racial or cultural background"
              register={register("careRecipientCulturalBackground" as Path<T>)}
              error={errors.careRecipientCulturalBackground?.message as string}
            />
            <Input
              label="Education"
              register={register("careRecipientEducation" as Path<T>)}
              error={errors.careRecipientEducation?.message as string}
            />
            <Input
              label="Religion"
              register={register("careRecipientReligion" as Path<T>)}
              error={errors.careRecipientReligion?.message as string}
            />
            <Input
              label="Active religiously? If so, where"
              register={register(
                "careRecipientActiveReligionLocation" as Path<T>
              )}
              error={
                errors.careRecipientActiveReligionLocation?.message as string
              }
            />
          </div>
          <Select
            label="Marital Status"
            control={control}
            name={"careRecipientMaritalStatus" as Path<T>}
            data={MARITAL_STATUS_OPTIONS as { label: string; value: string }[]}
          />

          <DatePickerField
            control={control}
            name={"careRecipientDateOfDivorceOrWidowhood" as Path<T>}
            label="Date of divorce or widowhood (if applicable)"
          />

          <div>
            <TextArea
              label="Describe impact of this loss on care recipient"
              register={register(
                "careRecipientLossImpactDescription" as Path<T>
              )}
              error={
                errors.careRecipientLossImpactDescription?.message as string
              }
              rows={4}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
