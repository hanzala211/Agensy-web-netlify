import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrimaryButton } from "@agensy/components";
import {
  personalInfoFormSchema,
  type PersonalInfoFormData,
} from "@agensy/types";
import { PersonalIdentificationSection } from "./PersonalIdentificationSection";
import { EmergencyInformationSection } from "./EmergencyInformationSection";
import { DigitalAccountsSection } from "./DigitalAccountsSection";
import { FinancialAccountsSection } from "./FinancialAccountsSection";
import { UtilitiesSubscriptionsSection } from "./UtilitiesSubscriptionsSection";
import { CommonQuestionsSection } from "./CommonQuestionsSection";
import { NotesBackupContactsSection } from "./NotesBackupContactsSection";

const defaultValues = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  socialSecurityNumber: "",
  driversLicenseNumber: "",
  driversLicenseState: "",
  passportNumber: "",
  passportExpirationDate: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelationship: "",
  healthInsuranceProvider: "",
  healthInsurancePolicyNumber: "",
  digitalAccounts: [],
  bankName: "",
  bankAccountNumberPartial: "",
  bankAccountType: "",
  bankOnlineLoginInfo: "",
  creditCardIssuer: "",
  creditCardLastFourDigits: "",
  creditCardOnlineLoginInfo: "",
  electricityProvider: "",
  electricityUsername: "",
  electricityPassword: "",
  internetProvider: "",
  internetUsername: "",
  internetPassword: "",
  phoneProvider: "",
  phoneUsername: "",
  phonePassword: "",
  streamingServices: "",
  streamingUsername: "",
  streamingPassword: "",
  bankingHistoryInstitutions: "",
  monthlyCarMortgagePayment: "",
  previousStreetNames: "",
  creditCardInstitutions: "",
  mothersMaidenName: "",
  trustedPersonName: "",
  trustedPersonPhone: "",
  additionalNotes: "",
};

export const PersonalInfo = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoFormSchema),
    defaultValues,
  });

  const digitalAccountsArray = useFieldArray({
    control,
    name: "digitalAccounts",
  });

  const onSubmit = (data: PersonalInfoFormData) => {
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

        <EmergencyInformationSection
          register={register}
          control={control}
          errors={errors}
        />

        <DigitalAccountsSection
          register={register}
          errors={errors}
          digitalAccountsArray={digitalAccountsArray}
        />

        <FinancialAccountsSection
          register={register}
          control={control}
          errors={errors}
        />

        <UtilitiesSubscriptionsSection register={register} errors={errors} />

        <CommonQuestionsSection register={register} errors={errors} />

        <NotesBackupContactsSection register={register} errors={errors} />

        <div className="bg-basicWhite/90 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-all duration-300 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-end gap-4 p-6">
            <PrimaryButton
              type="submit"
              className="sm:!w-fit w-full md:text-base text-sm"
            >
              Save Personal Information
            </PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
};
