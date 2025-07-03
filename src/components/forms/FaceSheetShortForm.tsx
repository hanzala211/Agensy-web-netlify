import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrimaryButton, SecondaryButton } from "@agensy/components";
import {
  faceSheetShortFormSchema,
  type FaceSheetShortFormData,
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

export const FaceSheetShortForm: React.FC = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FaceSheetShortFormData>({
    resolver: zodResolver(faceSheetShortFormSchema),
    defaultValues: {
      providers: [
        {
          providerName: "",
          specialty: "",
          address: "",
          phone: "",
          fax: "",
          lastVisit: "",
          nextVisit: "",
        },
      ],
      medications: [
        {
          medicationName: "",
          dose: "",
          usedToTreat: "",
          prescriber: "",
          refillDue: "",
        },
      ],
      diagnoses: [{ diagnosis: "" }],
      allergies: [{ allergen: "" }],
      surgicalHistory: [{ surgicalHistory: "" }],
    },
  });

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

  const onSubmit = (data: FaceSheetShortFormData) => {
    console.log("Face Sheet Data:", data);
  };

  const handleReset = () => {
    reset();
  };

  return (
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
        <InsuranceInformationSection
          register={register}
          errors={errors}
        />

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
        <div className="flex justify-end gap-4 pt-8 border-t bg-white p-6 rounded-lg">
          <SecondaryButton type="button" onClick={handleReset}>
            Reset Form
          </SecondaryButton>
          <PrimaryButton type="submit" className="!w-fit">
            Save Face Sheet
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};
