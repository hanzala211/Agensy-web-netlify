import React, { useEffect, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CommonLoader,
  PrimaryButton,
  StickyScrollToTop,
} from "@agensy/components";
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
import { DateUtils, StringUtils, toast } from "@agensy/utils";
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
  COGNITIVE_STATUS,
  APP_ACTIONS,
  SPECIALTIES,
} from "@agensy/constants";
import { useAuthContext, useClientContext } from "@agensy/context";
import { useQueryClient } from "@tanstack/react-query";

const defaultValues = {
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  zip: "",
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
  mentalStatusText: "",
};

const createSafeOpenedFileData = (
  formData: FaceSheetLongFormData,
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

export const FaceSheetLongForm: React.FC = () => {
  const params = useParams();
  const { handleFilterPermission } = useAuthContext();
  const queryClient = useQueryClient();
  const {
    setOpenedFileData,
    ocrResult,
    setOcrResult,
    setHasUnsavedChanges,
    shouldDownloadAfterSave,
    setShouldDownloadAfterSave,
    setHandleSaveAndDownload,
  } = useClientContext();
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
    formState: { errors, isDirty },
    reset,
    setValue,
  } = useForm<FaceSheetLongFormData>({
    resolver: zodResolver(faceSheetLongFormSchema),
    defaultValues,
  });
  // Watch form changes to detect unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  useEffect(() => {
    refetch();
  }, [clientId, refetch]);

  useEffect(() => {
    if (ocrResult && ocrResult.length > 0) {
      const mappedValues = StringUtils.mapExtractedDataToFormValues(
        ocrResult,
        defaultValues,
        getValues()
      );
      console.log(mappedValues);
      Object.entries(mappedValues).forEach(([key, value]) => {
        setValue(key as keyof FaceSheetLongFormData, value);
      });
      setHasUnsavedChanges(true);
      setOcrResult([]);
    }
  }, [ocrResult]);

  useEffect(() => {
    if (postFaceSheetLongFormMutation.status === "success") {
      toast.success(
        "Face Sheet Successfully Updated",
        "Your client's medical information has been saved and is now up to date."
      );
      queryClient.invalidateQueries({ queryKey: ["client", params.clientId] });

      const currentValues = getValues();
      reset(currentValues, { keepDefaultValues: false });

      setOpenedFileData(
        createSafeOpenedFileData(
          currentValues,
          new Date().toISOString()
        ) as unknown as OpenedFileData
      );

      if (shouldDownloadAfterSave) {
        setShouldDownloadAfterSave(false);
        setTimeout(() => {
          StringUtils.triggerPDFDownload();
        }, 500);
      }
    } else if (postFaceSheetLongFormMutation.status === "error") {
      toast.error(
        "Error Occurred",
        String(postFaceSheetLongFormMutation.error)
      );
      // Reset download flag on error
      if (shouldDownloadAfterSave) {
        setShouldDownloadAfterSave(false);
      }
    }
  }, [postFaceSheetLongFormMutation.status]);

  useEffect(() => {
    return () => {
      setHasUnsavedChanges(false);
    };
  }, [setHasUnsavedChanges]);

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
        city: faceSheetLongData?.client_info?.city || "",
        state: faceSheetLongData?.client_info?.state || "",
        zip: faceSheetLongData?.client_info?.zip || "",
        phoneNumber: faceSheetLongData?.client_info?.phone || "",
        preferredName: faceSheetLongData?.client_info?.preferred_name || "",
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
            (provider: HealthcareProvider) => {
              // Check if specialty is in the predefined list
              const isPredefinedSpecialty = SPECIALTIES.some(
                (s) => s.value === provider.specialty
              );

              return {
                providerName: provider.provider_name || "",
                specialty: isPredefinedSpecialty
                  ? provider.specialty
                    ? provider.specialty
                    : ""
                  : "Other",
                specialty_custom: isPredefinedSpecialty
                  ? ""
                  : provider.specialty && provider.specialty.trim() !== ""
                  ? provider.specialty
                  : "",
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
                providerType: provider.provider_type || "",
              };
            }
          ) || [],
        medications:
          faceSheetLongData?.medications?.map(
            (medication: ClientMedications) => ({
              medicationName: medication.medication_name || "",
              dosage: medication.dosage || "",
              purpose: medication.purpose || "",
              prescribingDoctor: medication.prescribing_doctor || "",
              refillDue: medication.refill_due
                ? DateUtils.formatDateToRequiredFormat(medication.refill_due)
                : "",
              id: medication.id || "",
              frequency: medication.frequency || "",
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
        homeHealthStartDate: faceSheetLongData?.home_health_agency?.start_date
          ? DateUtils.formatDateToRequiredFormat(
              faceSheetLongData?.home_health_agency?.start_date
            )
          : "",
        homeHealthDischargeDate: faceSheetLongData?.home_health_agency
          ?.discharge_date
          ? DateUtils.formatDateToRequiredFormat(
              faceSheetLongData?.home_health_agency?.discharge_date
            )
          : "",
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
          faceSheetLongData?.medical_info?.cognitive_score || "",
        test_type: faceSheetLongData?.medical_info?.test_type || "",
        notesAndConcerns: faceSheetLongData?.medical_info?.notes || "",
        mentalStatus: (() => {
          const existing = (
            faceSheetLongData?.medical_info?.cognitive_status || ""
          ).trim();
          if (!existing) return "";
          const tokens = existing.split(", ");
          const valid = new Set(COGNITIVE_STATUS.map((o) => o.value));
          const matched: string[] = [];
          const unmatched: string[] = [];
          tokens.forEach((t: string) => {
            if (valid.has(t)) matched.push(t);
            else if (t.length > 0) unmatched.push(t);
          });
          const selections = [...matched];
          if (unmatched.length > 0) selections.push("Other");
          return selections.join(", ");
        })(),
        mentalStatusText: (() => {
          const existing = (
            faceSheetLongData?.medical_info?.cognitive_status || ""
          ).trim();
          if (!existing) return "";
          const tokens = existing.split(", ");
          const valid = new Set(COGNITIVE_STATUS.map((o) => o.value));
          const unmatched = tokens.filter(
            (t: string) => !valid.has(t) && t.length > 0
          );
          return unmatched.length > 0 ? unmatched.join(", ") : "";
        })(),
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
    setOpenedFileData(
      createSafeOpenedFileData(
        getValues(),
        faceSheetLongData?.last_update?.updatedAt
      ) as unknown as OpenedFileData
    );
  }, [faceSheetLongData]);

  const onSubmit = useCallback(
    (data: FaceSheetLongFormData) => {
      const medications = data.medications?.map((item) => {
        const medication = {
          purpose: item.purpose ? item.purpose : null,
          medication_name: item.medicationName ? item.medicationName : null,
          dosage: item.dosage ? item.dosage : null,
          id: item?.id,
          frequency: item.frequency ? item.frequency : null,
          prescribing_doctor: item.prescribingDoctor
            ? item.prescribingDoctor
            : null,
          refill_due: item.refillDue
            ? DateUtils.changetoISO(item.refillDue)
            : null,
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
          specialty:
            item.specialty === "Other"
              ? item.specialty_custom && item.specialty_custom.trim() !== ""
                ? item.specialty_custom
                : null
              : item.specialty
              ? item.specialty
              : null,
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
        if (provider.provider_type?.length === 0) {
          delete provider.provider_type;
        }
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
          onset_date: item.onsetDate
            ? DateUtils.changeMonthYearToISO(item.onsetDate)
            : null,
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
          city: data.city ? data.city : null,
          state: data.state ? data.state : null,
          zip: data.zip ? data.zip : null,
          preferred_name: data.preferredName ? data.preferredName : null,
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
          advance_directive: data.advanceDirective
            ? data.advanceDirective
            : null,
          race: data.race ? data.race : null,
          last_care_plan_date: data.dateOfLastCarePlan
            ? DateUtils.changetoISO(data.dateOfLastCarePlan)
            : null,
          gender: data.gender
            ? GENDER_OPTIONS.find((gender) => gender.value === data.gender)
                ?.value
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
          allergies: StringUtils.filterAndJoinWithCommas(
            data.allergies,
            (allergies) => allergies.allergen || ""
          ),
          diagnoses: StringUtils.filterAndJoinWithCommas(
            data.diagnoses,
            (diagnoses) => diagnoses.diagnosis || ""
          ),
          surgical_history: StringUtils.filterAndJoinWithCommas(
            data.surgicalHistory,
            (surgicalHistory) => surgicalHistory.surgicalHistory || ""
          ),
          dietary_restrictions: StringUtils.filterAndJoinWithCommas(
            data.dietaryRestrictions,
            (dietaryRestrictions) =>
              dietaryRestrictions.dietaryRestrictions || ""
          ),
          cognitive_status: (() => {
            const raw = (data.mentalStatus || "").trim();
            if (!raw) return null;
            const tokens = raw.split(", ");
            const replaced = tokens.map((t) =>
              t === "Other"
                ? data.mentalStatusText?.trim()
                  ? data.mentalStatusText.trim()
                  : "Other"
                : t
            );
            const joined = replaced.join(", ");
            return joined.length > 0 ? joined : null;
          })(),
          last_cognitive_screening: data.cognitiveScreeningDate
            ? DateUtils.changetoISO(data.cognitiveScreeningDate)
            : null,
          cognitive_score: data.cognitiveScreeningScore
            ? data.cognitiveScreeningScore
            : null,
          notes: data.notesAndConcerns ? data.notesAndConcerns : null,
          test_type: data.test_type ? data.test_type : null,
        },

        emergency_contact: {
          first_name: data.emergencyContactFirstName
            ? data.emergencyContactFirstName
            : null,
          last_name: data.emergencyContactLastName
            ? data.emergencyContactLastName
            : null,
          email: data.emergencyContactEmail ? data.emergencyContactEmail : null,
          phone: data.emergencyContactPhone ? data.emergencyContactPhone : null,
          relationship: data.emergencyContactRelationship
            ? data.emergencyContactRelationship
            : null,
          address: data.emergencyContactAddress
            ? data.emergencyContactAddress
            : null,
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
    },
    [postFaceSheetLongFormMutation, clientId]
  );

  const handleSaveAndDownload = useCallback(() => {
    setShouldDownloadAfterSave(true);
    handleSubmit(onSubmit)();
  }, []);

  // Register the save function with context
  useEffect(() => {
    setHandleSaveAndDownload(() => handleSaveAndDownload);
    return () => setHandleSaveAndDownload(undefined);
  }, []);

  return isFaceSheetLoading ? (
    <div className="flex justify-center items-center h-screen">
      <CommonLoader />
    </div>
  ) : (
    <div className="min-h-screen">
      <form
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
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
          control={control}
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
        {handleFilterPermission(
          clientId as string,
          APP_ACTIONS.EditAgensyForms
        ) && (
          <div className="bg-basicWhite/90 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-all duration-300 overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-end gap-4 p-6">
              <PrimaryButton
                isLoading={postFaceSheetLongFormMutation.isPending}
                disabled={postFaceSheetLongFormMutation.isPending}
                type="submit"
                className="sm:!w-fit w-full md:text-base text-sm"
              >
                Save Face Sheet Long Form
              </PrimaryButton>
            </div>
          </div>
        )}
      </form>

      <StickyScrollToTop />
    </div>
  );
};

export default FaceSheetLongForm;
