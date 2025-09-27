import { useEffect, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommonLoader, PrimaryButton } from "@agensy/components";
import { useAuthContext, useClientContext } from "@agensy/context";
import { InfoSection } from "./InfoSection";
import { InsuranceSection } from "./InsuranceSection";
import { RelativesSection } from "./RelativesSection";
import { FriendsNeighborsSection } from "./FriendsNeighborsSection";
import { ProfessionalContactsSection } from "./ProfessionalContactsSection";
import { SupportSystemSection } from "./SupportSystemSection";
import { InHomeHelpSection } from "./InHomeHelpSection";
import { HealthcareProvidersSection } from "./HealthcareProvidersSection";
import { MedicalConditionsSection } from "./MedicalConditionsSection";
import { MedicalInfoSection } from "./MedicalInfoSection";
import { ProblemAreasSection } from "./ProblemAreasSection";
import { ProblemsRisksSection } from "./ProblemsRisksSection";
import { MemoryOrientationJudgmentSection } from "./MemoryOrientationJudgmentSection";
import { EmotionalHealthSection } from "./EmotionalHealthSection";
import { SocialLifeSection } from "./SocialLifeSection";
import { WorkAndRetirementSection } from "./WorkAndRetirementSection";
import { OtherPertinentInformationSection } from "./OtherPertinentInformationSection";
import { SummarySection } from "./SummarySection";
import { careRecipientQuestionnaireSchema } from "@agensy/types";
import type {
  CareRecipientQuestionnaireData,
  ClientMedications,
} from "@agensy/types";
import { useParams } from "react-router-dom";
import {
  useGetCareRecipientQuestionnaire,
  usePostCareRecipientQuestionaireMutation,
} from "@agensy/api";
import { DateUtils, StringUtils, toast } from "@agensy/utils";
import { APP_ACTIONS, RELATIONSHIP_TO_CLIENT } from "@agensy/constants";
import { useQueryClient } from "@tanstack/react-query";
import { MedicationsSection } from "./MedicationsSection";
import type { OpenedFileData } from "@agensy/types";

const defaultValues = {
  formFillerName: "",
  formFillerDate: "",
  fillingForOtherSpecify: "",
  fillingForOtherSpecifyText: "",
  careRecipientFirstName: "",
  careRecipientLastName: "",
  careRecipientAddress: "",
  careRecipientCity: "",
  careRecipientState: "",
  careRecipientZip: "",
  careRecipientBirthdate: "",
  careRecipientBirthplace: "",
  careRecipientSSN: "",
  careRecipientPhone: "",
  careRecipientEmail: "",
  careRecipientCulturalBackground: "",
  careRecipientEducation: "",
  careRecipientReligion: "",
  careRecipientActiveReligionLocation: "",
  careRecipientMaritalStatus: "",
  careRecipientDateOfDivorceOrWidowhood: "",
  careRecipientLossImpactDescription: "",

  // Work and Retirement Information
  occupationProfession: "",
  retirementDate: "",
  retirementAdjustment: "",

  // Insurance Information
  medicareA: "",
  medicareB: "",
  medicareNumbers: "",
  medicareSupplementPlan: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  insurancePhone: "",
  mentalHealthCoverage: "",
  hmo: "",
  hmoPolicyNumber: "",
  hmoPhone: "",
  longTermCareInsuranceName: "",
  longTermCareInsurancePolicyNumber: "",
  longTermCareInsurancePhone: "",

  // Relatives Information
  relatives: [],

  // Friends/Neighbors Information
  friendsNeighbors: [],

  // Professional Contacts Information
  lawyerName: "",
  lawyerPhone: "",
  powerOfAttorneyFinancesName: "",
  powerOfAttorneyFinancesPhone: "",
  powerOfAttorneyHealthcareName: "",
  powerOfAttorneyHealthcarePhone: "",
  taxProfessionalName: "",
  taxProfessionalPhone: "",
  accountantName: "",
  accountantPhone: "",
  financialAdvisorName: "",
  financialAdvisorPhone: "",
  significantOther1Name: "",
  significantOther1Phone: "",
  significantOther2Name: "",
  significantOther2Phone: "",

  // Support System & Emergency Contacts
  supportSystemRating: undefined,
  supportSystemProblems: "",
  emergencyContacts: "",

  // In-Home Help Services
  houseCleaningAgency: "",
  houseCleaningSatisfaction: undefined,
  houseCleaningFrequency: undefined,
  homeAidAgency: "",
  homeAidSatisfaction: undefined,
  homeAidFrequency: undefined,
  homeHealthAgency: "",
  homeHealthSatisfaction: undefined,
  homeHealthFrequency: undefined,
  maintenanceAgency: "",
  maintenanceSatisfaction: undefined,
  maintenanceFrequency: undefined,
  otherHelpAgency: "",
  otherHelpSatisfaction: undefined,
  otherHelpFrequency: undefined,

  livingEnvironmentType: [],
  homeEnvironmentAdequacy: undefined,

  healthcareProviders: [],
  medications: [],

  medicalConditions: [],

  lastCheckupDate: "",
  allergies: "",
  recentHospitalization: undefined,
  hospitalDetails: "",
  supportSystemThoughts: "",

  // Problem Areas in Daily Living
  problemAreasDailyLiving: [],
  problemAreasExplanation: "",

  // Problems/Risks
  problemsRisks: [],
  nutritionConcerns: "",
  selfCareCapacitySummary: "",

  // Memory, Orientation and Judgment
  memoryProblems: "",

  // Emotional Health
  emotionalHealthNotes: "",
  personalityCoping: "",
  recentBehaviorChanges: "",
  recipientSharesConcerns: undefined,
  recipientSharesConcernsNotes: "",
  emotionalProblemsHistory: undefined,
  emotionalProblemsTreatment: undefined,
  emotionalProblemsNotes: "",
  recentLossesImpact: "",
  // Social Life
  socialLifeNotes: "",

  // Other Pertinent Information
  hospitalPreference: "",
  dnr: "",
  trust: "",
  lifecare: "",
  will: "",
  livingWill: "",
  funeralArrangements: "",
  cemeteryPlot: "",
  monthlyIncome: "",
  spouseIncome: "",
  savings: "",
  otherAssets: "",
  financialProblemsDescription: "",

  // Summary Section
  majorConcernsAndAssistance: "",
  areasAcceptingHelp: "",
};

// Add this helper function at the top of the component (after the imports)
const createSafeOpenedFileData = (
  formData: CareRecipientQuestionnaireData,
  lastUpdate?: string
) => {
  return {
    ...formData,
    last_update: JSON.parse(
      JSON.stringify({
        updatedAt: lastUpdate || new Date().toISOString(),
      })
    ),
  };
};

export const CareRecipientQuestionaire = () => {
  const queryClient = useQueryClient();
  const { handleFilterPermission } = useAuthContext();
  const {
    setOpenedFileData,
    setHasUnsavedChanges,
    shouldDownloadAfterSave,
    setShouldDownloadAfterSave,
    setHandleSaveAndDownload,
  } = useClientContext();
  const { clientId } = useParams();
  const {
    data: careRecipientQuestionnaire,
    isFetching: isLoadingData,
    refetch,
  } = useGetCareRecipientQuestionnaire(clientId!);
  const postCareRecipientQuestionaireMutation =
    usePostCareRecipientQuestionaireMutation();

  useEffect(() => {
    refetch();
  }, []);

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isDirty },
    reset,
  } = useForm<CareRecipientQuestionnaireData>({
    // @ts-expect-error - TODO: fix this
    resolver: zodResolver(careRecipientQuestionnaireSchema),
    defaultValues: defaultValues,
  });

  // Watch form changes to detect unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  const relativesArray = useFieldArray({
    control,
    name: "relatives",
  });

  const friendsNeighborsArray = useFieldArray({
    control,
    name: "friendsNeighbors",
  });

  const healthcareProvidersArray = useFieldArray({
    control,
    name: "healthcareProviders",
  });

  const medicalConditionsArray = useFieldArray({
    control,
    name: "medicalConditions",
  });

  const medicationsArray = useFieldArray({
    control,
    name: "medications",
  });

  useEffect(() => {
    if (careRecipientQuestionnaire) {
      const formData = {
        // Form Filler Information
        formFillerName:
          careRecipientQuestionnaire.user?.first_name &&
          careRecipientQuestionnaire.user?.last_name
            ? `${careRecipientQuestionnaire.user.first_name} ${careRecipientQuestionnaire.user.last_name}`
            : "",
        fillingForOtherSpecify: careRecipientQuestionnaire.user?.relationship
          ? RELATIONSHIP_TO_CLIENT.some(
              (item) =>
                item.value === careRecipientQuestionnaire.user?.relationship
            )
            ? careRecipientQuestionnaire.user?.relationship
            : "Other"
          : "",
        fillingForOtherSpecifyText: careRecipientQuestionnaire.user
          ?.relationship
          ? RELATIONSHIP_TO_CLIENT.some(
              (item) =>
                item.value === careRecipientQuestionnaire.user?.relationship
            )
            ? ""
            : careRecipientQuestionnaire.user?.relationship
          : "",
        formFillerDate: DateUtils.formatDateToRequiredFormat(
          new Date().toISOString()
        ),

        // Care Recipient Personal Information
        careRecipientFirstName:
          careRecipientQuestionnaire.client_info?.first_name || "",
        careRecipientLastName:
          careRecipientQuestionnaire.client_info?.last_name || "",
        careRecipientPreferredName:
          careRecipientQuestionnaire.client_info?.preferred_name || "",
        careRecipientAddress:
          careRecipientQuestionnaire.client_info?.address || "",
        careRecipientCity: careRecipientQuestionnaire.client_info?.city || "",
        careRecipientState: careRecipientQuestionnaire.client_info?.state || "",
        careRecipientZip: careRecipientQuestionnaire.client_info?.zip || "",
        careRecipientBirthdate: DateUtils.formatDateToRequiredFormat(
          careRecipientQuestionnaire.client_info?.date_of_birth || ""
        ),
        careRecipientBirthplace:
          careRecipientQuestionnaire.client_info?.birth_place || "",
        careRecipientSSN: careRecipientQuestionnaire.client_info?.ssn || "",
        careRecipientPhone: careRecipientQuestionnaire.client_info?.phone || "",
        careRecipientEmail: careRecipientQuestionnaire.client_info?.email || "",
        careRecipientCulturalBackground:
          careRecipientQuestionnaire.client_info?.cultural_background || "",
        careRecipientEducation:
          careRecipientQuestionnaire.client_info?.education || "",
        careRecipientReligion:
          careRecipientQuestionnaire.client_info?.religion || "",
        careRecipientActiveReligionLocation:
          careRecipientQuestionnaire.client_info?.active_religion_location ||
          "",
        careRecipientMaritalStatus:
          careRecipientQuestionnaire.client_info?.marital_status || "",
        careRecipientDateOfDivorceOrWidowhood: careRecipientQuestionnaire
          .client_info?.date_of_divorce_or_widowhood
          ? DateUtils.formatDateToRequiredFormat(
              careRecipientQuestionnaire.client_info
                ?.date_of_divorce_or_widowhood || ""
            )
          : "",
        careRecipientLossImpactDescription:
          careRecipientQuestionnaire.client_info?.loss_impact_description || "",

        medications: careRecipientQuestionnaire.medications?.map(
          (item: ClientMedications) => ({
            medicationName: item.medication_name || "",
            usedToTreat: item.purpose || "",
            refillDue: item.refill_due
              ? DateUtils.formatDateToRequiredFormat(item.refill_due)
              : "",
            frequency: item.frequency || "",
            id: item.id || "",
            prescribingDoctor: item.prescribing_doctor || "",
            dosage: item.dosage || "",
          })
        ),

        // Work and Retirement Information
        occupationProfession:
          careRecipientQuestionnaire.questionnaire?.occupation_profession || "",
        retirementDate: careRecipientQuestionnaire.questionnaire
          ?.retirement_date
          ? DateUtils.formatDateToRequiredFormat(
              careRecipientQuestionnaire.questionnaire?.retirement_date || ""
            )
          : "",
        retirementAdjustment:
          careRecipientQuestionnaire.questionnaire?.retirement_adjustment || "",

        // Insurance Information
        medicareA: careRecipientQuestionnaire.insurance?.medicare_a
          ? DateUtils.formatDateToRequiredFormat(
              careRecipientQuestionnaire.insurance?.medicare_a || ""
            )
          : "",
        medicareB: careRecipientQuestionnaire.insurance?.medicare_b
          ? DateUtils.formatDateToRequiredFormat(
              careRecipientQuestionnaire.insurance?.medicare_b || ""
            )
          : "",
        medicareNumbers: careRecipientQuestionnaire.short_form?.medicare || "",
        medicareSupplementPlan:
          careRecipientQuestionnaire.insurance?.supplement_plan || "",
        insuranceProvider:
          careRecipientQuestionnaire.short_form?.insurance || "",
        insurancePolicyNumber:
          careRecipientQuestionnaire.short_form?.id_number || "",
        insurancePhone: careRecipientQuestionnaire.insurance?.phone || "",
        mentalHealthCoverage:
          careRecipientQuestionnaire.insurance?.mental_health_coverage !== null
            ? careRecipientQuestionnaire.insurance?.mental_health_coverage ===
              true
              ? "true"
              : "false"
            : "",
        hmo: careRecipientQuestionnaire.insurance?.hmo || "",
        hmoPolicyNumber:
          careRecipientQuestionnaire.insurance?.hmo_policy_number || "",
        hmoPhone: careRecipientQuestionnaire.insurance?.hmo_phone || "",
        longTermCareInsuranceName:
          careRecipientQuestionnaire.insurance?.long_term_care_insurance_name ||
          "",
        longTermCareInsurancePolicyNumber:
          careRecipientQuestionnaire.insurance
            ?.long_term_care_insurance_policy_number || "",
        longTermCareInsurancePhone:
          careRecipientQuestionnaire.insurance
            ?.long_term_care_insurance_phone || "",

        // Relatives Information
        relatives:
          careRecipientQuestionnaire.relatives?.map(
            (item: {
              id?: string;
              name?: string;
              address?: string;
              home_phone?: string;
              work_phone?: string;
              relationship?: string;
              email?: string;
            }) => ({
              id: item.id,
              name: item.name ? item.name : "",
              address: item.address ? item.address : "",
              homePhone: item.home_phone ? item.home_phone : "",
              workPhone: item.work_phone ? item.work_phone : "",
              relationship: item.relationship ? item.relationship : "",
              email: item.email ? item.email : "",
            })
          ) || [],

        // Friends/Neighbors Information
        friendsNeighbors:
          careRecipientQuestionnaire.friends_contact?.map(
            (item: {
              address?: string;
              help_description?: string;
              id?: string;
              name?: string;
              phone?: string;
              relationship?: string;
            }) => ({
              name: item.name ? item.name : "",
              address: item.address ? item.address : "",
              helpDescription: item.help_description
                ? item.help_description
                : "",
              relationship: item.relationship ? item.relationship : "",
              phone: item.phone ? item.phone : "",
              id: item?.id,
            })
          ) || [],

        // Professional Contacts Information
        lawyerName:
          careRecipientQuestionnaire.professional_contacts?.find(
            (contact: { role?: string }) => contact.role === "lawyer"
          )?.name || "",
        lawyerId:
          careRecipientQuestionnaire.professional_contacts?.find(
            (contact: { role?: string }) => contact.role === "lawyer"
          )?.id || "",
        lawyerPhone:
          careRecipientQuestionnaire.professional_contacts?.find(
            (contact: { role?: string }) => contact.role === "lawyer"
          )?.phone || "",
        powerOfAttorneyFinancesName:
          careRecipientQuestionnaire.professional_contacts?.find(
            (contact: { role?: string }) =>
              contact.role === "power_of_attorney_finances"
          )?.name || "",
        powerOfAttorneyFinancesId:
          careRecipientQuestionnaire.professional_contacts?.find(
            (contact: { role?: string }) =>
              contact.role === "power_of_attorney_finances"
          )?.id || "",
        powerOfAttorneyFinancesPhone:
          careRecipientQuestionnaire.professional_contacts?.find(
            (contact: { role?: string }) =>
              contact.role === "power_of_attorney_finances"
          )?.phone || "",
        powerOfAttorneyHealthcareName:
          careRecipientQuestionnaire.professional_contacts?.find(
            (contact: { role?: string }) =>
              contact.role === "power_of_attorney_healthcare"
          )?.name || "",
        powerOfAttorneyHealthcareId:
          careRecipientQuestionnaire.professional_contacts?.find(
            (contact: { role?: string }) =>
              contact.role === "power_of_attorney_healthcare"
          )?.id || "",
        powerOfAttorneyHealthcarePhone:
          careRecipientQuestionnaire.professional_contacts?.find(
            (contact: { role?: string }) =>
              contact.role === "power_of_attorney_healthcare"
          )?.phone || "",
        taxProfessionalName:
          careRecipientQuestionnaire.professional_contacts?.find(
            (contact: { role?: string }) => contact.role === "tax_professional"
          )?.name || "",
        taxProfessionalId:
          careRecipientQuestionnaire.professional_contacts?.find(
            (contact: { role?: string }) => contact.role === "tax_professional"
          )?.id || "",
        taxProfessionalPhone:
          careRecipientQuestionnaire.professional_contacts?.find(
            (contact: { role?: string }) => contact.role === "tax_professional"
          )?.phone || "",
        accountantName:
          careRecipientQuestionnaire.professional_contacts?.find(
            (contact: { role?: string }) => contact.role === "accountant"
          )?.name || "",
        accountantId:
          careRecipientQuestionnaire.professional_contacts?.find(
            (contact: { role?: string }) => contact.role === "accountant"
          )?.id || "",
        accountantPhone:
          careRecipientQuestionnaire.professional_contacts?.find(
            (contact: { role?: string }) => contact.role === "accountant"
          )?.phone || "",
        financialAdvisorName:
          careRecipientQuestionnaire.professional_contacts?.find(
            (contact: { role?: string }) => contact.role === "financial_advisor"
          )?.name || "",
        financialAdvisorId:
          careRecipientQuestionnaire.professional_contacts?.find(
            (contact: { role?: string }) => contact.role === "financial_advisor"
          )?.id || "",
        financialAdvisorPhone:
          careRecipientQuestionnaire.professional_contacts?.find(
            (contact: { role?: string }) => contact.role === "financial_advisor"
          )?.phone || "",
        significantOther1Name:
          careRecipientQuestionnaire.professional_contacts?.find(
            (contact: { role?: string }) =>
              contact.role === "significant_other_1"
          )?.name || "",
        significantOther1Id:
          careRecipientQuestionnaire.professional_contacts?.find(
            (contact: { role?: string }) =>
              contact.role === "significant_other_1"
          )?.id || "",
        significantOther1Phone:
          careRecipientQuestionnaire.professional_contacts?.find(
            (contact: { role?: string }) =>
              contact.role === "significant_other_1"
          )?.phone || "",
        significantOther2Name:
          careRecipientQuestionnaire.professional_contacts?.find(
            (contact: { role?: string }) =>
              contact.role === "significant_other_2"
          )?.name || "",
        significantOther2Id:
          careRecipientQuestionnaire.professional_contacts?.find(
            (contact: { role?: string }) =>
              contact.role === "significant_other_2"
          )?.id || "",
        significantOther2Phone:
          careRecipientQuestionnaire.professional_contacts?.find(
            (contact: { role?: string }) =>
              contact.role === "significant_other_2"
          )?.phone || "",

        // Support System & Emergency Contacts
        supportSystemRating:
          careRecipientQuestionnaire.questionnaire?.support_system_rating || "",
        supportSystemProblems:
          careRecipientQuestionnaire.questionnaire?.support_system_problems ||
          "",
        emergencyContacts:
          careRecipientQuestionnaire.questionnaire?.emergency_contacts || "",

        // In-Home Help Services
        houseCleaningAgency:
          careRecipientQuestionnaire.questionnaire?.house_cleaning_agency || "",
        houseCleaningSatisfaction:
          careRecipientQuestionnaire.questionnaire
            ?.house_cleaning_satisfaction || "",
        houseCleaningFrequency:
          careRecipientQuestionnaire.questionnaire?.house_cleaning_frequency ||
          "",
        homeAidAgency:
          careRecipientQuestionnaire.questionnaire?.home_aid_agency || "",
        homeAidSatisfaction:
          careRecipientQuestionnaire.questionnaire?.home_aid_satisfaction || "",
        homeAidFrequency:
          careRecipientQuestionnaire.questionnaire?.home_aid_frequency || "",
        homeHealthAgency:
          careRecipientQuestionnaire.questionnaire?.home_health_agency || "",
        homeHealthSatisfaction:
          careRecipientQuestionnaire.questionnaire?.home_health_satisfaction ||
          "",
        homeHealthFrequency:
          careRecipientQuestionnaire.questionnaire?.home_health_frequency || "",
        maintenanceAgency:
          careRecipientQuestionnaire.questionnaire?.maintenance_agency || "",
        maintenanceSatisfaction:
          careRecipientQuestionnaire.questionnaire?.maintenance_satisfaction ||
          "",
        maintenanceFrequency:
          careRecipientQuestionnaire.questionnaire?.maintenance_frequency || "",
        otherHelpAgency:
          careRecipientQuestionnaire.questionnaire?.other_help_agency || "",
        otherHelpSatisfaction:
          careRecipientQuestionnaire.questionnaire?.other_help_satisfaction ||
          "",
        otherHelpFrequency:
          careRecipientQuestionnaire.questionnaire?.other_help_frequency || "",

        // Living Environment
        livingEnvironmentType:
          careRecipientQuestionnaire.questionnaire?.living_environment_type?.split(
            ", "
          ) || [],
        homeEnvironmentAdequacy:
          careRecipientQuestionnaire.questionnaire?.home_environment_adequacy ||
          "",

        // Healthcare Providers
        healthcareProviders:
          (careRecipientQuestionnaire?.healthcare_providers &&
            careRecipientQuestionnaire?.healthcare_providers?.length > 0 &&
            careRecipientQuestionnaire.healthcare_providers?.map(
              (provider: {
                provider_name?: string;
                phone?: string;
                for_what_problem?: string;
                id?: string;
              }) => ({
                providerName: provider.provider_name || "",
                phone: provider.phone || "",
                forWhatProblem: provider.for_what_problem || "",
                id: provider.id || null,
              })
            )) ||
          [],

        // Medical Conditions
        medicalConditions: careRecipientQuestionnaire.medical_conditions
          ? (() => {
              const condition = careRecipientQuestionnaire.medical_conditions;
              const problems = condition.problem
                ? condition.problem.split(", ")
                : [];
              const treatments = condition.treatment
                ? condition.treatment.split(", ")
                : [];
              const medications = condition.medications
                ? condition.medications.split(", ")
                : [];

              // Get the maximum length to handle different array sizes
              const maxLength = Math.max(
                problems.length,
                treatments.length,
                medications.length
              );

              // Create array of objects
              return Array.from({ length: maxLength }, (_, index) => ({
                problem: problems[index] || "",
                treatment: treatments[index] || "",
                medications: medications[index] || "",
              }));
            })()
          : [],

        // Medical Info
        lastCheckupDate: careRecipientQuestionnaire.medical_info
          ?.last_checkup_date
          ? DateUtils.formatDateToRequiredFormat(
              careRecipientQuestionnaire.medical_info?.last_checkup_date
            )
          : "",
        allergies: careRecipientQuestionnaire.medical_info?.allergies || "",
        recentHospitalization:
          careRecipientQuestionnaire.medical_info?.recent_hospitalization !==
          null
            ? careRecipientQuestionnaire.medical_info
                ?.recent_hospitalization === true
              ? "true"
              : "false"
            : "",
        hospitalDetails:
          careRecipientQuestionnaire.medical_info?.hospital_details || "",
        supportSystemThoughts:
          careRecipientQuestionnaire.medical_info?.support_system_thoughts ||
          "",

        // Problem Areas in Daily Living
        problemAreasDailyLiving:
          careRecipientQuestionnaire.questionnaire?.problem_areas_daily_living?.split(
            ", "
          ) || [],
        problemAreasExplanation:
          careRecipientQuestionnaire.questionnaire?.problem_areas_explanation ||
          "",

        // Problems/Risks
        problemsRisks:
          careRecipientQuestionnaire.questionnaire?.problems_risks?.split(
            ", "
          ) || [],
        nutritionConcerns:
          careRecipientQuestionnaire.questionnaire?.nutrition_concerns || "",
        selfCareCapacitySummary:
          careRecipientQuestionnaire.questionnaire
            ?.self_care_capacity_summary || "",

        // Memory, Orientation and Judgment
        memoryProblems:
          careRecipientQuestionnaire.questionnaire?.memory_problems || "",

        // Emotional Health
        emotionalHealthNotes:
          careRecipientQuestionnaire.questionnaire?.emotional_health_notes ||
          "",
        personalityCoping:
          careRecipientQuestionnaire.questionnaire?.personality_coping || "",
        recentBehaviorChanges:
          careRecipientQuestionnaire.questionnaire?.recent_behavior_changes ||
          "",
        recipientSharesConcerns:
          careRecipientQuestionnaire.questionnaire
            ?.recipient_shares_concerns !== null
            ? careRecipientQuestionnaire.questionnaire
                ?.recipient_shares_concerns === true
              ? "true"
              : "false"
            : "",
        recipientSharesConcernsNotes:
          careRecipientQuestionnaire.questionnaire
            ?.recipient_shares_concerns_notes || "",
        emotionalProblemsHistory:
          careRecipientQuestionnaire.questionnaire
            ?.emotional_problems_history !== null
            ? careRecipientQuestionnaire.questionnaire
                ?.emotional_problems_history === true
              ? "true"
              : "false"
            : "",
        emotionalProblemsTreatment:
          careRecipientQuestionnaire.questionnaire
            ?.emotional_problems_treatment !== null
            ? careRecipientQuestionnaire.questionnaire
                ?.emotional_problems_treatment === true
              ? "true"
              : "false"
            : "",
        emotionalProblemsNotes:
          careRecipientQuestionnaire.questionnaire?.emotional_problems_notes ||
          "",
        recentLossesImpact:
          careRecipientQuestionnaire.questionnaire?.recent_losses_impact || "",

        // Social Life
        socialLifeNotes:
          careRecipientQuestionnaire.questionnaire?.social_life_notes || "",

        // Other Pertinent Information
        hospitalPreference:
          careRecipientQuestionnaire?.client_info.preferred_hospital,
        dnr: careRecipientQuestionnaire.client_info?.dnr || "",
        trust: careRecipientQuestionnaire.client_info?.trust || "",
        lifecare: careRecipientQuestionnaire.client_info?.lifecare || "",
        will: careRecipientQuestionnaire.client_info?.will || "",
        livingWill: careRecipientQuestionnaire.client_info?.living_will || "",
        funeralArrangements:
          careRecipientQuestionnaire.client_info?.funeral_arrangements || "",
        cemeteryPlot:
          careRecipientQuestionnaire.client_info?.cemetery_plot || "",
        monthlyIncome:
          careRecipientQuestionnaire.client_info?.monthly_income || "",
        spouseIncome:
          careRecipientQuestionnaire.client_info?.spouse_income || "",
        savings: careRecipientQuestionnaire.client_info?.savings || "",
        otherAssets: careRecipientQuestionnaire.client_info?.other_assets || "",
        financialProblemsDescription:
          careRecipientQuestionnaire.client_info
            ?.financial_problems_description || "",

        // Summary Section
        majorConcernsAndAssistance:
          careRecipientQuestionnaire.questionnaire?.major_concerns || "",
        areasAcceptingHelp:
          careRecipientQuestionnaire.questionnaire?.areas_accepting_help || "",
      };
      reset(formData);
      healthcareProvidersArray.replace(formData.healthcareProviders);
      medicalConditionsArray.replace(formData.medicalConditions);
      relativesArray.replace(formData.relatives);
      friendsNeighborsArray.replace(formData.friendsNeighbors);
      medicationsArray.replace(formData.medications);
      setOpenedFileData(
        createSafeOpenedFileData(
          getValues(),
          careRecipientQuestionnaire?.last_update?.updatedAt
        ) as unknown as OpenedFileData
      );
    }
  }, [careRecipientQuestionnaire]);

  useEffect(() => {
    if (postCareRecipientQuestionaireMutation.status === "success") {
      toast.success(
        "Care Recipient Questionnaire Successfully Updated",
        "Your client's care recipient questionnaire has been saved and is now up to date."
      );
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
      setHasUnsavedChanges(false);
      setOpenedFileData(
        createSafeOpenedFileData(
          getValues(),
          new Date().toISOString()
        ) as unknown as OpenedFileData
      );

      if (shouldDownloadAfterSave) {
        setShouldDownloadAfterSave(false);
        setTimeout(() => {
          StringUtils.triggerPDFDownload();
        }, 500);
      }
    } else if (postCareRecipientQuestionaireMutation.status === "error") {
      toast.error(
        "Error Occurred",
        String(postCareRecipientQuestionaireMutation.error)
      );
      // Reset download flag on error
      if (shouldDownloadAfterSave) {
        setShouldDownloadAfterSave(false);
      }
    }
  }, [postCareRecipientQuestionaireMutation.status]);

  // Cleanup unsaved changes when component unmounts
  useEffect(() => {
    return () => {
      setHasUnsavedChanges(false);
    };
  }, [setHasUnsavedChanges]);

  const onSubmit = useCallback(
    (data: CareRecipientQuestionnaireData) => {
      console.log("Form data:", data);

      const relatives = data.relatives?.map((item) => {
        if (item.id) {
          return {
            name: item.name ? item.name : null,
            address: item.address ? item.address : null,
            home_phone: item.homePhone ? item.homePhone : null,
            work_phone: item.workPhone ? item.workPhone : null,
            relationship: item.relationship ? item.relationship : null,
            email: item.email ? item.email : null,
            id: item.id,
          };
        } else {
          // @ts-expect-error - TODO: fix this
          delete item.id;
          return {
            name: item.name ? item.name : null,
            address: item.address ? item.address : null,
            home_phone: item.homePhone ? item.homePhone : null,
            work_phone: item.workPhone ? item.workPhone : null,
            relationship: item.relationship ? item.relationship : null,
            email: item.email ? item.email : null,
          };
        }
      });

      const friendsContact = data.friendsNeighbors?.map((item) => {
        if (item.id) {
          return {
            name: item.name ? item.name : null,
            address: item.address ? item.address : null,
            relationship: item.relationship ? item.relationship : null,
            phone: item.phone ? item.phone : null,
            help_description: item.helpDescription
              ? item.helpDescription
              : null,
            id: item.id,
          };
        } else {
          // @ts-expect-error - TODO: fix this
          delete item.id;
          return {
            name: item.name ? item.name : null,
            address: item.address ? item.address : null,
            relationship: item.relationship ? item.relationship : null,
            phone: item.phone ? item.phone : null,
            help_description: item.helpDescription
              ? item.helpDescription
              : null,
          };
        }
      });

      const professional_contacts = [
        {
          role: "lawyer",
          name: data.lawyerName ? data.lawyerName : null,
          phone: data.lawyerPhone ? data.lawyerPhone : null,
          id: data.lawyerId ? data.lawyerId : null,
        },
        {
          role: "power_of_attorney_finances",
          name: data.powerOfAttorneyFinancesName
            ? data.powerOfAttorneyFinancesName
            : null,
          phone: data.powerOfAttorneyFinancesPhone
            ? data.powerOfAttorneyFinancesPhone
            : null,
          id: data.powerOfAttorneyFinancesId
            ? data.powerOfAttorneyFinancesId
            : null,
        },
        {
          role: "power_of_attorney_healthcare",
          name: data.powerOfAttorneyHealthcareName
            ? data.powerOfAttorneyHealthcareName
            : null,
          phone: data.powerOfAttorneyHealthcarePhone
            ? data.powerOfAttorneyHealthcarePhone
            : null,
          id: data.powerOfAttorneyHealthcareId
            ? data.powerOfAttorneyHealthcareId
            : null,
        },
        {
          role: "tax_professional",
          name: data.taxProfessionalName ? data.taxProfessionalName : null,
          phone: data.taxProfessionalPhone ? data.taxProfessionalPhone : null,
          id: data.taxProfessionalId ? data.taxProfessionalId : null,
        },
        {
          role: "accountant",
          name: data.accountantName ? data.accountantName : null,
          phone: data.accountantPhone ? data.accountantPhone : null,
          id: data.accountantId ? data.accountantId : null,
        },
        {
          role: "financial_advisor",
          name: data.financialAdvisorName ? data.financialAdvisorName : null,
          phone: data.financialAdvisorPhone ? data.financialAdvisorPhone : null,
          id: data.financialAdvisorId ? data.financialAdvisorId : null,
        },
        {
          role: "significant_other_1",
          name: data.significantOther1Name ? data.significantOther1Name : null,
          phone: data.significantOther1Phone
            ? data.significantOther1Phone
            : null,
          id: data.significantOther1Id ? data.significantOther1Id : null,
        },
        {
          role: "significant_other_2",
          name: data.significantOther2Name ? data.significantOther2Name : null,
          phone: data.significantOther2Phone
            ? data.significantOther2Phone
            : null,
          id: data.significantOther2Id ? data.significantOther2Id : null,
        },
      ];

      professional_contacts.forEach((item) => {
        if (item.id) {
          return item;
        } else {
          // @ts-expect-error - TODO: fix this
          delete item.id;
          return item;
        }
      });

      const healthcare_providers = data.healthcareProviders?.map((item) => {
        if (item.id) {
          return {
            provider_name: item.providerName ? item.providerName : null,
            phone: item.phone ? item.phone : null,
            for_what_problem: item.forWhatProblem ? item.forWhatProblem : null,
            id: item.id,
          };
        } else {
          // @ts-expect-error - TODO: fix this
          delete item.id;
          return {
            provider_name: item.providerName ? item.providerName : null,
            phone: item.phone ? item.phone : null,
            for_what_problem: item.forWhatProblem ? item.forWhatProblem : null,
          };
        }
      });
      const medications = data.medications?.map((item) => {
        const medication = {
          medication_name: item.medicationName ? item.medicationName : null,
          purpose: item.usedToTreat ? item.usedToTreat : null,
          refill_due: item.refillDue
            ? DateUtils.changetoISO(item.refillDue)
            : null,
          frequency: item.frequency ? item.frequency : null,
          id: item.id,
          prescribing_doctor: item.prescribingDoctor
            ? item.prescribingDoctor
            : null,
          dosage: item.dosage ? item.dosage : null,
        };
        if (medication.id) {
          return medication;
        } else {
          delete medication.id;
          return medication;
        }
      });

      const postData = {
        client_info: {
          first_name: data.careRecipientFirstName
            ? data.careRecipientFirstName
            : null,
          last_name: data.careRecipientLastName
            ? data.careRecipientLastName
            : null,
          preferred_name: data.careRecipientPreferredName
            ? data.careRecipientPreferredName
            : null,
          preferred_hospital: data.hospitalPreference
            ? data.hospitalPreference
            : null,
          address: data.careRecipientAddress ? data.careRecipientAddress : null,
          city: data.careRecipientCity ? data.careRecipientCity : null,
          state: data.careRecipientState ? data.careRecipientState : null,
          zip: data.careRecipientZip ? data.careRecipientZip : null,
          ssn: data.careRecipientSSN ? data.careRecipientSSN : null,
          date_of_birth: data.careRecipientBirthdate
            ? DateUtils.changetoISO(data.careRecipientBirthdate)
            : null,
          birth_place: data.careRecipientBirthplace
            ? data.careRecipientBirthplace
            : null,
          phone: data.careRecipientPhone ? data.careRecipientPhone : null,
          email: data.careRecipientEmail ? data.careRecipientEmail : null,
          cultural_background: data.careRecipientCulturalBackground
            ? data.careRecipientCulturalBackground
            : null,
          education: data.careRecipientEducation
            ? data.careRecipientEducation
            : null,
          religion: data.careRecipientReligion
            ? data.careRecipientReligion
            : null,
          active_religion_location: data.careRecipientActiveReligionLocation
            ? data.careRecipientActiveReligionLocation
            : null,
          marital_status: data.careRecipientMaritalStatus
            ? data.careRecipientMaritalStatus
            : null,
          date_of_divorce_or_widowhood:
            data.careRecipientDateOfDivorceOrWidowhood
              ? DateUtils.changetoISO(
                  data.careRecipientDateOfDivorceOrWidowhood
                )
              : null,
          loss_impact_description: data.recentLossesImpact
            ? data.recentLossesImpact
            : null,
          dnr: data.dnr ? data.dnr : null,
          trust: data.trust ? data.trust : null,
          lifecare: data.lifecare ? data.lifecare : null,
          will: data.will ? data.will : null,
          living_will: data.livingWill ? data.livingWill : null,
          funeral_arrangements: data.funeralArrangements
            ? data.funeralArrangements
            : null,
          cemetery_plot: data.cemeteryPlot ? data.cemeteryPlot : null,
          monthly_income: data.monthlyIncome ? data.monthlyIncome : null,
          spouse_income: data.spouseIncome ? data.spouseIncome : null,
          savings: data.savings ? data.savings : null,
          other_assets: data.otherAssets ? data.otherAssets : null,
          financial_problems_description: data.financialProblemsDescription
            ? data.financialProblemsDescription
            : null,
        },
        short_form: {
          medicare: data.medicareNumbers ? data.medicareNumbers : null,
          insurance: data.insuranceProvider ? data.insuranceProvider : null,
          id_number: data.insurancePolicyNumber
            ? data.insurancePolicyNumber
            : null,
        },
        insurance: {
          medicare_a: data.medicareA
            ? DateUtils.changetoISO(data.medicareA)
            : null,
          medicare_b: data.medicareB
            ? DateUtils.changetoISO(data.medicareB)
            : null,
          supplement_plan: data.medicareSupplementPlan
            ? data.medicareSupplementPlan
            : null,
          phone: data.insurancePhone ? data.insurancePhone : null,
          mental_health_coverage: data.mentalHealthCoverage
            ? data.mentalHealthCoverage === "true"
              ? true
              : false
            : null,
          hmo: data.hmo ? data.hmo : null,
          hmo_policy_number: data.hmoPolicyNumber ? data.hmoPolicyNumber : null,
          hmo_phone: data.hmoPhone ? data.hmoPhone : null,
          long_term_care_insurance_name: data.longTermCareInsuranceName
            ? data.longTermCareInsuranceName
            : null,
          long_term_care_insurance_policy_number:
            data.longTermCareInsurancePolicyNumber
              ? data.longTermCareInsurancePolicyNumber
              : null,
          long_term_care_insurance_phone: data.longTermCareInsurancePhone
            ? data.longTermCareInsurancePhone
            : null,
        },
        relatives: relatives || [],
        friends_contact: friendsContact || [],
        professional_contacts: professional_contacts || [],
        healthcare_providers: healthcare_providers || [],
        medications: medications || [],
        medical_conditions: {
          problem:
            data.medicalConditions
              ?.map((item) => item.problem || null)
              .join(", ") || null,
          treatment:
            data.medicalConditions
              ?.map((item) => item.treatment || null)
              .join(", ") || null,
          medications:
            data.medicalConditions
              ?.map((item) => item.medications || null)
              .join(", ") || null,
        },
        medical_info: {
          last_checkup_date: data.lastCheckupDate
            ? DateUtils.changetoISO(data.lastCheckupDate)
            : null,
          allergies: data.allergies ? data.allergies : null,
          recent_hospitalization: data.recentHospitalization
            ? data.recentHospitalization === "true"
              ? true
              : false
            : false,
          hospital_details: data.hospitalDetails ? data.hospitalDetails : null,
          support_system_thoughts: data.supportSystemThoughts
            ? data.supportSystemThoughts
            : null,
        },
        questionnaire: {
          support_system_rating: data.supportSystemRating
            ? data.supportSystemRating
            : null,
          support_system_problems: data.supportSystemProblems
            ? data.supportSystemProblems
            : null,
          emergency_contacts: data.emergencyContacts
            ? data.emergencyContacts
            : null,
          house_cleaning_agency: data.houseCleaningAgency
            ? data.houseCleaningAgency
            : null,
          house_cleaning_satisfaction: data.houseCleaningSatisfaction
            ? data.houseCleaningSatisfaction
            : null,
          house_cleaning_frequency: data.houseCleaningFrequency
            ? data.houseCleaningFrequency
            : null,
          home_aid_agency: data.homeAidAgency ? data.homeAidAgency : null,
          home_aid_satisfaction: data.homeAidSatisfaction
            ? data.homeAidSatisfaction
            : null,
          home_aid_frequency: data.homeAidFrequency
            ? data.homeAidFrequency
            : null,
          home_health_agency: data.homeHealthAgency
            ? data.homeHealthAgency
            : null,
          home_health_satisfaction: data.homeHealthSatisfaction
            ? data.homeHealthSatisfaction
            : null,
          home_health_frequency: data.homeHealthFrequency
            ? data.homeHealthFrequency
            : null,
          maintenance_agency: data.maintenanceAgency
            ? data.maintenanceAgency
            : null,
          maintenance_satisfaction: data.maintenanceSatisfaction
            ? data.maintenanceSatisfaction
            : null,
          maintenance_frequency: data.maintenanceFrequency
            ? data.maintenanceFrequency
            : null,
          other_help_agency: data.otherHelpAgency ? data.otherHelpAgency : null,
          other_help_satisfaction: data.otherHelpSatisfaction
            ? data.otherHelpSatisfaction
            : null,
          other_help_frequency: data.otherHelpFrequency
            ? data.otherHelpFrequency
            : null,
          living_environment_type:
            data.livingEnvironmentType && data.livingEnvironmentType?.length > 0
              ? data.livingEnvironmentType
                ? data.livingEnvironmentType.join(", ")
                : null
              : null,
          home_environment_adequacy: data.homeEnvironmentAdequacy
            ? data.homeEnvironmentAdequacy
            : null,
          problem_areas_daily_living:
            data.problemAreasDailyLiving &&
            data.problemAreasDailyLiving.length > 0
              ? data.problemAreasDailyLiving
                ? data.problemAreasDailyLiving.join(", ")
                : null
              : null,
          problem_areas_explanation: data.problemAreasExplanation
            ? data.problemAreasExplanation
            : null,
          problems_risks:
            data.problemsRisks && data.problemsRisks.length > 0
              ? data.problemsRisks
                ? data.problemsRisks.join(", ")
                : null
              : null,
          nutrition_concerns: data.nutritionConcerns
            ? data.nutritionConcerns
            : null,
          self_care_capacity_summary: data.selfCareCapacitySummary
            ? data.selfCareCapacitySummary
            : null,
          memory_problems: data.memoryProblems ? data.memoryProblems : null,
          emotional_health_notes: data.emotionalHealthNotes
            ? data.emotionalHealthNotes
            : null,
          personality_coping: data.personalityCoping
            ? data.personalityCoping
            : null,
          recent_behavior_changes: data.recentBehaviorChanges
            ? data.recentBehaviorChanges
            : null,
          recipient_shares_concerns: data.recipientSharesConcerns
            ? data.recipientSharesConcerns === "true"
              ? true
              : false
            : null,
          recipient_shares_concerns_notes: data.recipientSharesConcernsNotes
            ? data.recipientSharesConcernsNotes
            : null,
          emotional_problems_history: data.emotionalProblemsHistory
            ? data.emotionalProblemsHistory === "true"
              ? true
              : false
            : null,
          emotional_problems_treatment: data.emotionalProblemsTreatment
            ? data.emotionalProblemsTreatment === "true"
              ? true
              : false
            : null,
          emotional_problems_notes: data.emotionalProblemsNotes
            ? data.emotionalProblemsNotes
            : null,
          recent_losses_impact: data.recentLossesImpact
            ? data.recentLossesImpact
            : null,
          social_life_notes: data.socialLifeNotes ? data.socialLifeNotes : null,
          occupation_profession: data.occupationProfession
            ? data.occupationProfession
            : null,
          retirement_date: data.retirementDate
            ? DateUtils.changetoISO(data.retirementDate)
            : null,
          retirement_adjustment: data.retirementAdjustment
            ? data.retirementAdjustment
            : null,
          major_concerns: data.majorConcernsAndAssistance
            ? data.majorConcernsAndAssistance
            : null,
          areas_accepting_help: data.areasAcceptingHelp
            ? data.areasAcceptingHelp
            : null,
        },
      };

      postCareRecipientQuestionaireMutation.mutate({
        clientId: clientId as string,
        data: postData,
      });
    },
    [postCareRecipientQuestionaireMutation, clientId]
  );

  const handleSaveAndDownload = useCallback(() => {
    setShouldDownloadAfterSave(true);
    // @ts-expect-error //TODO fix this
    handleSubmit(onSubmit)();
  }, []);

  // Register the save function with context
  useEffect(() => {
    setHandleSaveAndDownload(() => handleSaveAndDownload);
    return () => setHandleSaveAndDownload(undefined);
  }, [setHandleSaveAndDownload, handleSaveAndDownload]);

  return isLoadingData ? (
    <div className="flex justify-center items-center h-screen">
      <CommonLoader />
    </div>
  ) : (
    <div className="space-y-6">
      <form
        // @ts-expect-error - TODO: fix this
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <InfoSection
          register={register}
          // @ts-expect-error - TODO: fix this
          control={control}
          errors={errors}
        />
        <InsuranceSection
          register={register}
          // @ts-expect-error - TODO: fix this
          control={control}
          errors={errors}
        />
        <RelativesSection
          register={register}
          // @ts-expect-error - TODO: fix this

          control={control}
          errors={errors}
          relativesArray={relativesArray}
        />
        <FriendsNeighborsSection
          register={register}
          // @ts-expect-error - TODO: fix this

          control={control}
          errors={errors}
          friendsNeighborsArray={friendsNeighborsArray}
        />
        <ProfessionalContactsSection
          register={register}
          // @ts-expect-error - TODO: fix this
          control={control}
          errors={errors}
        />
        <SupportSystemSection register={register} errors={errors} />
        <InHomeHelpSection
          register={register}
          // @ts-expect-error - TODO: fix this
          control={control}
          setValue={setValue}
          errors={errors}
        />
        <HealthcareProvidersSection
          register={register}
          // @ts-expect-error - TODO: fix this
          control={control}
          errors={errors}
          healthcareProvidersArray={healthcareProvidersArray}
        />
        <MedicalConditionsSection
          register={register}
          errors={errors}
          medicalConditionsArray={medicalConditionsArray}
        />
        <MedicalInfoSection
          register={register}
          errors={errors}
          // @ts-expect-error - TODO: fix this
          control={control}
        />
        <MedicationsSection
          errors={errors}
          // @ts-expect-error - TODO: fix this
          control={control}
          register={register}
          medicationsArray={medicationsArray}
        />
        <ProblemAreasSection
          register={register}
          // @ts-expect-error - TODO: fix this
          control={control}
          setValue={setValue}
          errors={errors}
        />
        <ProblemsRisksSection
          register={register}
          // @ts-expect-error - TODO: fix this
          control={control}
          setValue={setValue}
          errors={errors}
        />
        <MemoryOrientationJudgmentSection register={register} errors={errors} />
        <EmotionalHealthSection register={register} errors={errors} />
        <SocialLifeSection errors={errors} register={register} />
        <WorkAndRetirementSection
          register={register}
          // @ts-expect-error - TODO: fix this
          control={control}
          errors={errors}
        />
        <OtherPertinentInformationSection register={register} errors={errors} />
        <SummarySection register={register} errors={errors} />
        {handleFilterPermission(
          clientId as string,
          APP_ACTIONS.EditAgensyForms
        ) && (
          <div className="bg-basicWhite/90 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-all duration-300 overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-end gap-4 p-6">
              <PrimaryButton
                isLoading={postCareRecipientQuestionaireMutation.isPending}
                disabled={postCareRecipientQuestionaireMutation.isPending}
                type="submit"
                className="sm:!w-fit w-full md:text-base text-sm"
              >
                Save Care Recipient Questionaire
              </PrimaryButton>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
