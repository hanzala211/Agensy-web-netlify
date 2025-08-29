import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommonLoader, PrimaryButton } from "@agensy/components";
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
import {
  useGetBurialInstructions,
  usePostBurialInstructionsMutation,
} from "@agensy/api";
import { useParams } from "react-router-dom";
import { DateUtils, toast } from "@agensy/utils";
import { BURIAL_TYPES } from "@agensy/constants";
import { useQueryClient } from "@tanstack/react-query";

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
  const params = useParams();
  const { setOpenedFileData, setHasUnsavedChanges } = useClientContext();
  const {
    data: burialInstructions,
    isFetching: isFetchingBurialInstructions,
    refetch: refetchBurialInstructions,
  } = useGetBurialInstructions(params.clientId as string);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    getValues,
    reset,
  } = useForm<BurialInstructionsFormData>({
    resolver: zodResolver(burialInstructionsFormSchema),
    defaultValues,
  });
  const postBurialInstructionsMutation = usePostBurialInstructionsMutation();
  const queryClient = useQueryClient();

  // Watch form changes to detect unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty, setHasUnsavedChanges]);

  useEffect(() => {
    refetchBurialInstructions();
  }, [params.clientId, refetchBurialInstructions]);

  useEffect(() => {
    if (postBurialInstructionsMutation.status === "success") {
      toast.success(
        "Burial Instructions Successfully Updated",
        "Your client's burial instructions has been saved and is now up to date."
      );
      queryClient.invalidateQueries({ queryKey: ["client", params.clientId] });
      setHasUnsavedChanges(false);
    } else if (postBurialInstructionsMutation.status === "error") {
      toast.error(
        "Error Occurred",
        String(postBurialInstructionsMutation.error)
      );
    }
  }, [postBurialInstructionsMutation.status, setHasUnsavedChanges]);

  // Cleanup unsaved changes when component unmounts
  useEffect(() => {
    return () => {
      setHasUnsavedChanges(false);
    };
  }, [setHasUnsavedChanges]);

  useEffect(() => {
    if (burialInstructions) {
      const formData = {
        firstName: burialInstructions.client_info.first_name || "",
        lastName: burialInstructions.client_info.last_name || "",
        dateOfBirth: burialInstructions.client_info.date_of_birth
          ? DateUtils.formatDateToRequiredFormat(
              burialInstructions.client_info.date_of_birth
            )
          : "",
        timeOfDeath: burialInstructions.client_info.time_of_death || "",
        dateOfDeath: burialInstructions.client_info.date_of_death
          ? DateUtils.formatDateToRequiredFormat(
              burialInstructions.client_info.date_of_death
            )
          : "",
        countyThatIssuedDeathCertificate:
          burialInstructions.client_info.county_issuing_certificate || "",
        numberOfDeathCertificatesOrdered:
          burialInstructions.client_info.death_certificate_number || "",
        burialType: Object.values(BURIAL_TYPES).includes(
          burialInstructions.burial_instructions.burial_type
        )
          ? burialInstructions.burial_instructions.burial_type
          : BURIAL_TYPES.OTHER,
        burialTypeOther: Object.values(BURIAL_TYPES).includes(
          burialInstructions.burial_instructions.burial_type
        )
          ? ""
          : burialInstructions.burial_instructions.burial_type
          ? burialInstructions.burial_instructions.burial_type
          : "",
        preferredCemetery:
          burialInstructions.burial_instructions.burial_location || "",
        plotOwned: burialInstructions.burial_instructions.plot_owned
          ? "yes"
          : "no",
        plotNumberLocation:
          burialInstructions.burial_instructions.plot_number || "",
        funeralHome: burialInstructions.burial_instructions.funeral_home || "",
        vaultCasketPreferences:
          burialInstructions.burial_instructions.vault_casket_preferences || "",
        urnSelection: burialInstructions.burial_instructions.urn || "",
        ashesDisposition: burialInstructions.burial_instructions.ashes || "",
        typeOfService:
          burialInstructions.burial_instructions.service_type || "",
        officiantSpeakerRequested:
          burialInstructions.burial_instructions.officiant || "",
        locationOfService:
          burialInstructions.burial_instructions.service_location || "",
        specialRequests:
          burialInstructions.burial_instructions.special_requests || "",
        personResponsibleName:
          burialInstructions.burial_instructions.person_responsible_name || "",
        personResponsiblePhone:
          burialInstructions.burial_instructions.person_responsible_phone || "",
        personResponsibleRelationship:
          burialInstructions.burial_instructions
            .person_responsible_relationship || "",
        legalMedicalPowerOfAttorneyName:
          burialInstructions.burial_instructions.legal_medical_poa_name || "",
        legalMedicalPowerOfAttorneyPhone:
          burialInstructions.burial_instructions.legal_medical_poa_phone || "",
        clergySpiritualAdvisorName:
          burialInstructions.burial_instructions.spiritual_advisor_name || "",
        clergySpiritualAdvisorPhone:
          burialInstructions.burial_instructions.spiritual_advisor_phone || "",
        willLocation:
          burialInstructions.burial_instructions.will_location || "",
        advanceDirectiveLocation:
          burialInstructions.burial_instructions.living_will_location || "",
        lifeInsuranceInfo:
          burialInstructions.burial_instructions.life_insurance_info || "",
        relationship: burialInstructions.burial_instructions.relationship || "",
        obituaryWishes:
          burialInstructions.burial_instructions.obituary_wishes || "",
      };
      reset(formData);
      setOpenedFileData({
        ...getValues(),
        last_update: {
          updatedAt: burialInstructions?.last_update?.updatedAt || "",
        },
      } as unknown as OpenedFileData);
    }
  }, [burialInstructions, reset]);

  const onSubmit = (data: BurialInstructionsFormData) => {
    console.log("Form data:", data);
    const postData = {
      client_info: {
        first_name: data.firstName ? data.firstName : null,
        last_name: data.lastName ? data.lastName : null,
        date_of_birth: data.dateOfBirth
          ? DateUtils.changetoISO(data.dateOfBirth)
          : null,
        time_of_death: data.timeOfDeath ? data.timeOfDeath : null,
        date_of_death: data.dateOfDeath
          ? DateUtils.changetoISO(data.dateOfDeath)
          : null,
        county_issuing_certificate: data.countyThatIssuedDeathCertificate
          ? data.countyThatIssuedDeathCertificate
          : null,
        death_certificate_number: data.numberOfDeathCertificatesOrdered
          ? data.numberOfDeathCertificatesOrdered
          : null,
      },
      burial_instructions: {
        burial_type: data.burialType
          ? Object.values(BURIAL_TYPES).includes(data.burialType)
            ? data.burialType === BURIAL_TYPES.OTHER
              ? data.burialTypeOther && data.burialTypeOther.length > 0
                ? data.burialTypeOther
                : null
              : data.burialType
            : null
          : null,
        burial_location: data.preferredCemetery ? data.preferredCemetery : null,
        plot_owned: data.plotOwned === "yes" ? true : false,
        plot_number: data.plotNumberLocation ? data.plotNumberLocation : null,
        funeral_home: data.funeralHome ? data.funeralHome : null,
        vault_casket_preferences: data.vaultCasketPreferences
          ? data.vaultCasketPreferences
          : null,
        urn: data.urnSelection ? data.urnSelection : null,
        ashes: data.ashesDisposition ? data.ashesDisposition : null,
        service_type: data.typeOfService ? data.typeOfService : null,
        officiant: data.officiantSpeakerRequested
          ? data.officiantSpeakerRequested
          : null,
        service_location: data.locationOfService
          ? data.locationOfService
          : null,
        spiritual_advisor_name: data.clergySpiritualAdvisorName
          ? data.clergySpiritualAdvisorName
          : null,
        spiritual_advisor_phone: data.clergySpiritualAdvisorPhone
          ? data.clergySpiritualAdvisorPhone
          : null,
        relationship: data.relationship ? data.relationship : null,
        obituary_wishes: data.obituaryWishes ? data.obituaryWishes : null,
        special_requests: data.specialRequests ? data.specialRequests : null,
        person_responsible_name: data.personResponsibleName
          ? data.personResponsibleName
          : null,
        person_responsible_phone: data.personResponsiblePhone
          ? data.personResponsiblePhone
          : null,
        person_responsible_relationship: data.personResponsibleRelationship
          ? data.personResponsibleRelationship
          : null,
        legal_medical_poa_name: data.legalMedicalPowerOfAttorneyName
          ? data.legalMedicalPowerOfAttorneyName
          : null,
        legal_medical_poa_phone: data.legalMedicalPowerOfAttorneyPhone
          ? data.legalMedicalPowerOfAttorneyPhone
          : null,
        will_location: data.willLocation ? data.willLocation : null,
        living_will_location: data.advanceDirectiveLocation
          ? data.advanceDirectiveLocation
          : null,
        life_insurance_info: data.lifeInsuranceInfo
          ? data.lifeInsuranceInfo
          : null,
      },
    };
    postBurialInstructionsMutation.mutate({
      clientId: params.clientId as string,
      data: postData,
    });
  };

  if (isFetchingBurialInstructions)
    return (
      <div className="flex justify-center items-center h-screen">
        <CommonLoader />
      </div>
    );

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
              disabled={postBurialInstructionsMutation.isPending}
              isLoading={postBurialInstructionsMutation.isPending}
              type="submit"
              className="sm:!w-fit w-full md:text-base text-sm"
              onClick={handleSubmit(onSubmit)}
            >
              Save Burial Instructions
            </PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
};
