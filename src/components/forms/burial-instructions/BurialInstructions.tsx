import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrimaryButton } from "@agensy/components";
import {
  burialInstructionsFormSchema,
  type BurialInstructionsFormData,
  type OpenedFileData,
} from "@agensy/types";
import { PersonalIdentificationSection } from "./PersonalIdentificationSection";
import { BurialPreferencesSection } from "./BurialPreferencesSection";
import { ServiceDetailsSection } from "./ServiceDetailsSection";
import { KeyContactsSection } from "./KeyContactsSection";
import { DocumentsAndNotesSection } from "./DocumentsAndNotesSection";
import { useEffect } from "react";
import { useClientContext } from "@agensy/context";

const defaultValues = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  timeOfDeath: "",
  dateOfDeath: "",
  countyThatIssuedDeathCertificate: "",
  numberOfDeathCertificatesOrdered: "",
  burialType: "",
  burialTypeOther: "",
  preferredCemetery: "",
  plotOwned: "",
  plotNumberLocation: "",
  funeralHome: "",
  vaultCasketPreferences: "",
  urnSelection: "",
  ashesDisposition: "",
  ashesDispositionOther: "",
  typeOfService: "",
  officiantSpeakerRequested: "",
  locationOfService: "",
  specialRequests: "",
  personResponsibleName: "",
  personResponsiblePhone: "",
  personResponsibleRelationship: "",
  legalMedicalPowerOfAttorneyName: "",
  legalMedicalPowerOfAttorneyPhone: "",
  clergySpiritualAdvisorName: "",
  clergySpiritualAdvisorPhone: "",
  willLocation: "",
  advanceDirectiveLocation: "",
  lifeInsuranceInfo: "",
  relationship: "",
  obituaryWishes: "",
};

export const BurialInstructions = () => {
  const { setOpenedFileData } = useClientContext();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = useForm<BurialInstructionsFormData>({
    resolver: zodResolver(burialInstructionsFormSchema),
    defaultValues,
  });

  useEffect(() => {
    setOpenedFileData({
      ...getValues(),
      last_update: { updatedAt: "" },
    } as unknown as OpenedFileData);
  }, []);

  const onSubmit = (data: BurialInstructionsFormData) => {
    console.log("Form data:", data);
    // TODO: Add API integration later
  };
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <PersonalIdentificationSection
          register={register}
          control={control}
          errors={errors}
        />

        <BurialPreferencesSection
          register={register}
          errors={errors}
          watch={watch}
        />

        <ServiceDetailsSection register={register} errors={errors} />

        <KeyContactsSection
          register={register}
          control={control}
          errors={errors}
        />

        <DocumentsAndNotesSection register={register} errors={errors} />

        <div className="bg-basicWhite/90 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-all duration-300 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-end gap-4 p-6">
            <PrimaryButton
              type="submit"
              className="sm:!w-fit w-full md:text-base text-sm"
            >
              Save Burial Instructions
            </PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
};
