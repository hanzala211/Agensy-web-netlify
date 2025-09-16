import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  Input,
  PrimaryButton,
  TertiaryButton,
  DatePickerField,
  CommonLoader,
} from "@agensy/components";
import { APP_ACTIONS, ICONS } from "@agensy/constants";
import {
  comprehensiveMedicationListSchema,
  type ClientMedications,
  type ComprehensiveMedicationListFormData,
  type OpenedFileData,
} from "@agensy/types";
import { useParams } from "react-router-dom";
import {
  useGetComprehensiveMedicationList,
  usePostComprehensiveMedicationList,
} from "@agensy/api";
import { useEffect } from "react";
import { DateUtils, toast } from "@agensy/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext, useClientContext } from "@agensy/context";

export const ComprehensiveMedicationList = () => {
  const params = useParams();
  const { handleFilterPermission } = useAuthContext();
  const {
    data: comprehensiveMedicationList,
    isFetching: isLoadingChecklist,
    refetch,
  } = useGetComprehensiveMedicationList(params.clientId!);
  const postComprehensiveMedicationList = usePostComprehensiveMedicationList();
  const queryClient = useQueryClient();
  const { setOpenedFileData, setHasUnsavedChanges } = useClientContext();
  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors, isDirty },
  } = useForm<ComprehensiveMedicationListFormData>({
    resolver: zodResolver(comprehensiveMedicationListSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      allergies: [{ allergen: "" }],
      medications: [
        {
          medicationName: "",
          dosage: "",
          frequency: "",
          usedToTreat: "",
          refillDue: "",
          prescriber: "",
          pharmacy: "",
          startDate: "",
          endDate: "",
          sideEffects: "",
        },
      ],
    },
  });

  // Watch form changes to detect unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty, setHasUnsavedChanges]);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (postComprehensiveMedicationList.status === "success") {
      toast.success(
        "Comprehensive Medication and Supplement List Successfully Updated",
        "Your client's comprehensive medication and supplement list has been saved and is now up to date."
      );
      queryClient.invalidateQueries({ queryKey: ["client", params.clientId] });
      setHasUnsavedChanges(false);
    } else if (postComprehensiveMedicationList.status === "error") {
      toast.error(
        "Error Occurred",
        String(postComprehensiveMedicationList.error)
      );
    }
  }, [postComprehensiveMedicationList.status, setHasUnsavedChanges]);

  // Cleanup unsaved changes when component unmounts
  useEffect(() => {
    return () => {
      setHasUnsavedChanges(false);
    };
  }, [setHasUnsavedChanges]);

  const {
    fields: allergiesFields,
    append: appendAllergy,
    remove: removeAllergy,
  } = useFieldArray({
    control,
    name: "allergies",
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
    if (comprehensiveMedicationList) {
      const formData = {
        firstName: comprehensiveMedicationList?.client_info?.first_name || "",
        lastName: comprehensiveMedicationList?.client_info?.last_name || "",
        dateOfBirth: comprehensiveMedicationList?.client_info?.date_of_birth
          ? DateUtils.formatDateToRequiredFormat(
              comprehensiveMedicationList?.client_info?.date_of_birth
            )
          : "",
        allergies: comprehensiveMedicationList?.client_medical.allergies
          ? comprehensiveMedicationList?.client_medical.allergies
              .split(", ")
              .map((item: string) => ({
                allergen: item.trim(),
              }))
          : [],
        medications:
          comprehensiveMedicationList?.medications &&
          comprehensiveMedicationList?.medications.length > 0
            ? comprehensiveMedicationList?.medications.map(
                (item: ClientMedications) => ({
                  medicationName: item.medication_name || "",
                  dosage: item.dosage || "",
                  endDate: item.end_date
                    ? DateUtils.formatDateToRequiredFormat(item.end_date)
                    : "",
                  frequency: item.frequency || "",
                  pharmacy: item.pharmacy || "",
                  prescriber: item.prescribing_doctor || "",
                  purpose: item.purpose || "",
                  refillDue: item.refill_due
                    ? DateUtils.formatDateToRequiredFormat(item.refill_due)
                    : "",
                  sideEffects: item.side_effects || "",
                  startDate: item.start_date
                    ? DateUtils.formatDateToRequiredFormat(item.start_date)
                    : "",
                  medicationId: item.client_medication_id || "",
                  usedToTreat: item.purpose || "",
                })
              )
            : [],
      };
      reset(formData);
      setOpenedFileData({
        ...getValues(),
        last_update: {
          updatedAt: comprehensiveMedicationList?.last_update?.updatedAt || "",
        },
      } as unknown as OpenedFileData);
    }
  }, [comprehensiveMedicationList]);

  const onSubmit = (data: ComprehensiveMedicationListFormData) => {
    console.log("Form data:", data);

    const medications = data.medications?.map((item) => {
      const medication = {
        refill_due: item.refillDue
          ? DateUtils.changetoISO(item.refillDue)
          : null,
        purpose: item.usedToTreat ? item.usedToTreat : null,
        medication_name: item.medicationName ? item.medicationName : null,
        dosage: item.dosage ? item.dosage : null,
        prescribing_doctor: item.prescriber ? item.prescriber : null,
        client_medication_id: item?.medicationId,
        frequency: item.frequency ? item.frequency : null,
        side_effects: item.sideEffects ? item.sideEffects : null,
        start_date: item.startDate
          ? DateUtils.changetoISO(item.startDate)
          : null,
        end_date: item.endDate ? DateUtils.changetoISO(item.endDate) : null,
        pharmacy: item.pharmacy ? item.pharmacy : null,
      };
      if (item.medicationId) {
        return medication;
      } else {
        delete medication.client_medication_id;
        return medication;
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
      client_medical: {
        allergies: data.allergies
          ? data.allergies.map((item) => item.allergen).join(", ").length > 0
            ? data.allergies.map((item) => item.allergen).join(", ")
            : null
          : null,
      },
      medications: medications || [],
    };
    postComprehensiveMedicationList.mutate({
      clientId: params.clientId!,
      data: postData,
    });
  };

  if (isLoadingChecklist)
    return (
      <div className="flex justify-center items-center h-screen">
        <CommonLoader />
      </div>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Personal Information Card */}
      <Card title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="First Name"
            register={register("firstName")}
            error={errors.firstName?.message}
          />
          <Input
            label="Last Name"
            register={register("lastName")}
            error={errors.lastName?.message}
          />
          <DatePickerField
            label="Date of Birth"
            control={control}
            name="dateOfBirth"
          />
        </div>
      </Card>

      {/* Allergies Card */}
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
                    label="Allergen"
                    register={register(`allergies.${index}.allergen`)}
                    error={errors.allergies?.[index]?.allergen?.message}
                    placeholder="e.g., Penicillin, Sulfa drugs, Latex"
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

      {/* Medications Card */}
      <Card
        title="Medications"
        buttonText={<ICONS.plus size={16} />}
        onButtonClick={() =>
          appendMedication({
            medicationName: "",
            dosage: "",
            frequency: "",
            usedToTreat: "",
            refillDue: "",
            prescriber: "",
            pharmacy: "",
            startDate: "",
            endDate: "",
            sideEffects: "",
          })
        }
        ariaLabel="Add Medication"
        showButton={true}
      >
        <div className="space-y-6">
          {medicationsFields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 rounded-lg border border-gray-200"
            >
              <div className="flex items-center mb-4">
                <span className="text-sm font-medium text-gray-700 mr-2">
                  Medication {index + 1}:
                </span>
              </div>

              {/* First row of fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <Input
                  label="Medication"
                  register={register(`medications.${index}.medicationName`)}
                  error={errors.medications?.[index]?.medicationName?.message}
                />
                <Input
                  label="Dose"
                  register={register(`medications.${index}.dosage`)}
                  error={errors.medications?.[index]?.dosage?.message}
                />
                <Input
                  label="Frequency"
                  register={register(`medications.${index}.frequency`)}
                  error={errors.medications?.[index]?.frequency?.message}
                />
                <Input
                  label="Used to Treat"
                  register={register(`medications.${index}.usedToTreat`)}
                  error={errors.medications?.[index]?.usedToTreat?.message}
                />
                <DatePickerField
                  label="Refill Due"
                  control={control}
                  name={`medications.${index}.refillDue`}
                />

                <Input
                  label="Prescriber"
                  register={register(`medications.${index}.prescriber`)}
                  error={errors.medications?.[index]?.prescriber?.message}
                />
                <Input
                  label="Pharmacy"
                  register={register(`medications.${index}.pharmacy`)}
                  error={errors.medications?.[index]?.pharmacy?.message}
                />
                <DatePickerField
                  label="Start Date"
                  control={control}
                  name={`medications.${index}.startDate`}
                />
                <DatePickerField
                  label="End Date"
                  control={control}
                  name={`medications.${index}.endDate`}
                />
                <div className="lg:col-span-3">
                  <Input
                    label="Side Effects"
                    register={register(`medications.${index}.sideEffects`)}
                    error={errors.medications?.[index]?.sideEffects?.message}
                  />
                </div>
              </div>
              {medicationsFields.length > 1 && (
                <div className="flex justify-end">
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

      {/* Submit Button */}
      {handleFilterPermission(
        params.clientId as string,
        APP_ACTIONS.EditAgensyForms
      ) && (
        <div className="bg-basicWhite/90 mt-4 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-all duration-300 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-end gap-4 p-6">
            <PrimaryButton
              type="submit"
              className="sm:!w-fit w-full md:text-base text-sm"
              isLoading={postComprehensiveMedicationList.isPending}
              disabled={postComprehensiveMedicationList.isPending}
            >
              Save Comprehensive Medication and Supplement List
            </PrimaryButton>
          </div>
        </div>
      )}
    </form>
  );
};
