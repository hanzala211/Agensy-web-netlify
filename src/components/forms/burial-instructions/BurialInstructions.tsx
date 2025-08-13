import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrimaryButton, SecondaryButton } from "@agensy/components";
import {
  burialInstructionsFormSchema,
  type BurialInstructionsFormData,
} from "@agensy/types";
import { PersonalIdentificationSection } from "./PersonalIdentificationSection";

const defaultValues = {
  fullNameOfDeceased: "",
  dateOfBirth: "",
  timeOfDeath: "",
  dateOfDeath: "",
  countyThatIssuedDeathCertificate: "",
  numberOfDeathCertificatesOrdered: "",
};

export const BurialInstructions = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BurialInstructionsFormData>({
    resolver: zodResolver(burialInstructionsFormSchema),
    defaultValues,
  });

  const onSubmit = (data: BurialInstructionsFormData) => {
    console.log("Form data:", data);
    // TODO: Add API integration later
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Burial Instructions
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <PersonalIdentificationSection
          register={register}
          control={control}
          errors={errors}
        />

        <div className="flex justify-end space-x-4">
          <SecondaryButton type="button" onClick={handleReset}>
            Reset
          </SecondaryButton>
          <PrimaryButton type="submit">Save</PrimaryButton>
        </div>
      </form>
    </div>
  );
};
