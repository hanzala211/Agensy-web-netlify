import React, { useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PrimaryButton,
  Card,
  Input,
  TextArea,
  PhoneNumberInput,
  DatePickerField,
  TertiaryButton,
  CommonLoader,
} from "@agensy/components";
import {
  healthHistoryFormSchema,
  type ClientMedications,
  type HealthHistoryFormData,
  type OpenedFileData,
} from "@agensy/types";

import { DateUtils, toast } from "@agensy/utils";
import { ICONS } from "@agensy/constants";
import { DiagnosesSection } from "../face-sheet-short/DiagnosesSection";
import { useParams } from "react-router-dom";
import {
  useGetHealthHistoryForm,
  usePostHealthHistoryFormMutation,
} from "@agensy/api";
import { useClientContext } from "@agensy/context";

const defaultValues: HealthHistoryFormData = {
  diagnoses: [
    {
      diagnosis: "",
    },
  ],
  medicationsStarted: [
    {
      medicationName: "",
      dosage: "",
      prescribingDoctor: "",
      id: "",
    },
  ],
  medicationsEnded: [
    {
      medicationName: "",
      dosage: "",
      prescribingDoctor: "",
      id: "",
    },
  ],
  providerName: "",
  providerAddress: "",
  providerPhone: "",
  providerNotes: "",
  providerFollowUp: "",
  homeHealthName: "",
  homeHealthPhone: "",
  homeHealthAddress: "",
  homeHealthFax: "",
  homeHealthServiceReceived: "",
  homeHealthStartDate: "",
  homeHealthDischargeDate: "",
  admittingDiagnosis: "",
  hospitalizationTreatment: "",
  whatWorked: "",
  healthHistoryDate: "",
  healthHistoryNotes: "",
  descriptionOfHealthConcern: "",
  onsetOfSymptoms: "",
  frequencyOfSymptoms: "",
  severityOfSymptoms: "",
};

export const HealthHistoryForm: React.FC = () => {
  const { clientId } = useParams();
  const { setOpenedFileData } = useClientContext();
  const {
    data: healthHistoryForm,
    isFetching: isFetchingHealthHistoryForm,
    refetch,
  } = useGetHealthHistoryForm(clientId as string);
  const postHealthHistoryMutation = usePostHealthHistoryFormMutation();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<HealthHistoryFormData>({
    resolver: zodResolver(healthHistoryFormSchema),
    defaultValues,
  });

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (postHealthHistoryMutation.status === "success") {
      toast.success(
        "Health History Successfully Saved",
        "The health history information has been saved successfully."
      );
    } else if (postHealthHistoryMutation.status === "error") {
      toast.error("Error Occurred", String(postHealthHistoryMutation.error));
    }
  }, [postHealthHistoryMutation.status]);

  const formValues = useWatch({ control });

  useEffect(() => {
    if (formValues && Object.keys(formValues).length > 0) {
      setOpenedFileData({
        ...formValues,
        last_update: { updatedAt: healthHistoryForm?.last_update?.updatedAt },
      } as unknown as OpenedFileData);
    } else {
      setOpenedFileData({
        ...getValues(),
        last_update: { updatedAt: healthHistoryForm?.last_update?.updatedAt },
      } as unknown as OpenedFileData);
    }
  }, [formValues]);

  const medicationsStartedArray = useFieldArray({
    control,
    name: "medicationsStarted",
  });

  const medicationsEndedArray = useFieldArray({
    control,
    name: "medicationsEnded",
  });

  const diagnosesArray = useFieldArray({
    control,
    name: "diagnoses",
  });

  const onSubmit = (data: HealthHistoryFormData) => {
    const medicationsStarted = data.medicationsStarted?.map((item) => {
      const medication = {
        medication_name: item.medicationName ? item.medicationName : null,
        dosage: item.dosage ? item.dosage : null,
        prescribing_doctor: item.prescribingDoctor
          ? item.prescribingDoctor
          : null,
        id: item?.id,
      };
      if (item.id) {
        return medication;
      } else {
        delete medication.id;
        return medication;
      }
    });
    const medicationsEnded = data.medicationsEnded?.map((item) => {
      const medication = {
        medication_name: item.medicationName ? item.medicationName : null,
        dosage: item.dosage ? item.dosage : null,
        prescribing_doctor: item.prescribingDoctor
          ? item.prescribingDoctor
          : null,
        id: item?.id,
      };
      if (item.id) {
        return medication;
      } else {
        delete medication.id;
        return medication;
      }
    });
    const postData = {
      medical_info: {
        diagnoses:
          data.diagnoses && data.diagnoses.length > 0
            ? data.diagnoses?.map((diagnosis) => diagnosis.diagnosis).join(", ")
            : null,
      },
      medications: [...(medicationsStarted || []), ...(medicationsEnded || [])],
      healthcare_providers: {
        provider_name: data.providerName ? data.providerName : null,
        address: data.providerAddress ? data.providerAddress : null,
        phone: data.providerPhone ? data.providerPhone : null,
        notes: data.providerNotes ? data.providerNotes : null,
        follow_up: data.providerFollowUp
          ? DateUtils.changetoISO(data.providerFollowUp)
          : null,
      },
      home_health_agency: {
        name: data.homeHealthName ? data.homeHealthName : null,
        phone: data.homeHealthPhone ? data.homeHealthPhone : null,
        address: data.homeHealthAddress ? data.homeHealthAddress : null,
        fax: data.homeHealthFax ? data.homeHealthFax : null,
        service_received: data.homeHealthServiceReceived
          ? data.homeHealthServiceReceived
          : null,
        start_date: data.homeHealthStartDate
          ? DateUtils.changetoISO(data.homeHealthStartDate)
          : null,
        discharge_date: data.homeHealthDischargeDate
          ? DateUtils.changetoISO(data.homeHealthDischargeDate)
          : null,
      },
      hospitalization: {
        admitting_diagnosis: data.admittingDiagnosis
          ? data.admittingDiagnosis
          : null,
        treatment: data.hospitalizationTreatment
          ? data.hospitalizationTreatment
          : null,
      },
      health_history: {
        what_worked: data.whatWorked ? data.whatWorked : null,
        date: data.healthHistoryDate
          ? DateUtils.changetoISO(data.healthHistoryDate)
          : null,
        notes: data.healthHistoryNotes ? data.healthHistoryNotes : null,
        description_of_health_concern: data.descriptionOfHealthConcern
          ? data.descriptionOfHealthConcern
          : null,
        onset_of_symptoms: data.onsetOfSymptoms ? data.onsetOfSymptoms : null,
        frequency_of_symptoms: data.frequencyOfSymptoms
          ? data.frequencyOfSymptoms
          : null,
        severity_of_symptoms: data.severityOfSymptoms
          ? data.severityOfSymptoms
          : null,
      },
    };
    postHealthHistoryMutation.mutate({
      clientId: clientId as string,
      data: postData,
    });
  };

  useEffect(() => {
    if (healthHistoryForm) {
      reset({
        healthHistoryDate: healthHistoryForm?.health_history?.date
          ? DateUtils.formatDateToRequiredFormat(
              healthHistoryForm?.health_history?.date
            )
          : "",
        healthHistoryNotes: healthHistoryForm?.health_history?.notes || "",
        frequencyOfSymptoms:
          healthHistoryForm?.health_history?.frequency_of_symptoms || "",
        severityOfSymptoms:
          healthHistoryForm?.health_history?.severity_of_symptoms || "",
        whatWorked: healthHistoryForm?.health_history?.what_worked || "",
        onsetOfSymptoms:
          healthHistoryForm?.health_history?.onset_of_symptoms || "",
        descriptionOfHealthConcern:
          healthHistoryForm?.health_history?.description_of_health_concern ||
          "",
        providerName:
          healthHistoryForm?.healthcare_providers?.provider_name || "",
        providerAddress: healthHistoryForm?.healthcare_providers?.address || "",
        providerPhone: healthHistoryForm?.healthcare_providers?.phone || "",
        providerFollowUp: healthHistoryForm?.healthcare_providers?.follow_up
          ? DateUtils.formatDateToRequiredFormat(
              healthHistoryForm?.healthcare_providers?.follow_up
            )
          : "",
        providerNotes: healthHistoryForm?.healthcare_providers?.notes || "",
        homeHealthName: healthHistoryForm?.home_health_agency?.name || "",
        homeHealthPhone: healthHistoryForm?.home_health_agency?.phone || "",
        homeHealthFax: healthHistoryForm?.home_health_agency?.fax || "",
        homeHealthAddress: healthHistoryForm?.home_health_agency?.address || "",
        homeHealthDischargeDate: healthHistoryForm?.home_health_agency
          ?.discharge_date
          ? DateUtils.formatDateToRequiredFormat(
              healthHistoryForm?.home_health_agency?.discharge_date
            )
          : "",
        homeHealthServiceReceived:
          healthHistoryForm?.home_health_agency?.service_received || "",
        homeHealthStartDate: healthHistoryForm?.home_health_agency?.start_date
          ? DateUtils.formatDateToRequiredFormat(
              healthHistoryForm?.home_health_agency?.start_date
            )
          : "",
        admittingDiagnosis:
          healthHistoryForm?.hospitalization?.admitting_diagnosis || "",
        hospitalizationTreatment:
          healthHistoryForm?.hospitalization?.treatment || "",
        diagnoses:
          healthHistoryForm?.medical_info?.diagnoses
            ?.split(",")
            ?.map((diagnosis: string) => ({
              diagnosis: diagnosis || "",
            })) || [],
        medicationsStarted:
          healthHistoryForm?.medications
            ?.filter(
              (medication: ClientMedications) =>
                medication.start_date &&
                new Date(medication.start_date) <= new Date() &&
                (!medication.end_date ||
                  new Date(medication.end_date) >= new Date())
            )
            ?.map((medication: ClientMedications) => ({
              medicationName: medication.medication_name || "",
              dosage: medication.dosage || "",
              prescribingDoctor: medication.prescribing_doctor || "",
              startDate: medication.start_date
                ? DateUtils.formatDateToRequiredFormat(medication.start_date)
                : "",
              endDate: medication.end_date
                ? DateUtils.formatDateToRequiredFormat(medication.end_date)
                : "",
              id: medication.id,
            })) || [],
        medicationsEnded:
          healthHistoryForm?.medications
            ?.filter(
              (medication: ClientMedications) =>
                medication.end_date &&
                new Date(medication.end_date) < new Date()
            )
            ?.map((medication: ClientMedications) => ({
              medicationName: medication.medication_name || "",
              dosage: medication.dosage || "",
              prescribingDoctor: medication.prescribing_doctor || "",
              startDate: medication.start_date
                ? DateUtils.formatDateToRequiredFormat(medication.start_date)
                : "",
              endDate: medication.end_date
                ? DateUtils.formatDateToRequiredFormat(medication.end_date)
                : "",
              id: medication.id || "",
            })) || [],
      });
      setOpenedFileData({
        ...getValues(),
        last_update: { updatedAt: healthHistoryForm?.last_update?.updatedAt },
      } as unknown as OpenedFileData);
    }
  }, [healthHistoryForm]);

  return isFetchingHealthHistoryForm ? (
    <div className="flex justify-center items-center h-screen">
      <CommonLoader />
    </div>
  ) : (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Medical Information Section */}
        <DiagnosesSection
          register={register}
          errors={errors}
          diagnosesArray={diagnosesArray}
        />

        {/* Medications Started Section */}
        <Card
          title="Medications Started"
          buttonText={<ICONS.plus size={16} />}
          onButtonClick={() =>
            medicationsStartedArray.append({
              medicationName: "",
              dosage: "",
              prescribingDoctor: "",
              id: "",
            })
          }
          ariaLabel="Add Started Medication"
          showButton={true}
        >
          <div className="space-y-6">
            {medicationsStartedArray.fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 rounded-lg border border-gray-200"
              >
                <div className="grid md:grid-cols-3 gap-4">
                  <Input
                    label="Medication Name"
                    register={register(
                      `medicationsStarted.${index}.medicationName`
                    )}
                    error={
                      errors.medicationsStarted?.[index]?.medicationName
                        ?.message
                    }
                  />
                  <Input
                    label="Dosage"
                    register={register(`medicationsStarted.${index}.dosage`)}
                    error={errors.medicationsStarted?.[index]?.dosage?.message}
                  />
                  <Input
                    label="Prescribing Doctor"
                    register={register(
                      `medicationsStarted.${index}.prescribingDoctor`
                    )}
                    error={
                      errors.medicationsStarted?.[index]?.prescribingDoctor
                        ?.message
                    }
                  />
                </div>
                {medicationsStartedArray.fields.length > 1 && (
                  <div className="flex justify-end mt-4">
                    <TertiaryButton
                      type="button"
                      onClick={() => medicationsStartedArray.remove(index)}
                      className="text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      <ICONS.delete />
                    </TertiaryButton>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Medications Ended Section */}
        <Card
          title="Medications Ended"
          buttonText={<ICONS.plus size={16} />}
          onButtonClick={() =>
            medicationsEndedArray.append({
              medicationName: "",
              dosage: "",
              prescribingDoctor: "",
              id: "",
            })
          }
          ariaLabel="Add Ended Medication"
          showButton={true}
        >
          <div className="space-y-6">
            {medicationsEndedArray.fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 rounded-lg border border-gray-200"
              >
                <div className="grid md:grid-cols-3 gap-4">
                  <Input
                    label="Medication Name"
                    register={register(
                      `medicationsEnded.${index}.medicationName`
                    )}
                    error={
                      errors.medicationsEnded?.[index]?.medicationName?.message
                    }
                  />
                  <Input
                    label="Dosage"
                    register={register(`medicationsEnded.${index}.dosage`)}
                    error={errors.medicationsEnded?.[index]?.dosage?.message}
                  />
                  <Input
                    label="Prescribing Doctor"
                    register={register(
                      `medicationsEnded.${index}.prescribingDoctor`
                    )}
                    error={
                      errors.medicationsEnded?.[index]?.prescribingDoctor
                        ?.message
                    }
                  />
                </div>
                {medicationsEndedArray.fields.length > 1 && (
                  <div className="flex justify-end mt-4">
                    <TertiaryButton
                      type="button"
                      onClick={() => medicationsEndedArray.remove(index)}
                      className="text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      <ICONS.delete />
                    </TertiaryButton>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Healthcare Provider Section */}
        <Card title="Healthcare Provider">
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Provider Name"
                register={register("providerName")}
                error={errors.providerName?.message}
              />
              <PhoneNumberInput
                label="Phone"
                control={control}
                name="providerPhone"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Address"
                register={register("providerAddress")}
                error={errors.providerAddress?.message}
              />
              <DatePickerField
                control={control}
                name="providerFollowUp"
                label="Follow-up Schedule"
              />
            </div>
            <TextArea
              label="Notes"
              register={register("providerNotes")}
              error={errors.providerNotes?.message}
              rows={3}
            />
          </div>
        </Card>

        {/* Home Health Agency Section */}
        <Card title="Home Health Agency">
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Agency Name"
                register={register("homeHealthName")}
                error={errors.homeHealthName?.message}
              />
              <PhoneNumberInput
                label="Phone"
                control={control}
                name="homeHealthPhone"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Address"
                register={register("homeHealthAddress")}
                error={errors.homeHealthAddress?.message}
              />
              <PhoneNumberInput
                label="Fax"
                control={control}
                name="homeHealthFax"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <DatePickerField
                control={control}
                name="homeHealthStartDate"
                label="Start Date"
              />
              <DatePickerField
                control={control}
                name="homeHealthDischargeDate"
                label="Discharge Date"
              />
            </div>
            <TextArea
              label="Service Received"
              register={register("homeHealthServiceReceived")}
              error={errors.homeHealthServiceReceived?.message}
              rows={3}
            />
          </div>
        </Card>

        {/* Hospitalization Section */}
        <Card title="Hospitalization History">
          <div className="space-y-4">
            <TextArea
              label="Admitting Diagnosis"
              register={register("admittingDiagnosis")}
              error={errors.admittingDiagnosis?.message}
              rows={3}
            />
            <TextArea
              label="Treatment Received"
              register={register("hospitalizationTreatment")}
              error={errors.hospitalizationTreatment?.message}
              rows={4}
            />
          </div>
        </Card>

        {/* Health History Details Section */}
        <Card title="Health History Details">
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Input
                label="Onset of Symptoms"
                register={register("onsetOfSymptoms")}
                error={errors.onsetOfSymptoms?.message}
              />
              <Input
                label="Frequency of Symptoms"
                register={register("frequencyOfSymptoms")}
                error={errors.frequencyOfSymptoms?.message}
              />
              <Input
                label="Severity of Symptoms"
                register={register("severityOfSymptoms")}
                error={errors.severityOfSymptoms?.message}
              />
            </div>
            <DatePickerField
              control={control}
              name="healthHistoryDate"
              label="Date"
            />

            <TextArea
              label="What Worked"
              register={register("whatWorked")}
              error={errors.whatWorked?.message}
              rows={3}
            />
            <TextArea
              label="Description of Health Concern"
              register={register("descriptionOfHealthConcern")}
              error={errors.descriptionOfHealthConcern?.message}
              rows={3}
            />
            <TextArea
              label="Notes"
              register={register("healthHistoryNotes")}
              error={errors.healthHistoryNotes?.message}
              rows={3}
            />
          </div>
        </Card>

        {/* Form Actions */}
        <div className="bg-basicWhite/90 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-all duration-300 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-end gap-4 p-6">
            <PrimaryButton
              isLoading={postHealthHistoryMutation.isPending}
              disabled={postHealthHistoryMutation.isPending}
              type="submit"
              className="sm:!w-fit w-full md:text-base text-sm"
            >
              Save Health History
            </PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
};
