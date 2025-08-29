import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommonLoader, PrimaryButton } from "@agensy/components";
import {
  personalInfoFormSchema,
  type DigitalAccount,
  type OpenedFileData,
  type PersonalInfoFormData,
} from "@agensy/types";
import { PersonalIdentificationSection } from "./PersonalIdentificationSection";
import { EmergencyInformationSection } from "./EmergencyInformationSection";
import { DigitalAccountsSection } from "./DigitalAccountsSection";
import { FinancialAccountsSection } from "./FinancialAccountsSection";
import { UtilitiesSubscriptionsSection } from "./UtilitiesSubscriptionsSection";
import { CommonQuestionsSection } from "./CommonQuestionsSection";
import { NotesBackupContactsSection } from "./NotesBackupContactsSection";
import { useParams } from "react-router-dom";
import { useGetPersonalInfo, usePostPersonalInfoMutation } from "@agensy/api";
import { useEffect } from "react";
import { DateUtils, toast } from "@agensy/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useClientContext } from "@agensy/context";

const defaultValues = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  socialSecurityNumber: "",
  driversLicenseNumber: "",
  driversLicenseState: "",
  passportNumber: "",
  passportExpirationDate: "",
  emergencyContactFirstName: "",
  emergencyContactLastName: "",
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
  socialSecurityQuestion: "",
};

export const PersonalInfo = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  const { setOpenedFileData, setHasUnsavedChanges } = useClientContext();
  const postPersonalInfoMutation = usePostPersonalInfoMutation();
  const {
    data: personalInfo,
    isFetching: isLoadingPersonalInfo,
    refetch,
  } = useGetPersonalInfo(params.clientId!);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    getValues,
    reset,
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoFormSchema),
    defaultValues,
  });

  // Watch form changes to detect unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty, setHasUnsavedChanges]);

  const digitalAccountsArray = useFieldArray({
    control,
    name: "digitalAccounts",
  });
  console.log(personalInfo);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (postPersonalInfoMutation.status === "success") {
      toast.success(
        "Personal Information Successfully Updated",
        "Your client's personal information has been saved and is now up to date."
      );
      queryClient.invalidateQueries({ queryKey: ["client", params.clientId] });
      setHasUnsavedChanges(false);
    } else if (postPersonalInfoMutation.status === "error") {
      toast.error("Error Occurred", String(postPersonalInfoMutation.error));
    }
  }, [postPersonalInfoMutation.status, setHasUnsavedChanges]);

  // Cleanup unsaved changes when component unmounts
  useEffect(() => {
    return () => {
      setHasUnsavedChanges(false);
    };
  }, [setHasUnsavedChanges]);

  useEffect(() => {
    if (personalInfo) {
      const formData = {
        firstName: personalInfo.client_info.first_name || "",
        lastName: personalInfo.client_info.last_name || "",
        dateOfBirth: personalInfo.client_info.date_of_birth
          ? DateUtils.formatDateToRequiredFormat(
              personalInfo.client_info.date_of_birth
            )
          : "",
        socialSecurityNumber:
          personalInfo.client_info.social_security_number || "",
        driversLicenseNumber:
          personalInfo.client_info.driver_license_number || "",
        driversLicenseState:
          personalInfo.client_info.driver_license_state || "",
        passportNumber: personalInfo.client_info.passport_number || "",
        passportExpirationDate: personalInfo.client_info
          .passport_expiration_date
          ? DateUtils.formatDateToRequiredFormat(
              personalInfo.client_info.passport_expiration_date
            )
          : "",
        emergencyContactFirstName:
          personalInfo.emergency_contact.first_name || "",
        emergencyContactLastName:
          personalInfo.emergency_contact.last_name || "",
        emergencyContactPhone: personalInfo.emergency_contact.phone || "",
        emergencyContactRelationship:
          personalInfo.emergency_contact.relationship || "",
        healthInsuranceProvider:
          personalInfo.personal_info_password_manager
            .health_insurance_provider || "",
        healthInsurancePolicyNumber:
          personalInfo.personal_info_password_manager
            .health_insurance_policy_number || "",
        bankName: personalInfo.personal_info_password_manager.bank_name || "",
        bankAccountNumberPartial:
          personalInfo.personal_info_password_manager.bank_account_number || "",
        bankAccountType:
          personalInfo.personal_info_password_manager.bankaccount_type || "",
        bankOnlineLoginInfo:
          personalInfo.personal_info_password_manager.bank_login_info || "",
        creditCardIssuer:
          personalInfo.personal_info_password_manager.credit_card_issuer || "",
        creditCardLastFourDigits:
          personalInfo.personal_info_password_manager.card_last_four_digits ||
          "",
        creditCardOnlineLoginInfo:
          personalInfo.personal_info_password_manager.credit_card_login_info ||
          "",
        electricityProvider:
          personalInfo.personal_info_password_manager.electricity_provider ||
          "",
        electricityUsername:
          personalInfo.personal_info_password_manager
            .electricity_provider_name || "",
        electricityPassword:
          personalInfo.personal_info_password_manager
            .electricity_provider_password || "",
        internetProvider:
          personalInfo.personal_info_password_manager.internet_provider || "",
        internetUsername:
          personalInfo.personal_info_password_manager.internet_provider_name ||
          "",
        internetPassword:
          personalInfo.personal_info_password_manager
            .internet_provider_password || "",
        phoneProvider:
          personalInfo.personal_info_password_manager.phone_provider || "",
        phoneUsername:
          personalInfo.personal_info_password_manager.phone_provider_name || "",
        phonePassword:
          personalInfo.personal_info_password_manager.phone_provider_password ||
          "",
        streamingServices:
          personalInfo.personal_info_password_manager.streaming_service || "",
        streamingUsername:
          personalInfo.personal_info_password_manager.streaming_service_name ||
          "",
        streamingPassword:
          personalInfo.personal_info_password_manager
            .streaming_service_password || "",
        socialSecurityQuestion:
          personalInfo.personal_info_password_manager
            .social_security_questions || "",
        mothersMaidenName:
          personalInfo.personal_info_password_manager.mother_median_name || "",
        bankingHistoryInstitutions:
          personalInfo.personal_info_password_manager
            .banking_history_institutions || "",
        monthlyCarMortgagePayment:
          personalInfo.personal_info_password_manager.mortgage_payment || "",
        previousStreetNames:
          personalInfo.personal_info_password_manager
            .previously_lived_streets || "",
        creditCardInstitutions:
          personalInfo.personal_info_password_manager
            .credit_card_institutions || "",
        trustedPersonName:
          personalInfo.personal_info_password_manager.trusted_person_name || "",
        trustedPersonPhone:
          personalInfo.personal_info_password_manager.trusted_person_phone ||
          "",
        additionalNotes:
          personalInfo.personal_info_password_manager.additional_notes || "",
        digitalAccounts: personalInfo.digital_accounts.map(
          (item: DigitalAccount) => ({
            accountWebsite: item.account || "",
            usernameEmail: item.user_name || "",
            password: item.password || "",
            notes: item.notes || "",
            id: item.id || null,
          })
        ),
      };
      reset(formData);
      digitalAccountsArray.replace(formData.digitalAccounts);
      setOpenedFileData({
        ...getValues(),
        last_update: {
          updatedAt: personalInfo?.last_update?.updatedAt || "",
        },
      } as unknown as OpenedFileData);
    }
  }, [personalInfo]);

  const onSubmit = (data: PersonalInfoFormData) => {
    console.log("Form data:", data);

    const digital_accounts = data.digitalAccounts?.map((item) => {
      const account = {
        account: item.accountWebsite ? item.accountWebsite : null,
        user_name: item.usernameEmail ? item.usernameEmail : null,
        password: item.password ? item.password : null,
        notes: item.notes ? item.notes : null,
        id: item.id ? item.id : null,
      };
      if (account.id) {
        return account;
      } else {
        // @ts-expect-error // TODO Fix this
        delete account.id;
        return account;
      }
    });
    const postData = {
      client_info: {
        first_name: data.firstName ? data.firstName : null,
        last_name: data.lastName ? data.lastName : null,
        date_of_birth: data.dateOfBirth
          ? DateUtils.changetoISO(data.dateOfBirth)
          : null,
        social_security_number: data.socialSecurityNumber
          ? data.socialSecurityNumber
          : null,
        passport_number: data.passportNumber ? data.passportNumber : null,
        passport_expiration_date: data.passportExpirationDate
          ? data.passportExpirationDate
          : null,
        driver_license_number: data.driversLicenseNumber
          ? data.driversLicenseNumber
          : null,
        driver_license_state: data.driversLicenseState
          ? data.driversLicenseState
          : null,
      },
      emergency_contact: {
        first_name: data.emergencyContactFirstName
          ? data.emergencyContactFirstName
          : null,
        last_name: data.emergencyContactLastName
          ? data.emergencyContactLastName
          : null,
        phone: data.emergencyContactPhone ? data.emergencyContactPhone : null,
        relationship: data.emergencyContactRelationship
          ? data.emergencyContactRelationship
          : null,
      },
      personal_info_password_manager: {
        health_insurance_provider: data.healthInsuranceProvider
          ? data.healthInsuranceProvider
          : null,
        health_insurance_policy_number: data.healthInsurancePolicyNumber
          ? data.healthInsurancePolicyNumber
          : null,
        bank_name: data.bankName ? data.bankName : null,
        bankaccount_type: data.bankAccountType ? data.bankAccountType : null,
        bank_account_number: data.bankAccountNumberPartial
          ? data.bankAccountNumberPartial
          : null,
        bank_login_info: data.bankOnlineLoginInfo
          ? data.bankOnlineLoginInfo
          : null,
        credit_card_issuer: data.creditCardIssuer
          ? data.creditCardIssuer
          : null,
        card_last_four_digits: data.creditCardLastFourDigits
          ? data.creditCardLastFourDigits
          : null,
        credit_card_login_info: data.creditCardOnlineLoginInfo
          ? data.creditCardOnlineLoginInfo
          : null,
        electricity_provider: data.electricityProvider
          ? data.electricityProvider
          : null,
        electricity_provider_name: data.electricityUsername
          ? data.electricityUsername
          : null,
        electricity_provider_password: data.electricityPassword
          ? data.electricityPassword
          : null,
        internet_provider: data.internetProvider ? data.internetProvider : null,
        internet_provider_name: data.internetUsername
          ? data.internetUsername
          : null,
        internet_provider_password: data.internetPassword
          ? data.internetPassword
          : null,
        phone_provider: data.phoneProvider ? data.phoneProvider : null,
        phone_provider_name: data.phoneUsername ? data.phoneUsername : null,
        phone_provider_password: data.phonePassword ? data.phonePassword : null,
        streaming_service: data.streamingServices
          ? data.streamingServices
          : null,
        streaming_service_name: data.streamingUsername
          ? data.streamingUsername
          : null,
        streaming_service_password: data.streamingPassword
          ? data.streamingPassword
          : null,
        social_security_questions: data.socialSecurityQuestion
          ? data.socialSecurityQuestion
          : null,
        banking_history_institutions: data.bankingHistoryInstitutions
          ? data.bankingHistoryInstitutions
          : null,
        mortgage_payment: data.monthlyCarMortgagePayment
          ? data.monthlyCarMortgagePayment
          : null,
        previously_lived_streets: data.previousStreetNames
          ? data.previousStreetNames
          : null,
        credit_card_institutions: data.creditCardInstitutions
          ? data.creditCardInstitutions
          : null,
        mother_median_name: data.mothersMaidenName
          ? data.mothersMaidenName
          : null,
        trusted_person_name: data.trustedPersonName
          ? data.trustedPersonName
          : null,
        trusted_person_phone: data.trustedPersonPhone
          ? data.trustedPersonPhone
          : null,
        additional_notes: data.additionalNotes ? data.additionalNotes : null,
      },
      digital_accounts: digital_accounts || [],
    };
    postPersonalInfoMutation.mutate({
      clientId: params.clientId!,
      data: postData,
    });
  };

  if (isLoadingPersonalInfo)
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

        <NotesBackupContactsSection
          control={control}
          register={register}
          errors={errors}
        />

        <div className="bg-basicWhite/90 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-all duration-300 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-end gap-4 p-6">
            <PrimaryButton
              type="submit"
              isLoading={postPersonalInfoMutation.isPending}
              disabled={postPersonalInfoMutation.isPending}
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
