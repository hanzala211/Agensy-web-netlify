import React, { useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommonLoader, PrimaryButton } from "@agensy/components";
import {
  faceSheetShortFormSchema,
  type ClientMedications,
  type FaceSheetShortFormData,
  type HealthcareProvider,
  type OpenedFileData,
} from "@agensy/types";
import { PersonalInformationSection } from "./PersonalInformationSection";
import { EmergencyContactSection } from "./EmergencyContactSection";
import { MedicalSettingsSection } from "./MedicalSettingsSection";
import { HospitalPreferenceSection } from "./HospitalPreferenceSection";
import { InsuranceInformationSection } from "./InsuranceInformationSection";
import { PharmacyInformationSection } from "./PharmacyInformationSection";
import { MpoaDpoaSection } from "./MpoaDpoaSection";
import { HealthcareProvidersSection } from "./HealthcareProvidersSection";
import { MedicationsSection } from "./MedicationsSection";
import { DiagnosesSection } from "./DiagnosesSection";
import { AllergiesSection } from "./AllergiesSection";
import { SurgicalHistorySection } from "./SurgicalHistorySection";
import { useParams } from "react-router-dom";
import {
  useGetFaceSheetShortForm,
  usePostFaceSheetShortFormMutation,
} from "@agensy/api";
import {
  ADVANCE_DIRECTIVE_OPTIONS,
  RELATIONSHIP_TO_CLIENT,
  CODE_STATUS_OPTIONS,
} from "@agensy/constants";
import { DateUtils, StringUtils, toast } from "@agensy/utils";
import { useClientContext } from "@agensy/context";
import { useQueryClient } from "@tanstack/react-query";

const defaultValues = {
  firstName: "",
  lastName: "",
  address: "",
  phoneNumber: "",
  dateOfBirth: "",
  ssn: "",
  codeStatus: "",
  hospitalPreference: "",
  hospitalAddress: "",
  hospitalPhoneNumber: "",
  insurance: "",
  groupNumber: "",
  idNumber: "",
  medicare: "",
  pharmacyName: "",
  pharmacyAddress: "",
  pharmacyPhone: "",
  pharmacyFax: "",
  emergencyContactFirstName: "",
  emergencyContactLastName: "",
  emergencyContactPhone: "",
  emergencyContactRelationship: "",
  emergencyContactAddress: "",
  advanceDirective: "",
  dpoaName: "",
  mpoaName: "",
  mpoaAddress: "",
  mpoaPhone: "",
  dpoaAddress: "",
  dpoaPhone: "",
  providers: [],
  medications: [],
  diagnoses: [],
  allergies: [],
  surgicalHistory: [],
  emergencyContactEmail: "",
};

export const FaceSheetShortForm: React.FC = () => {
  const { clientId } = useParams();
  const queryClient = useQueryClient();
  const { setOpenedFileData, ocrResult, setOcrResult } = useClientContext();
  const {
    data: faceSheetShortForm,
    refetch,
    isFetching: isFaceSheetLoading,
  } = useGetFaceSheetShortForm(clientId!);
  const postFaceSheetShortFormMutation = usePostFaceSheetShortFormMutation();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm<FaceSheetShortFormData>({
    resolver: zodResolver(faceSheetShortFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (ocrResult && ocrResult.length > 0) {
      const mappedValues = StringUtils.mapExtractedDataToFormValues(
        ocrResult,
        defaultValues
      );

      Object.entries(mappedValues).forEach(([key, value]) => {
        setValue(key as keyof FaceSheetShortFormData, value);
      });
      setOcrResult([]);
    }
  }, [ocrResult]);

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

  useEffect(() => {
    refetch();
  }, [clientId, refetch]);

  useEffect(() => {
    if (postFaceSheetShortFormMutation.status === "success") {
      toast.success(
        "Face Sheet Successfully Updated",
        "Your client's medical information has been saved and is now up to date."
      );
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
    } else if (postFaceSheetShortFormMutation.status === "error") {
      toast.error(
        "Error Occurred",
        String(postFaceSheetShortFormMutation.error)
      );
    }
  }, [postFaceSheetShortFormMutation.status]);

  const formValues = useWatch({ control });

  useEffect(() => {
    if (formValues && Object.keys(formValues).length > 0) {
      setOpenedFileData({
        ...formValues,
        last_update: { updatedAt: faceSheetShortForm?.last_update?.updatedAt },
      } as unknown as OpenedFileData);
    } else {
      setOpenedFileData({
        ...getValues(),
        last_update: { updatedAt: faceSheetShortForm?.last_update?.updatedAt },
      } as unknown as OpenedFileData);
    }
  }, [formValues]);

  useEffect(() => {
    if (faceSheetShortForm) {
      const formData = {
        firstName: faceSheetShortForm?.client_info?.first_name || "",
        lastName: faceSheetShortForm?.client_info?.last_name || "",
        address: faceSheetShortForm?.client_info?.address || "",
        phoneNumber: faceSheetShortForm?.client_info?.phone || "",
        dateOfBirth: faceSheetShortForm?.client_info?.date_of_birth
          ? DateUtils.formatDateToRequiredFormat(
              faceSheetShortForm?.client_info?.date_of_birth
            )
          : "",
        codeStatus:
          CODE_STATUS_OPTIONS.find(
            (codeStatus) =>
              codeStatus.value === faceSheetShortForm?.client_info?.code_status
          )?.value || "",
        ssn: faceSheetShortForm?.client_info?.ssn || "",
        hospitalPreference:
          faceSheetShortForm?.client_info?.preferred_hospital || "",
        hospitalAddress:
          faceSheetShortForm?.client_info?.hospital_address || "",
        hospitalPhoneNumber:
          faceSheetShortForm?.client_info?.hospital_phone || "",
        pharmacyAddress:
          faceSheetShortForm?.client_info?.pharmacy_address || "",
        pharmacyName: faceSheetShortForm?.client_info?.pharmacy_name || "",
        pharmacyPhone: faceSheetShortForm?.client_info?.pharmacy_phone || "",
        pharmacyFax: faceSheetShortForm?.client_info?.pharmacy_fax || "",
        emergencyContactAddress:
          faceSheetShortForm?.emergency_contact?.address || "",
        emergencyContactEmail:
          faceSheetShortForm?.emergency_contact?.email || "",
        emergencyContactPhone:
          faceSheetShortForm?.emergency_contact?.phone || "",
        emergencyContactFirstName:
          faceSheetShortForm?.emergency_contact?.first_name || "",
        emergencyContactLastName:
          faceSheetShortForm?.emergency_contact?.last_name || "",
        emergencyContactRelationship:
          RELATIONSHIP_TO_CLIENT.find(
            (relationship) =>
              relationship.value ===
              faceSheetShortForm?.emergency_contact?.relationship
          )?.value || "",
        providers:
          faceSheetShortForm?.healthcare_providers?.map(
            (provider: HealthcareProvider) => ({
              providerName: provider.provider_name || "",
              specialty: provider.specialty || "",
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
            })
          ) || [],
        medications:
          faceSheetShortForm?.medications?.map(
            (medication: ClientMedications) => ({
              medicationName: medication.medication_name || "",
              dose: medication.dosage || "",
              usedToTreat: medication.purpose || "",
              prescriber: medication.prescribing_doctor || "",
              refillDue: medication?.refill_due
                ? DateUtils.formatDateToRequiredFormat(medication.refill_due)
                : "",
              id: medication.id || "",
            })
          ) || [],
        diagnoses:
          faceSheetShortForm?.medical_info?.diagnoses
            ?.split(", ")
            ?.map((diagnosis: string) => ({
              diagnosis: diagnosis || "",
            })) || [],
        allergies:
          faceSheetShortForm?.medical_info?.allergies
            ?.split(", ")
            ?.map((allergen: string) => ({
              allergen: allergen || "",
            })) || [],
        surgicalHistory:
          faceSheetShortForm?.medical_info?.surgical_history
            ?.split(", ")
            ?.map((surgicalHistory: string) => ({
              surgicalHistory: surgicalHistory || "",
            })) || [],
        advanceDirective:
          ADVANCE_DIRECTIVE_OPTIONS.find(
            (advanceDirective) =>
              advanceDirective.value ===
              faceSheetShortForm?.client_info?.advance_directive
          )?.value || "",
        dpoaName: faceSheetShortForm?.short_form?.dpoa || "",
        mpoaName: faceSheetShortForm?.short_form?.mpoa || "",
        mpoaAddress: faceSheetShortForm?.short_form?.mpoa_address || "",
        mpoaPhone: faceSheetShortForm?.short_form?.mpoa_phone || "",
        dpoaAddress: faceSheetShortForm?.short_form?.dpoa_address || "",
        dpoaPhone: faceSheetShortForm?.short_form?.dpoa_phone || "",
        insurance: faceSheetShortForm?.short_form?.insurance || "",
        groupNumber: faceSheetShortForm?.short_form?.group_number || "",
        idNumber: faceSheetShortForm?.short_form?.id_number || "",
        medicare: faceSheetShortForm?.short_form?.medicare || "",
      };

      reset(formData);

      providersArray.replace(formData.providers);
      medicationsArray.replace(formData.medications);
      diagnosesArray.replace(formData.diagnoses);
      allergiesArray.replace(formData.allergies);
      surgicalHistoryArray.replace(formData.surgicalHistory);
    }
    setOpenedFileData({
      ...getValues(),
      last_update: { updatedAt: faceSheetShortForm?.last_update?.updatedAt },
    } as unknown as OpenedFileData);
  }, [faceSheetShortForm]);

  const onSubmit = (data: FaceSheetShortFormData) => {
    const medications = data.medications?.map((item) => {
      const medication = {
        refill_due: item.refillDue
          ? DateUtils.changetoISO(item.refillDue)
          : null,
        purpose: item.usedToTreat ? item.usedToTreat : null,
        medication_name: item.medicationName ? item.medicationName : null,
        dosage: item.dose ? item.dose : null,
        prescribing_doctor: item.prescriber ? item.prescriber : null,
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
        provider_type: item.providerType,
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
      },

      medical_info: {
        allergies: StringUtils.filterAndJoinWithCommas(
          data.allergies,
          (allergies) => allergies.allergen || ""
        ),
        diagnoses: StringUtils.filterAndJoinWithCommas(
          data.diagnoses,
          (diagnosis) => diagnosis.diagnosis || ""
        ),
        surgical_history: StringUtils.filterAndJoinWithCommas(
          data.surgicalHistory,
          (surgicalHistory) => surgicalHistory.surgicalHistory || ""
        ),
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
      medications,
      healthcare_providers: providers,
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
    };
    postFaceSheetShortFormMutation.mutate({
      clientId: clientId!,
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
        {/* Personal Information Section */}
        <PersonalInformationSection
          register={register}
          control={control}
          errors={errors}
        />

        {/* Emergency Contact Section */}
        <EmergencyContactSection
          register={register}
          control={control}
          errors={errors}
        />

        {/* Medical Settings Section */}
        <MedicalSettingsSection
          register={register}
          control={control}
          errors={errors}
        />

        {/* Hospital Preference Section */}
        <HospitalPreferenceSection
          register={register}
          control={control}
          errors={errors}
        />

        {/* Insurance Section */}
        <InsuranceInformationSection register={register} errors={errors} />

        {/* Pharmacy Section */}
        <PharmacyInformationSection
          register={register}
          control={control}
          errors={errors}
        />

        {/* MPOA/DPOA Section */}
        <MpoaDpoaSection
          register={register}
          control={control}
          errors={errors}
        />

        {/* Healthcare Providers Section */}
        <HealthcareProvidersSection
          register={register}
          control={control}
          errors={errors}
          providersArray={providersArray}
        />

        {/* Medications Section */}
        <MedicationsSection
          register={register}
          control={control}
          errors={errors}
          medicationsArray={medicationsArray}
        />

        {/* Diagnoses Section */}
        <DiagnosesSection
          register={register}
          errors={errors}
          diagnosesArray={diagnosesArray}
        />

        {/* Allergies Section */}
        <AllergiesSection
          register={register}
          errors={errors}
          allergiesArray={allergiesArray}
        />

        {/* Surgical History Section */}
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
              isLoading={postFaceSheetShortFormMutation.isPending}
              disabled={postFaceSheetShortFormMutation.isPending}
              type="submit"
              className="sm:!w-fit w-full md:text-base text-sm"
            >
              Save Face Sheet Short Form
            </PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
};
