import React, { useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PrimaryButton,
  Card,
  Input,
  DatePickerField,
  CommonLoader,
  TextArea,
  TertiaryButton,
  Select,
} from "@agensy/components";
import {
  medicalAppointmentTemplateSchema,
  type ClientMedications,
  type HealthcareProvider,
  type MedicalAppointmentTemplateData,
  type OpenedFileData,
} from "@agensy/types";
import { useParams } from "react-router-dom";
import {
  useGetMedicalAppointmentTemplate,
  usePostMedicalAppointmentTemplateMutation,
} from "@agensy/api";
import { ICONS, SPECIALTIES } from "@agensy/constants";
import { DateUtils, toast } from "@agensy/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useClientContext } from "@agensy/context";

const defaultValues: MedicalAppointmentTemplateData = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  height: "",
  weight: "",
  blood_pressure: "",
  temperature: "",
  heart_rate: "",
  additional_vitals: "",
  reason_for_visit: "",
  top_3_concerns: "",
  tests_labs_imaging: "",
  visit_notes: "",
  diagnoses: [],
  allergies: [],
  surgical_history: [],
  medications: [],
  healthcareProviders: [
    {
      providerName: "",
      specialty: "",
      address: "",
    },
  ],
  recommendations: "",
  referrals: "",
  follow_up: "",
  report_given_to: "",
};

export const MedicalAppointmentTemplate: React.FC = () => {
  const queryClient = useQueryClient();
  const { setOpenedFileData } = useClientContext();
  const { clientId } = useParams();
  const {
    data: medicalAppointmentTemplate,
    isFetching: isFetchingMedicalAppointmentTemplate,
    refetch,
  } = useGetMedicalAppointmentTemplate(clientId as string);
  const postMedicalAppointmentTemplateMutation =
    usePostMedicalAppointmentTemplateMutation();

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (postMedicalAppointmentTemplateMutation.status === "success") {
      toast.success(
        "Medical Appointment Template Successfully Saved",
        "The medical appointment template has been saved successfully."
      );
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
    } else if (postMedicalAppointmentTemplateMutation.status === "error") {
      toast.error(
        "Error Occurred",
        String(postMedicalAppointmentTemplateMutation.error)
      );
    }
  }, [postMedicalAppointmentTemplateMutation.status]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<MedicalAppointmentTemplateData>({
    resolver: zodResolver(medicalAppointmentTemplateSchema),
    defaultValues,
  });

  const formValues = useWatch({ control });

  useEffect(() => {
    if (formValues && Object.keys(formValues).length > 0) {
      setOpenedFileData({
        ...formValues,
        last_update: {
          updatedAt: medicalAppointmentTemplate?.last_update?.updatedAt,
        },
      } as unknown as OpenedFileData);
    } else {
      setOpenedFileData({
        ...getValues(),
        last_update: {
          updatedAt: medicalAppointmentTemplate?.last_update?.updatedAt,
        },
      } as unknown as OpenedFileData);
    }
  }, [formValues]);

  const {
    fields: healthcareProviders,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "healthcareProviders",
  });

  const {
    fields: diagnosesFields,
    append: appendDiagnosis,
    remove: removeDiagnosis,
  } = useFieldArray({
    control,
    name: "diagnoses",
  });

  const {
    fields: allergiesFields,
    append: appendAllergy,
    remove: removeAllergy,
  } = useFieldArray({
    control,
    name: "allergies",
  });

  const {
    fields: surgicalHistoryFields,
    append: appendSurgicalHistory,
    remove: removeSurgicalHistory,
  } = useFieldArray({
    control,
    name: "surgical_history",
  });

  const {
    fields: medicationsFields,
    append: appendMedication,
    remove: removeMedication,
  } = useFieldArray({
    control,
    name: "medications",
  });

  useEffect(() => {
    if (medicalAppointmentTemplate) {
      const formattedData = {
        ...medicalAppointmentTemplate,
        firstName: medicalAppointmentTemplate?.client_info?.first_name || "",
        lastName: medicalAppointmentTemplate?.client_info?.last_name || "",
        dateOfBirth: medicalAppointmentTemplate?.client_info?.date_of_birth
          ? DateUtils.formatDateToRequiredFormat(
              medicalAppointmentTemplate?.client_info.date_of_birth
            )
          : "",
        date: medicalAppointmentTemplate?.medical_template?.date
          ? DateUtils.formatDateToRequiredFormat(
              medicalAppointmentTemplate?.medical_template.date
            )
          : "",
        // Format dates in medications array
        medications:
          medicalAppointmentTemplate?.medications?.map(
            (med: ClientMedications) => ({
              start_date: med.start_date
                ? DateUtils.formatDateToRequiredFormat(med.start_date)
                : "",
              end_date: med.end_date
                ? DateUtils.formatDateToRequiredFormat(med.end_date)
                : "",
              frequency: med.frequency || "",
              medication_name: med.medication_name || "",
              prescribing_doctor: med.prescribing_doctor || "",
              dosage: med.dosage || "",
              notes: med.notes || "",
              id: med.id || "",
            })
          ) || [],
        // Format dates in healthcareProviders array
        healthcareProviders:
          medicalAppointmentTemplate?.healthcare_providers?.map(
            (provider: HealthcareProvider) => ({
              follow_up: provider.follow_up
                ? DateUtils.formatDateToRequiredFormat(provider.follow_up)
                : "",
              providerName: provider.provider_name || "",
              address: provider.address || "",
              phone: provider.phone || "",
              notes: provider.notes || "",
              specialty: provider.specialty || "",
              id: provider.id || "",
            })
          ) || [],
        height: medicalAppointmentTemplate?.medical_info?.height || "",
        weight: medicalAppointmentTemplate?.medical_info?.weight || "",
        blood_pressure:
          medicalAppointmentTemplate?.medical_info?.blood_pressure || "",
        temperature:
          medicalAppointmentTemplate?.medical_info?.temperature || "",
        heart_rate: medicalAppointmentTemplate?.medical_info?.heart_rate || "",
        additional_vitals:
          medicalAppointmentTemplate?.medical_info?.additional_vitals || "",
        reason_for_visit:
          medicalAppointmentTemplate?.medical_template?.reason_for_visit || "",
        top_3_concerns:
          medicalAppointmentTemplate?.medical_template?.top_3_concerns || "",
        tests_labs_imaging:
          medicalAppointmentTemplate?.medical_template?.tests_labs_imaging ||
          "",
        visit_notes:
          medicalAppointmentTemplate?.medical_template?.visit_notes || "",
        diagnoses:
          medicalAppointmentTemplate?.medical_info?.diagnoses &&
          medicalAppointmentTemplate?.medical_info?.diagnoses.length > 0
            ? medicalAppointmentTemplate?.medical_info?.diagnoses
                .split(", ")
                .map((diagnosis: string) => ({ diagnosis }))
            : [],
        allergies:
          medicalAppointmentTemplate?.medical_info?.allergies &&
          medicalAppointmentTemplate?.medical_info?.allergies.length > 0
            ? medicalAppointmentTemplate?.medical_info?.allergies
                .split(", ")
                .map((allergen: string) => ({ allergen }))
            : [],
        surgical_history:
          medicalAppointmentTemplate?.medical_info?.surgical_history &&
          medicalAppointmentTemplate?.medical_info?.surgical_history.length > 0
            ? medicalAppointmentTemplate?.medical_info?.surgical_history
                .split(", ")
                .map((surgicalHistory: string) => ({ surgicalHistory }))
            : [],
        recommendations:
          medicalAppointmentTemplate?.medical_template?.recommendations || "",
        referrals:
          medicalAppointmentTemplate?.medical_template?.referrals || "",
        follow_up: medicalAppointmentTemplate?.medical_template?.follow_up
          ? DateUtils.formatDateToRequiredFormat(
              medicalAppointmentTemplate?.medical_template.follow_up
            )
          : "",
        report_given_to:
          medicalAppointmentTemplate?.medical_template?.report_given_to || "",
      };

      reset(formattedData);
    }
  }, [medicalAppointmentTemplate, reset]);

  const onSubmit = (data: MedicalAppointmentTemplateData) => {
    console.log(data);
    const medications =
      data.medications &&
      data.medications.map((item) => {
        if (item.id) {
          return {
            medication_name: item.medication_name ? item.medication_name : null,
            dosage: item.dosage ? item.dosage : null,
            frequency: item.frequency ? item.frequency : null,
            notes: item.notes ? item.notes : null,
            prescribing_doctor: item.prescribing_doctor
              ? item.prescribing_doctor
              : null,
            start_date: item.start_date
              ? DateUtils.changetoISO(item.start_date)
              : null,
            end_date: item.end_date
              ? DateUtils.changetoISO(item.end_date)
              : null,
            id: item.id,
          };
        } else {
          return {
            medication_name: item.medication_name ? item.medication_name : null,
            dosage: item.dosage ? item.dosage : null,
            frequency: item.frequency ? item.frequency : null,
            notes: item.notes ? item.notes : null,
            prescribing_doctor: item.prescribing_doctor
              ? item.prescribing_doctor
              : null,
            start_date: item.start_date
              ? DateUtils.changetoISO(item.start_date)
              : null,
            end_date: item.end_date
              ? DateUtils.changetoISO(item.end_date)
              : null,
          };
        }
      });

    const providers =
      data.healthcareProviders &&
      data.healthcareProviders.length > 0 &&
      data.healthcareProviders.map((item) => {
        if (item.id) {
          return {
            provider_name: item.providerName ? item.providerName : null,
            address: item.address ? item.address : null,
            phone: item.phone ? item.phone : null,
            notes: item.notes ? item.notes : null,
            follow_up: item.follow_up
              ? DateUtils.changetoISO(item.follow_up)
              : null,
            specialty: item.specialty ? item.specialty : null,
            id: item.id,
          };
        } else {
          return {
            provider_name: item.providerName ? item.providerName : null,
            address: item.address ? item.address : null,
            phone: item.phone ? item.phone : null,
            notes: item.notes ? item.notes : null,
            follow_up: item.follow_up
              ? DateUtils.changetoISO(item.follow_up)
              : null,
            specialty: item.specialty ? item.specialty : null,
          };
        }
      });

    const postData = {
      client_info: {
        first_name: data.firstName ? data.firstName : null,
        last_name: data.lastName ? data.lastName : null,
        date_of_birth: data.dateOfBirth
          ? DateUtils.changetoISO(data.dateOfBirth)
          : null,
      },
      medical_info: {
        diagnoses:
          data.diagnoses && data.diagnoses.length > 0
            ? data.diagnoses.map((item) => item.diagnosis).join(", ")
            : null,
        allergies:
          data.allergies && data.allergies.length > 0
            ? data.allergies.map((item) => item.allergen).join(", ")
            : null,
        surgical_history:
          data.surgical_history && data.surgical_history.length > 0
            ? data.surgical_history
                .map((item) => item.surgicalHistory)
                .join(", ")
            : null,
        height: data.height ? data.height : null,
        weight: data.weight ? data.weight : null,
        blood_pressure: data.blood_pressure ? data.blood_pressure : null,
        temperature: data.temperature ? data.temperature : null,
        heart_rate: data.heart_rate ? data.heart_rate : null,
        additional_vitals: data.additional_vitals
          ? data.additional_vitals
          : null,
      },
      medications: medications || [],
      healthcare_providers: providers || [],
      medical_template: {
        date: data.date ? DateUtils.changetoISO(data.date) : null,
        reason_for_visit: data.reason_for_visit ? data.reason_for_visit : null,
        top_3_concerns: data.top_3_concerns ? data.top_3_concerns : null,
        tests_labs_imaging: data.tests_labs_imaging
          ? data.tests_labs_imaging
          : null,
        visit_notes: data.visit_notes ? data.visit_notes : null,
        recommendations: data.recommendations ? data.recommendations : null,
        referrals: data.referrals ? data.referrals : null,
        follow_up: data.follow_up
          ? DateUtils.changetoISO(data.follow_up)
          : null,
        report_given_to: data.report_given_to ? data.report_given_to : null,
      },
    };
    postMedicalAppointmentTemplateMutation.mutate({
      clientId: clientId!,
      data: postData,
    });
  };

  const addHealthcareProvider = () => {
    append({
      providerName: "",
      address: "",
      phone: "",
      notes: "",
      follow_up: "",
      specialty: "",
    });
  };

  if (isFetchingMedicalAppointmentTemplate) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CommonLoader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card title="Personal Information">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Firstname"
                  type="text"
                  register={register("firstName")}
                  error={errors.firstName?.message}
                />
              </div>
              <div>
                <Input
                  label="Lastname"
                  type="text"
                  register={register("lastName")}
                  error={errors.lastName?.message}
                />
              </div>
              <div>
                <DatePickerField control={control} label="Date" name="date" />
              </div>
              <div>
                <DatePickerField
                  control={control}
                  label="Date of Birth"
                  name="dateOfBirth"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card title="Vital Signs">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Height"
                  type="text"
                  register={register("height")}
                  error={errors.height?.message}
                />
              </div>

              <div>
                <Input
                  label="Weight"
                  type="text"
                  register={register("weight")}
                  error={errors.weight?.message}
                />
              </div>

              <div>
                <Input
                  label="Blood Pressure"
                  type="text"
                  register={register("blood_pressure")}
                  error={errors.blood_pressure?.message}
                />
              </div>

              <div>
                <Input
                  label="Temperature"
                  type="text"
                  register={register("temperature")}
                  error={errors.temperature?.message}
                />
              </div>

              <div>
                <Input
                  label="Heart Rate"
                  type="text"
                  register={register("heart_rate")}
                  error={errors.heart_rate?.message}
                />
              </div>

              <div>
                <Input
                  label="Additional Vitals"
                  type="text"
                  register={register("additional_vitals")}
                  error={errors.additional_vitals?.message}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card title="Visit Information">
          <div className="space-y-4">
            <div>
              <TextArea
                label="Reason for Visit"
                register={register("reason_for_visit")}
                error={errors.reason_for_visit?.message}
                rows={3}
              />
            </div>

            <div>
              <TextArea
                label="Top 3 Concerns"
                register={register("top_3_concerns")}
                error={errors.top_3_concerns?.message}
                rows={3}
              />
            </div>

            <div>
              <TextArea
                label="Tests / Labs / Imaging"
                register={register("tests_labs_imaging")}
                error={errors.tests_labs_imaging?.message}
                rows={3}
              />
            </div>

            <div>
              <TextArea
                label="Visit Notes"
                register={register("visit_notes")}
                error={errors.visit_notes?.message}
                rows={4}
              />
            </div>
          </div>
        </Card>

        <Card
          title="Diagnoses"
          buttonText={<ICONS.plus size={16} />}
          onButtonClick={() =>
            appendDiagnosis({
              diagnosis: "",
            })
          }
          ariaLabel="Add Diagnosis"
          showButton={true}
        >
          <div className="space-y-6">
            {diagnosesFields.map((field, index) => (
              <div key={field.id} className="p-3 rounded-lg border">
                <div className="w-full flex gap-4 items-center">
                  <div className="w-full">
                    <Input
                      register={register(`diagnoses.${index}.diagnosis`)}
                      error={errors.diagnoses?.[index]?.diagnosis?.message}
                    />
                  </div>
                  {diagnosesFields.length > 1 && (
                    <TertiaryButton
                      type="button"
                      onClick={() => removeDiagnosis(index)}
                      className="text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      <ICONS.delete />
                    </TertiaryButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Allergies"
          buttonText={<ICONS.plus size={16} />}
          onButtonClick={() =>
            appendAllergy({
              allergen: "",
            })
          }
          ariaLabel="Add Allergy"
          showButton={true}
        >
          <div className="space-y-6">
            {allergiesFields.map((field, index) => (
              <div key={field.id} className="p-3 rounded-lg border">
                <div className="w-full flex gap-4 items-center">
                  <div className="w-full">
                    <Input
                      register={register(`allergies.${index}.allergen`)}
                      error={errors.allergies?.[index]?.allergen?.message}
                    />
                  </div>
                  {allergiesFields.length > 1 && (
                    <TertiaryButton
                      type="button"
                      onClick={() => removeAllergy(index)}
                      className="text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      <ICONS.delete />
                    </TertiaryButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Surgical History"
          buttonText={<ICONS.plus size={16} />}
          onButtonClick={() =>
            appendSurgicalHistory({
              surgicalHistory: "",
            })
          }
          ariaLabel="Add Surgical History"
          showButton={true}
        >
          <div className="space-y-6">
            {surgicalHistoryFields.map((field, index) => (
              <div key={field.id} className="p-3 rounded-lg border">
                <div className="w-full flex gap-4 items-center">
                  <div className="w-full">
                    <Input
                      register={register(
                        `surgical_history.${index}.surgicalHistory`
                      )}
                      error={
                        errors.surgical_history?.[index]?.surgicalHistory
                          ?.message
                      }
                    />
                  </div>
                  {surgicalHistoryFields.length > 1 && (
                    <TertiaryButton
                      type="button"
                      onClick={() => removeSurgicalHistory(index)}
                      className="text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      <ICONS.delete />
                    </TertiaryButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Medications"
          buttonText={<ICONS.plus size={16} />}
          onButtonClick={() =>
            appendMedication({
              medication_name: "",
              dosage: "",
              frequency: "",
              notes: "",
              prescribing_doctor: "",
              start_date: "",
              end_date: "",
            })
          }
          ariaLabel="Add Medication"
          showButton={true}
        >
          <div className="space-y-6">
            {medicationsFields.map((field, index) => (
              <div key={field.id} className="p-3 rounded-lg border">
                <div className="w-full flex gap-4 items-center">
                  <div className="w-full grid md:grid-cols-2 gap-4">
                    <Input
                      label="Medication Name"
                      register={register(
                        `medications.${index}.medication_name`
                      )}
                      error={
                        errors.medications?.[index]?.medication_name?.message
                      }
                    />

                    <Input
                      label="Dosage"
                      register={register(`medications.${index}.dosage`)}
                      error={errors.medications?.[index]?.dosage?.message}
                    />

                    <Input
                      label="Frequency"
                      register={register(`medications.${index}.frequency`)}
                      error={errors.medications?.[index]?.frequency?.message}
                    />

                    <Input
                      label="Prescribing Doctor"
                      register={register(
                        `medications.${index}.prescribing_doctor`
                      )}
                      error={
                        errors.medications?.[index]?.prescribing_doctor?.message
                      }
                    />

                    <div className="md:col-span-2">
                      <DatePickerField
                        label="Start Date"
                        name={`medications.${index}.start_date`}
                        control={control}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <DatePickerField
                        label="End Date"
                        name={`medications.${index}.end_date`}
                        control={control}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <TextArea
                        label="Notes"
                        register={register(`medications.${index}.notes`)}
                        error={errors.medications?.[index]?.notes?.message}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                {medicationsFields.length > 1 && (
                  <div className="flex justify-end mt-3">
                    <TertiaryButton
                      type="button"
                      onClick={() => removeMedication(index)}
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

        <Card
          title="Healthcare Providers"
          buttonText={<ICONS.plus size={16} />}
          onButtonClick={addHealthcareProvider}
          ariaLabel="Add Healthcare Provider"
          showButton={true}
        >
          <div className="space-y-6">
            {healthcareProviders.map((field, index) => (
              <div key={field.id} className="p-3 rounded-lg border">
                <div className="w-full flex gap-4 items-center">
                  <div className="w-full grid md:grid-cols-2 gap-4">
                    <Input
                      label="Provider Name"
                      register={register(
                        `healthcareProviders.${index}.providerName`
                      )}
                      error={
                        errors.healthcareProviders?.[index]?.providerName
                          ?.message
                      }
                    />

                    <Select
                      label="Specialty"
                      control={control}
                      name={`healthcareProviders.${index}.specialty`}
                      data={SPECIALTIES}
                      labelOption="Select Specialty"
                    />

                    <Input
                      label="Address"
                      register={register(
                        `healthcareProviders.${index}.address`
                      )}
                      error={
                        errors.healthcareProviders?.[index]?.address?.message
                      }
                    />

                    <Input
                      label="Phone"
                      type="tel"
                      register={register(`healthcareProviders.${index}.phone`)}
                      error={
                        errors.healthcareProviders?.[index]?.phone?.message
                      }
                    />
                    <div className="md:col-span-2">
                      <DatePickerField
                        label="Follow-up"
                        name={`healthcareProviders.${index}.follow_up`}
                        control={control}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <TextArea
                        label="Notes"
                        register={register(
                          `healthcareProviders.${index}.notes`
                        )}
                        error={
                          errors.healthcareProviders?.[index]?.notes?.message
                        }
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                {healthcareProviders.length > 1 && (
                  <div className="flex justify-end mt-3">
                    <TertiaryButton
                      type="button"
                      onClick={() => remove(index)}
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

        <Card title="Recommendations & Follow-up">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <TextArea
                  label="Recommendations"
                  register={register("recommendations")}
                  error={errors.recommendations?.message}
                  rows={4}
                />
              </div>

              <div>
                <TextArea
                  label="Referrals"
                  register={register("referrals")}
                  error={errors.referrals?.message}
                  rows={3}
                />
              </div>

              <div>
                <DatePickerField
                  label="Follow-up"
                  name="follow_up"
                  control={control}
                />
              </div>

              <div>
                <TextArea
                  label="Report Given To"
                  register={register("report_given_to")}
                  error={errors.report_given_to?.message}
                  rows={3}
                />
              </div>
            </div>
          </div>
        </Card>
        <div className="bg-basicWhite/90 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-all duration-300 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-end gap-4 p-6">
            <PrimaryButton
              isLoading={postMedicalAppointmentTemplateMutation.isPending}
              disabled={postMedicalAppointmentTemplateMutation.isPending}
              type="submit"
              className="sm:!w-fit w-full md:text-base text-sm"
            >
              Save Medical Appointment Template
            </PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
};
