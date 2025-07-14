import React, { useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommonLoader, PrimaryButton } from "@agensy/components";
import {
  faceSheetLongFormSchema,
  type ClientMedications,
  type FaceSheetLongFormData,
  type HealthcareProvider,
  type Bloodwork,
  type Vaccine,
  type MedicalCondition,
  type OpenedFileData,
} from "@agensy/types";
import { useParams } from "react-router-dom";
import { DateUtils, toast } from "@agensy/utils";
import { PersonalInformationSection } from "../face-sheet-short/PersonalInformationSection";
import { EmergencyContactSection } from "../face-sheet-short/EmergencyContactSection";
import { MedicalSettingsSection } from "../face-sheet-short/MedicalSettingsSection";
import { HospitalPreferenceSection } from "../face-sheet-short/HospitalPreferenceSection";
import { InsuranceInformationSection } from "../face-sheet-short/InsuranceInformationSection";
import { PharmacyInformationSection } from "../face-sheet-short/PharmacyInformationSection";
import { MpoaDpoaSection } from "../face-sheet-short/MpoaDpoaSection";
import { HealthcareProvidersSection } from "../face-sheet-short/HealthcareProvidersSection";
import { MedicationsSection } from "./MedicationsSection";
import { DiagnosesSection } from "../face-sheet-short/DiagnosesSection";
import { AllergiesSection } from "../face-sheet-short/AllergiesSection";
import { SurgicalHistorySection } from "../face-sheet-short/SurgicalHistorySection";
import { ExtendedPersonalInformationSection } from "./ExtendedPersonalInformationSection";
import { CaregiverAgencySection } from "./CaregiverAgencySection";
import { HomeHealthAgencySection } from "./HomeHealthAgencySection";
import { MentalStatusSection } from "./MentalStatusSection";
import { MedicalConditionsSection } from "./MedicalConditionsSection";
import { VaccinationsSection } from "./VaccinationsSection";
import { BloodworkSection } from "./BloodworkSection";
import { DietaryRestrictionsSection } from "./DietaryRestrictionsSection";
import {
  useGetFaceSheetLongForm,
  usePostFaceSheetLongFormMutation,
} from "@agensy/api";
import {
  ADVANCE_DIRECTIVE_OPTIONS,
  CODE_STATUS_OPTIONS,
  GENDER_OPTIONS,
  LANGUAGE_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  LIVING_SITUATION_OPTIONS,
  RELATIONSHIP_TO_CLIENT,
  RACE_OPTIONS,
} from "@agensy/constants";
import { useClientContext } from "@agensy/context";

const defaultValues = {
  firstName: "",
  lastName: "",
  address: "",
  phoneNumber: "",
  dateOfBirth: "",
  ssn: "",
  codeStatus: "",
  advanceDirective: "",
  race: "",
  dateOfLastCarePlan: "",
  gender: "",
  maritalStatus: "",
  language: "",
  livingSituation: "",
  hospitalPreference: "",
  hospitalAddress: "",
  hospitalPhoneNumber: "",
  pharmacyName: "",
  pharmacyAddress: "",
  pharmacyPhone: "",
  pharmacyFax: "",
  emergencyContactFirstName: "",
  emergencyContactLastName: "",
  emergencyContactPhone: "",
  emergencyContactRelationship: "",
  emergencyContactAddress: "",
  emergencyContactEmail: "",
  providers: [],
  medications: [],
  cognitiveScreeningDate: "",
  cognitiveScreeningScore: "",
  cognitiveScreeningScoreOutOf: "",
  notesAndConcerns: "",
  mentalStatus: "",
  dietaryRestrictions: [],
  homeHealthAgency: "",
  homeHealthAddress: "",
  homeHealthPhone: "",
  homeHealthFax: "",
  homeHealthSchedule: "",
  homeHealthPrescribingDoctor: "",
  homeHealthStartDate: "",
  homeHealthDischargeDate: "",
  caregiverAgency: "",
  caregiverAddress: "",
  caregiverDuties: "",
  caregiverPhone: "",
  caregiverPointOfContact: "",
  caregiverSchedule: "",
  importantInformationForCaregivers: "",
  insurance: "",
  groupNumber: "",
  idNumber: "",
  medicare: "",
  dpoaName: "",
  mpoaName: "",
  mpoaAddress: "",
  mpoaPhone: "",
  dpoaAddress: "",
  dpoaPhone: "",
  bloodwork: [],
  vaccinations: [],
  medicalConditions: [],
  surgicalHistory: [],
  diagnoses: [],
  allergies: [],
};

export const FaceSheetLongForm: React.FC = () => {
  const { setOpenedFileData } = useClientContext();
  const { clientId } = useParams();
  const postFaceSheetLongFormMutation = usePostFaceSheetLongFormMutation();
  const {
    data: faceSheetLongData,
    isFetching: isFaceSheetLoading,
    refetch,
  } = useGetFaceSheetLongForm(clientId as string);

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm<FaceSheetLongFormData>({
    resolver: zodResolver(faceSheetLongFormSchema),
    defaultValues,
  });

  useEffect(() => {
    refetch();
  }, [clientId, refetch]);

  useEffect(() => {
    if (postFaceSheetLongFormMutation.status === "success") {
      toast.success(
        "Face Sheet Successfully Updated",
        "Your client's medical information has been saved and is now up to date."
      );
    } else if (postFaceSheetLongFormMutation.status === "error") {
      toast.error("Error Occurred", String(postFaceSheetLongFormMutation.error));
    }
  }, [postFaceSheetLongFormMutation.status]);

  const formValues = useWatch({ control });

  useEffect(() => {
    if (formValues && Object.keys(formValues).length > 0) {
      setOpenedFileData({
        ...formValues,
        last_update: { updatedAt: faceSheetLongData?.last_update?.updatedAt },
      } as unknown as OpenedFileData);
    } else {
      setOpenedFileData({
        ...getValues(),
        last_update: { updatedAt: faceSheetLongData?.last_update?.updatedAt },
      } as unknown as OpenedFileData);
    }
  }, [formValues]);

  const providersArray = useFieldArray({
    control,
    name: "providers",
  });

  const medicationsArray = useFieldArray({
    control,
    name: "medications",
  });

  const diagnosesArray = useFieldArray({
    control,
    name: "diagnoses",
  });

  const allergiesArray = useFieldArray({
    control,
    name: "allergies",
  });

  const surgicalHistoryArray = useFieldArray({
    control,
    name: "surgicalHistory",
  });

  const medicalConditionsArray = useFieldArray({
    control,
    name: "medicalConditions",
  });

  const vaccinationsArray = useFieldArray({
    control,
    name: "vaccinations",
  });

  const bloodworkArray = useFieldArray({
    control,
    name: "bloodwork",
  });

  const dietaryRestrictionsArray = useFieldArray({
    control,
    name: "dietaryRestrictions",
  });

  useEffect(() => {
    if (faceSheetLongData) {
      const formData = {
        firstName: faceSheetLongData?.client_info?.first_name || "",
        lastName: faceSheetLongData?.client_info?.last_name || "",
        address: faceSheetLongData?.client_info?.address || "",
        phoneNumber: faceSheetLongData?.client_info?.phone || "",
        dateOfBirth: DateUtils.formatDateToRequiredFormat(
          faceSheetLongData?.client_info?.date_of_birth || ""
        ),
        gender:
          GENDER_OPTIONS.find(
            (gender) => gender.value === faceSheetLongData?.client_info?.gender
          )?.value || "",
        race:
          RACE_OPTIONS.find(
            (race) => race.value === faceSheetLongData?.client_info?.race
          )?.value || "",
        language:
          LANGUAGE_OPTIONS.find(
            (language) =>
              language.value === faceSheetLongData?.client_info?.language
          )?.value || "",
        maritalStatus:
          MARITAL_STATUS_OPTIONS.find(
            (maritalStatus) =>
              maritalStatus.value ===
              faceSheetLongData?.client_info?.marital_status
          )?.value || "",
        livingSituation:
          LIVING_SITUATION_OPTIONS.find(
            (livingSituation) =>
              livingSituation.value ===
              faceSheetLongData?.client_info?.living_situation
          )?.value || "",
        dateOfLastCarePlan: DateUtils.formatDateToRequiredFormat(
          faceSheetLongData?.client_info?.last_care_plan_date || ""
        ),
        codeStatus:
          CODE_STATUS_OPTIONS.find(
            (codeStatus) =>
              codeStatus.value === faceSheetLongData?.client_info?.code_status
          )?.value || "",
        ssn: faceSheetLongData?.client_info?.ssn || "",
        hospitalPreference:
          faceSheetLongData?.client_info?.preferred_hospital || "",
        hospitalAddress: faceSheetLongData?.client_info?.hospital_address || "",
        hospitalPhoneNumber:
          faceSheetLongData?.client_info?.hospital_phone || "",
        pharmacyAddress: faceSheetLongData?.client_info?.pharmacy_address || "",
        pharmacyName: faceSheetLongData?.client_info?.pharmacy_name || "",
        pharmacyPhone: faceSheetLongData?.client_info?.pharmacy_phone || "",
        pharmacyFax: faceSheetLongData?.client_info?.pharmacy_fax || "",
        emergencyContactAddress:
          faceSheetLongData?.emergency_contact?.address || "",
        emergencyContactEmail:
          faceSheetLongData?.emergency_contact?.email || "",
        emergencyContactPhone:
          faceSheetLongData?.emergency_contact?.phone || "",
        emergencyContactFirstName:
          faceSheetLongData?.emergency_contact?.first_name || "",
        emergencyContactLastName:
          faceSheetLongData?.emergency_contact?.last_name || "",
        emergencyContactRelationship:
          RELATIONSHIP_TO_CLIENT.find(
            (relationship) =>
              relationship.value ===
              faceSheetLongData?.emergency_contact?.relationship
          )?.value || "",
        providers:
          faceSheetLongData?.healthcare_providers?.map(
            (provider: HealthcareProvider) => ({
              providerName: provider.provider_name || "",
              specialty: provider.specialty,
              address: provider.address || "",
              phone: provider.phone || "",
              fax: provider.fax || "",
              lastVisit: provider.last_visit
                ? DateUtils.formatDateToRequiredFormat(provider.last_visit)
                : "",
              nextVisit: provider.next_visit
                ? DateUtils.formatDateToRequiredFormat(provider.next_visit)
                : "",
              id: provider.id || "",
              providerType: provider.provider_type,
            })
          ) || [],
        medications:
          faceSheetLongData?.medications?.map(
            (medication: ClientMedications) => ({
              medicationName: medication.medication_name || "",
              dose: medication.dosage || "",
              usedToTreat: medication.purpose || "",
              prescriber: medication.prescribing_doctor || "",
              refillDue: medication.refill_due
                ? DateUtils.formatDateToRequiredFormat(medication.refill_due)
                : "",
              id: medication.id || "",
            })
          ) || [],
        diagnoses:
          faceSheetLongData?.medical_info?.diagnoses
            ?.split(", ")
            ?.map((diagnosis: string) => ({
              diagnosis: diagnosis || "",
            })) || [],
        allergies:
          faceSheetLongData?.medical_info?.allergies
            ?.split(", ")
            ?.map((allergen: string) => ({
              allergen: allergen || "",
            })) || [],
        surgicalHistory:
          faceSheetLongData?.medical_info?.surgical_history
            ?.split(", ")
            ?.map((surgicalHistory: string) => ({
              surgicalHistory: surgicalHistory || "",
            })) || [],
        advanceDirective:
          ADVANCE_DIRECTIVE_OPTIONS.find(
            (advanceDirective) =>
              advanceDirective.value ===
              faceSheetLongData?.client_info?.advance_directive
          )?.value || "",
        dpoaName: faceSheetLongData?.short_form?.dpoa || "",
        mpoaName: faceSheetLongData?.short_form?.mpoa || "",
        mpoaAddress: faceSheetLongData?.short_form?.mpoa_address || "",
        mpoaPhone: faceSheetLongData?.short_form?.mpoa_phone || "",
        dpoaAddress: faceSheetLongData?.short_form?.dpoa_address || "",
        dpoaPhone: faceSheetLongData?.short_form?.dpoa_phone || "",
        insurance: faceSheetLongData?.short_form?.insurance || "",
        groupNumber: faceSheetLongData?.short_form?.group_number || "",
        idNumber: faceSheetLongData?.short_form?.id_number || "",
        medicare: faceSheetLongData?.short_form?.medicare || "",
        caregiverAgency: faceSheetLongData?.caregiver_agency?.name || "",
        caregiverAddress: faceSheetLongData?.caregiver_agency?.address || "",
        caregiverDuties:
          faceSheetLongData?.caregiver_agency?.caregiver_duties || "",
        caregiverPhone: faceSheetLongData?.caregiver_agency?.phone || "",
        caregiverPointOfContact:
          faceSheetLongData?.caregiver_agency?.point_of_contact || "",
        caregiverSchedule:
          faceSheetLongData?.caregiver_agency?.caregiver_schedule || "",
        importantInformationForCaregivers:
          faceSheetLongData?.caregiver_agency?.important_information || "",
        homeHealthAgency: faceSheetLongData?.home_health_agency?.name || "",
        homeHealthAddress: faceSheetLongData?.home_health_agency?.address || "",
        homeHealthStartDate:
          faceSheetLongData?.home_health_agency?.start_date || "",
        homeHealthDischargeDate:
          faceSheetLongData?.home_health_agency?.discharge_date || "",
        homeHealthFax: faceSheetLongData?.home_health_agency?.fax || "",
        homeHealthPhone: faceSheetLongData?.home_health_agency?.phone || "",
        homeHealthSchedule:
          faceSheetLongData?.home_health_agency?.schedule || "",
        homeHealthPrescribingDoctor:
          faceSheetLongData?.home_health_agency?.prescribing_doctor || "",
        bloodwork:
          faceSheetLongData?.bloodwork?.map((bloodwork: Bloodwork) => ({
            test: bloodwork.name || "",
            date: bloodwork.date
              ? DateUtils.formatDateToRequiredFormat(bloodwork.date)
              : "",
            results: bloodwork.results || "",
            orderedBy: bloodwork.ordered_by || "",
            repeat: bloodwork.repeat || "",
            id: bloodwork.id || "",
          })) || [],
        vaccinations:
          faceSheetLongData?.vaccinations?.map((item: Vaccine) => ({
            vaccineName: item.name || "",
            date: item.date
              ? DateUtils.formatDateToRequiredFormat(item.date)
              : "",
            nextVaccine: item.next_vaccine
              ? DateUtils.formatDateToRequiredFormat(item.next_vaccine)
              : "",
            id: item.id || "",
          })) || [],
        cognitiveScreeningDate: faceSheetLongData?.medical_info
          ?.last_cognitive_screening
          ? DateUtils.formatDateToRequiredFormat(
              faceSheetLongData?.medical_info?.last_cognitive_screening
            )
          : "",
        cognitiveScreeningScore:
          faceSheetLongData?.medical_info?.cognitive_score?.split("/")[0] || "",
        cognitiveScreeningScoreOutOf:
          faceSheetLongData?.medical_info?.cognitive_score?.split("/")[1] || "",
        notesAndConcerns: faceSheetLongData?.medical_info?.notes || "",
        mentalStatus: faceSheetLongData?.medical_info?.cognitive_status || "",
        dietaryRestrictions:
          faceSheetLongData?.medical_info?.dietary_restrictions
            ?.split(", ")
            ?.map((dietaryRestriction: string) => ({
              dietaryRestrictions: dietaryRestriction || "",
            })) || [],
        medicalConditions:
          faceSheetLongData?.medical_conditions?.map(
            (medicalCondition: MedicalCondition) => ({
              condition: medicalCondition.condition || "",
              onsetDate: medicalCondition.onset_date
                ? DateUtils.formatDateToRequiredFormat(
                    medicalCondition.onset_date,
                    "MM/YYYY"
                  )
                : "",
              notes: medicalCondition.notes || "",
              id: medicalCondition.id || "",
            })
          ) || [],
      };
      reset(formData);

      providersArray.replace(formData.providers);
      medicationsArray.replace(formData.medications);
      diagnosesArray.replace(formData.diagnoses);
      allergiesArray.replace(formData.allergies);
      surgicalHistoryArray.replace(formData.surgicalHistory);
      vaccinationsArray.replace(formData.vaccinations);
      bloodworkArray.replace(formData.bloodwork);
      dietaryRestrictionsArray.replace(formData.dietaryRestrictions);
      medicalConditionsArray.replace(formData.medicalConditions);
    }
    setOpenedFileData({
      ...getValues(),
      last_update: { updatedAt: faceSheetLongData?.last_update?.updatedAt },
    } as unknown as OpenedFileData);
  }, [faceSheetLongData]);

  const onSubmit = (data: FaceSheetLongFormData) => {
    const medications = data.medications?.map((item) => {
      const medication = {
        purpose: item.usedToTreat,
        medication_name: item.medicationName,
        dosage: item.dose,
        id: item?.id,
      };
      if (item.id) {
        return medication;
      } else {
        delete medication.id;
        return medication;
      }
    });
    const providers = data.providers?.map((item) => {
      const provider = {
        provider_type: item?.providerType,
        provider_name: item.providerName ? item.providerName : null,
        specialty: item.specialty ? item.specialty : null,
        address: item.address ? item.address : null,
        phone: item.phone ? item.phone : null,
        last_visit: item.lastVisit
          ? DateUtils.changetoISO(item.lastVisit)
          : null,
        next_visit: item.nextVisit
          ? DateUtils.changetoISO(item.nextVisit)
          : null,
        id: item.id,
      };
      if (item.id) {
        return provider;
      } else {
        delete provider.id;
        delete provider.provider_type;
        return provider;
      }
    });
    const bloodwork = data.bloodwork?.map((item) => {
      const bloodwork = {
        name: item.test ? item.test : null,
        date: item.date ? DateUtils.changetoISO(item.date) : null,
        results: item.results ? item.results : null,
        ordered_by: item.orderedBy ? item.orderedBy : null,
        repeat: item.repeat ? item.repeat : null,
        id: item.id,
      };
      if (item.id) {
        return bloodwork;
      } else {
        delete bloodwork.id;
        return bloodwork;
      }
    });

    const vaccinations = data.vaccinations?.map((item) => {
      const vaccination = {
        name: item.vaccineName ? item.vaccineName : null,
        date: item.date ? DateUtils.changetoISO(item.date) : null,
        next_vaccine: item.nextVaccine
          ? DateUtils.changetoISO(item.nextVaccine)
          : null,
        id: item.id,
      };
      if (item.id) {
        return vaccination;
      } else {
        delete vaccination.id;
        return vaccination;
      }
    });
    const medicalConditions = data.medicalConditions?.map((item) => {
      const medicalCondition = {
        condition: item.condition ? item.condition : null,
        onset_date: item.onsetDate ? DateUtils.changeMonthYearToISO(item.onsetDate) : null,
        notes: item.notes ? item.notes : null,
        id: item.id,
      };
      if (item.id) {
        return medicalCondition;
      } else {
        delete medicalCondition.id;
        return medicalCondition;
      }
    });
    const postData = {
      client_info: {
        first_name: data.firstName,
        last_name: data.lastName,
        address: data.address ? data.address : null,
        ssn: data.ssn ? data.ssn : null,
        date_of_birth: data.dateOfBirth
          ? DateUtils.changetoISO(data.dateOfBirth)
          : null,
        phone: data.phoneNumber ? data.phoneNumber : null,
        preferred_hospital: data.hospitalPreference
          ? data.hospitalPreference
          : null,
        hospital_address: data.hospitalAddress ? data.hospitalAddress : null,
        hospital_phone: data.hospitalPhoneNumber
          ? data.hospitalPhoneNumber
          : null,
        pharmacy_name: data.pharmacyName ? data.pharmacyName : null,
        pharmacy_address: data.pharmacyAddress ? data.pharmacyAddress : null,
        pharmacy_phone: data.pharmacyPhone ? data.pharmacyPhone : null,
        pharmacy_fax: data.pharmacyFax ? data.pharmacyFax : null,
        code_status: data.codeStatus ? data.codeStatus : null,
        advance_directive: data.advanceDirective ? data.advanceDirective : null,
        race: data.race ? data.race : null,
        last_care_plan_date: data.dateOfLastCarePlan
          ? DateUtils.changetoISO(data.dateOfLastCarePlan)
          : null,
        gender: data.gender
          ? GENDER_OPTIONS.find((gender) => gender.value === data.gender)?.value
          : null,
        marital_status: data.maritalStatus
          ? MARITAL_STATUS_OPTIONS.find(
              (maritalStatus) => maritalStatus.value === data.maritalStatus
            )?.value
          : null,
        language: data.language
          ? LANGUAGE_OPTIONS.find(
              (language) => language.value === data.language
            )?.value
          : null,
        living_situation: data.livingSituation
          ? LIVING_SITUATION_OPTIONS.find(
              (livingSituation) =>
                livingSituation.value === data.livingSituation
            )?.value
          : null,
      },

      medical_info: {
        allergies:
          data.allergies && data.allergies.length > 0
            ? data.allergies?.map((allergen) => allergen.allergen).join(", ")
            : null,
        diagnoses:
          data.diagnoses && data.diagnoses.length > 0
            ? data.diagnoses?.map((diagnosis) => diagnosis.diagnosis).join(", ")
            : null,
        surgical_history:
          data.surgicalHistory && data.surgicalHistory.length > 0
            ? data.surgicalHistory
                ?.map((surgicalHistory) => surgicalHistory.surgicalHistory)
                .join(", ")
            : null,
        dietary_restrictions:
          data.dietaryRestrictions && data.dietaryRestrictions.length > 0
            ? data.dietaryRestrictions
                ?.map(
                  (dietaryRestriction) => dietaryRestriction.dietaryRestrictions
                )
                .join(", ")
            : null,
        cognitive_status: data.mentalStatus ? data.mentalStatus : null,
        last_cognitive_screening: data.cognitiveScreeningDate
          ? DateUtils.changetoISO(data.cognitiveScreeningDate)
          : null,
        cognitive_score:
          data.cognitiveScreeningScore && data.cognitiveScreeningScoreOutOf
            ? `${data.cognitiveScreeningScore}/${data.cognitiveScreeningScoreOutOf}`
            : null,
        notes: data.notesAndConcerns ? data.notesAndConcerns : null,
      },

      emergency_contact: {
        first_name: data.emergencyContactFirstName,
        last_name: data.emergencyContactLastName,
        email: data.emergencyContactEmail,
        phone: data.emergencyContactPhone,
        relationship: data.emergencyContactRelationship,
        address: data.emergencyContactAddress,
      },

      medications: medications,

      healthcare_providers: providers,

      vaccinations: vaccinations,

      home_health_agency: {
        name: data.homeHealthAgency ? data.homeHealthAgency : null,
        phone: data.homeHealthPhone ? data.homeHealthPhone : null,
        address: data.homeHealthAddress ? data.homeHealthAddress : null,
        fax: data.homeHealthFax ? data.homeHealthFax : null,
        schedule: data.homeHealthSchedule ? data.homeHealthSchedule : null,
        prescribing_doctor: data.homeHealthPrescribingDoctor
          ? data.homeHealthPrescribingDoctor
          : null,
        start_date: data.homeHealthStartDate
          ? DateUtils.changetoISO(data.homeHealthStartDate)
          : null,
        discharge_date: data.homeHealthDischargeDate
          ? DateUtils.changetoISO(data.homeHealthDischargeDate)
          : null,
      },

      bloodwork: bloodwork,

      caregiver_agency: {
        name: data.caregiverAgency ? data.caregiverAgency : null,
        phone: data.caregiverPhone ? data.caregiverPhone : null,
        address: data.caregiverAddress ? data.caregiverAddress : null,
        point_of_contact: data.caregiverPointOfContact
          ? data.caregiverPointOfContact
          : null,
        caregiver_schedule: data.caregiverSchedule
          ? data.caregiverSchedule
          : null,
        caregiver_duties: data.caregiverDuties ? data.caregiverDuties : null,
        important_information: data.importantInformationForCaregivers
          ? data.importantInformationForCaregivers
          : null,
      },

      short_form: {
        insurance: data.insurance ? data.insurance : null,
        medicare: data.medicare ? data.medicare : null,
        group_number: data.groupNumber ? data.groupNumber : null,
        id_number: data.idNumber ? data.idNumber : null,
        mpoa: data.mpoaName ? data.mpoaName : null,
        mpoa_phone: data.mpoaPhone ? data.mpoaPhone : null,
        mpoa_address: data.mpoaAddress ? data.mpoaAddress : null,
        dpoa: data.dpoaName ? data.dpoaName : null,
        dpoa_phone: data.dpoaPhone ? data.dpoaPhone : null,
        dpoa_address: data.dpoaAddress ? data.dpoaAddress : null,
      },
      medical_conditions: medicalConditions,
    };
    postFaceSheetLongFormMutation.mutate({
      clientId: clientId as string,
      data: postData,
    });
  };

  return isFaceSheetLoading ? (
    <div className="flex justify-center items-center h-screen">
      <CommonLoader />
    </div>
  ) : (
    <div className="min-h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal Information - Enhanced */}
        <PersonalInformationSection
          register={register}
          control={control}
          errors={errors}
        />
        {/* Extended Personal Information */}
        <ExtendedPersonalInformationSection control={control} />
        {/* Emergency Contact */}
        <EmergencyContactSection
          register={register}
          control={control}
          errors={errors}
        />
        {/* Medical Settings */}
        <MedicalSettingsSection
          register={register}
          control={control}
          errors={errors}
        />
        {/* Hospital Preference */}
        <HospitalPreferenceSection
          register={register}
          control={control}
          errors={errors}
        />
        {/* Insurance Information */}
        <InsuranceInformationSection register={register} errors={errors} />
        {/* Pharmacy Information */}
        <PharmacyInformationSection
          register={register}
          control={control}
          errors={errors}
        />
        {/* MPOA/DPOA */}
        <MpoaDpoaSection
          register={register}
          control={control}
          errors={errors}
        />
        {/* Caregiver Agency */}
        <CaregiverAgencySection
          register={register}
          control={control}
          errors={errors}
        />
        {/* Home Health Agency */}
        <HomeHealthAgencySection
          register={register}
          control={control}
          errors={errors}
        />
        {/* Mental Status */}
        <MentalStatusSection
          register={register}
          control={control}
          errors={errors}
        />
        {/* Healthcare Providers */}
        <HealthcareProvidersSection
          register={register}
          control={control}
          errors={errors}
          providersArray={providersArray}
        />
        {/* Medications */}
        <MedicationsSection
          register={register}
          errors={errors}
          medicationsArray={medicationsArray}
        />
        {/* Medical Conditions */}
        <MedicalConditionsSection
          register={register}
          control={control}
          errors={errors}
          medicalConditionsArray={medicalConditionsArray}
        />
        {/* Vaccinations */}
        <VaccinationsSection
          control={control}
          vaccinationsArray={vaccinationsArray}
        />
        {/* Bloodwork */}
        <BloodworkSection
          register={register}
          control={control}
          errors={errors}
          bloodworkArray={bloodworkArray}
        />
        {/* Diagnoses */}
        <DiagnosesSection
          register={register}
          errors={errors}
          diagnosesArray={diagnosesArray}
        />
        {/* Allergies */}
        <AllergiesSection
          register={register}
          errors={errors}
          allergiesArray={allergiesArray}
        />
        {/* Dietary Restrictions */}
        <DietaryRestrictionsSection
          register={register}
          errors={errors}
          dietaryRestrictionsArray={dietaryRestrictionsArray}
        />
        {/* Surgical History */}
        <SurgicalHistorySection
          register={register}
          control={control}
          errors={errors}
          surgicalHistoryArray={surgicalHistoryArray}
        />
        {/* Form Actions */}
        <div className="bg-basicWhite/90 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-all duration-300 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-end gap-4 p-6">
            <PrimaryButton
              isLoading={postFaceSheetLongFormMutation.isPending}
              disabled={postFaceSheetLongFormMutation.isPending}
              type="submit"
              className="sm:!w-fit w-full md:text-base text-sm"
            >
              Save Face Sheet
            </PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FaceSheetLongForm;
