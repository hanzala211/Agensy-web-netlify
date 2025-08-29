import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  inPatientStayNotesFormSchema,
  type InPatientStayNotesFormData,
  type OpenedFileData,
} from "@agensy/types";
import { InPatientStayNotesCol } from "./InPatientStayNotesCol";
import { CommonLoader, PrimaryButton } from "@agensy/components";
import { useParams } from "react-router-dom";
import {
  useGetInPatientStayNotes,
  usePostInPatientStayNotes,
} from "@agensy/api";
import { useEffect } from "react";
import { DateUtils, toast } from "@agensy/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useClientContext } from "@agensy/context";

export const InPatientStayNotes = () => {
  const params = useParams();
  const { setOpenedFileData, setHasUnsavedChanges } = useClientContext();
  const {
    data: inPatientData,
    isFetching: isLoadingInPatient,
    refetch,
  } = useGetInPatientStayNotes(params.clientId!);
  const queryClient = useQueryClient();
  const postInPatientStayNotesMutation = usePostInPatientStayNotes();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    getValues,
  } = useForm<InPatientStayNotesFormData>({
    resolver: zodResolver(inPatientStayNotesFormSchema),
    defaultValues: {
      questionsForProvider1: [{ question: "" }],
      updatesFromProvider1: [{ update: "" }],
      recommendationsNextSteps1: [{ recommendation: "" }],
      questionsForProvider2: [{ question: "" }],
      updatesFromProvider2: [{ update: "" }],
      recommendationsNextSteps2: [{ recommendation: "" }],
    },
  });

  // Watch form changes to detect unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty, setHasUnsavedChanges]);

  const {
    fields: questionsFields1,
    append: appendQuestion1,
    remove: removeQuestion1,
  } = useFieldArray({
    control,
    name: "questionsForProvider1",
  });

  const {
    fields: updatesFields1,
    append: appendUpdate1,
    remove: removeUpdate1,
  } = useFieldArray({
    control,
    name: "updatesFromProvider1",
  });

  const {
    fields: recommendationsFields1,
    append: appendRecommendation1,
    remove: removeRecommendation1,
  } = useFieldArray({
    control,
    name: "recommendationsNextSteps1",
  });

  const {
    fields: questionsFields2,
    append: appendQuestion2,
    remove: removeQuestion2,
  } = useFieldArray({
    control,
    name: "questionsForProvider2",
  });

  const {
    fields: updatesFields2,
    append: appendUpdate2,
    remove: removeUpdate2,
  } = useFieldArray({
    control,
    name: "updatesFromProvider2",
  });

  const {
    fields: recommendationsFields2,
    append: appendRecommendation2,
    remove: removeRecommendation2,
  } = useFieldArray({
    control,
    name: "recommendationsNextSteps2",
  });

  useEffect(() => {
    if (inPatientData && inPatientData?.in_patient_stay_notes) {
      const formData = {
        date1: inPatientData.in_patient_stay_notes?.[0]?.date
          ? DateUtils.formatDateToRequiredFormat(
              inPatientData.in_patient_stay_notes?.[0]?.date
            )
          : "",
        id1: inPatientData.in_patient_stay_notes?.[0]?.id || "",
        facilityName1:
          inPatientData.in_patient_stay_notes?.[0]?.facility_name || "",
        medicalProvider1:
          inPatientData.in_patient_stay_notes?.[0]?.medical_provider || "",
        specialty1: inPatientData.in_patient_stay_notes?.[0]?.specialty || "",
        questionsForProvider1: inPatientData.in_patient_stay_notes?.[0]
          ?.questions_for_provider
          ? inPatientData.in_patient_stay_notes?.[0]?.questions_for_provider
              .split(", ")
              .map((question: string) => ({
                question: question.trim(),
              }))
          : [],
        updatesFromProvider1: inPatientData.in_patient_stay_notes?.[0]
          ?.updates_from_provider
          ? inPatientData.in_patient_stay_notes?.[0]?.updates_from_provider
              .split(", ")
              .map((update: string) => ({
                update: update.trim(),
              }))
          : [],
        recommendationsNextSteps1: inPatientData.in_patient_stay_notes?.[0]
          ?.recommendations_next_steps
          ? inPatientData.in_patient_stay_notes?.[0]?.recommendations_next_steps
              .split(", ")
              .map((recommendation: string) => ({
                recommendation: recommendation.trim(),
              }))
          : [],
        date2: inPatientData.in_patient_stay_notes?.[1]?.date
          ? DateUtils.formatDateToRequiredFormat(
              inPatientData.in_patient_stay_notes?.[1]?.date
            )
          : "",
        id2: inPatientData.in_patient_stay_notes?.[1]?.id || "",
        facilityName2:
          inPatientData.in_patient_stay_notes?.[1]?.facility_name || "",
        medicalProvider2:
          inPatientData.in_patient_stay_notes?.[1]?.medical_provider || "",
        specialty2: inPatientData.in_patient_stay_notes?.[1]?.specialty || "",
        questionsForProvider2: inPatientData.in_patient_stay_notes?.[1]
          ?.questions_for_provider
          ? inPatientData.in_patient_stay_notes?.[1]?.questions_for_provider
              .split(", ")
              .map((question: string) => ({
                question: question.trim(),
              }))
          : [],
        updatesFromProvider2: inPatientData.in_patient_stay_notes?.[1]
          ?.updates_from_provider
          ? inPatientData.in_patient_stay_notes?.[1]?.updates_from_provider
              .split(", ")
              .map((update: string) => ({
                update: update.trim(),
              }))
          : [],
        recommendationsNextSteps2: inPatientData.in_patient_stay_notes?.[1]
          ?.recommendations_next_steps
          ? inPatientData.in_patient_stay_notes?.[1]?.recommendations_next_steps
              .split(", ")
              .map((recommendation: string) => ({
                recommendation: recommendation.trim(),
              }))
          : [],
      };
      reset(formData);
      setOpenedFileData({
        ...getValues(),
        last_update: {
          updatedAt: inPatientData?.last_update?.updatedAt || "",
        },
      } as unknown as OpenedFileData);
    }
  }, [inPatientData?.in_patient_stay_notes]);

  useEffect(() => {
    if (postInPatientStayNotesMutation.status === "success") {
      toast.success(
        "In-Patient Stay Notes Successfully Updated",
        "Your client's in-patient stay notes have been saved and are now up to date."
      );
      queryClient.invalidateQueries({ queryKey: ["client", params.clientId] });
      setHasUnsavedChanges(false);
    } else if (postInPatientStayNotesMutation.status === "error") {
      toast.error(
        "Error Occurred",
        String(postInPatientStayNotesMutation.error)
      );
    }
  }, [postInPatientStayNotesMutation.status, setHasUnsavedChanges]);

  // Cleanup unsaved changes when component unmounts
  useEffect(() => {
    return () => {
      setHasUnsavedChanges(false);
    };
  }, [setHasUnsavedChanges]);

  useEffect(() => {
    refetch();
  }, []);

  const onSubmit = (data: InPatientStayNotesFormData) => {
    console.log("Form data:", data);
    const firstItem = {
      id: data.id1 ? data.id1 : null,
      date: data.date1 ? DateUtils.changetoISO(data.date1) : null,
      facility_name: data.facilityName1 ? data.facilityName1 : null,
      medical_provider: data.medicalProvider1 ? data.medicalProvider1 : null,
      specialty: data.specialty1 ? data.specialty1 : null,
      questions_for_provider:
        data.questionsForProvider1 && data.questionsForProvider1.length > 0
          ? data.questionsForProvider1.map((item) => item.question).join(", ")
              .length > 0
            ? data.questionsForProvider1.map((item) => item.question).join(", ")
            : null
          : null,
      updates_from_provider:
        data.updatesFromProvider1 && data.updatesFromProvider1.length > 0
          ? data.updatesFromProvider1.map((item) => item.update).join(", ")
              .length > 0
            ? data.updatesFromProvider1.map((item) => item.update).join(", ")
            : null
          : null,
      recommendations_next_steps:
        data.recommendationsNextSteps1 &&
        data.recommendationsNextSteps1.length > 0
          ? data.recommendationsNextSteps1
              .map((item) => item.recommendation)
              .join(", ").length > 0
            ? data.recommendationsNextSteps1
                .map((item) => item.recommendation)
                .join(", ")
            : null
          : null,
    };

    if (!firstItem.id) {
      // @ts-expect-error - TODO: fix this
      delete firstItem.id;
    }

    const secondItem = {
      id: data.id2 ? data.id2 : null,
      date: data.date2 ? DateUtils.changetoISO(data.date2) : null,
      facility_name: data.facilityName2 ? data.facilityName2 : null,
      medical_provider: data.medicalProvider2 ? data.medicalProvider2 : null,
      specialty: data.specialty2 ? data.specialty2 : null,
      questions_for_provider:
        data.questionsForProvider2 && data.questionsForProvider2.length > 0
          ? data.questionsForProvider2.map((item) => item.question).join(", ")
              .length > 0
            ? data.questionsForProvider2.map((item) => item.question).join(", ")
            : null
          : null,
      recommendations_next_steps:
        data.recommendationsNextSteps2 &&
        data.recommendationsNextSteps2.length > 0
          ? data.recommendationsNextSteps2
              .map((item) => item.recommendation)
              .join(", ").length > 0
            ? data.recommendationsNextSteps2
                .map((item) => item.recommendation)
                .join(", ")
            : null
          : null,
      updates_from_provider:
        data.updatesFromProvider2 && data.updatesFromProvider2.length > 0
          ? data.updatesFromProvider2.map((item) => item.update).join(", ")
              .length > 0
            ? data.updatesFromProvider2.map((item) => item.update).join(", ")
            : null
          : null,
    };

    if (!secondItem.id) {
      // @ts-expect-error - TODO: fix this
      delete secondItem.id;
    }

    const postData = {
      in_patient_stay_notes: [firstItem, secondItem],
    };
    postInPatientStayNotesMutation.mutate({
      clientId: params.clientId!,
      data: postData,
    });
  };

  if (isLoadingInPatient)
    return (
      <div className="flex justify-center items-center h-screen">
        <CommonLoader />
      </div>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <InPatientStayNotesCol
        register={register}
        control={control}
        errors={errors}
        questionsFields={questionsFields1}
        updatesFields={updatesFields1}
        recommendationsFields={recommendationsFields1}
        appendQuestion={appendQuestion1}
        appendUpdate={appendUpdate1}
        appendRecommendation={appendRecommendation1}
        removeQuestion={removeQuestion1}
        removeUpdate={removeUpdate1}
        removeRecommendation={removeRecommendation1}
        facilityFieldName="facilityName1"
        medicalProviderFieldName="medicalProvider1"
        specialtyFieldName="specialty1"
        dateField="date1"
        questionsFieldName="questionsForProvider1"
        updatesFieldName="updatesFromProvider1"
        recommendationsFieldName="recommendationsNextSteps1"
      />
      <InPatientStayNotesCol
        register={register}
        control={control}
        errors={errors}
        questionsFields={questionsFields2}
        updatesFields={updatesFields2}
        recommendationsFields={recommendationsFields2}
        appendQuestion={appendQuestion2}
        appendUpdate={appendUpdate2}
        appendRecommendation={appendRecommendation2}
        removeQuestion={removeQuestion2}
        removeUpdate={removeUpdate2}
        removeRecommendation={removeRecommendation2}
        facilityFieldName="facilityName2"
        medicalProviderFieldName="medicalProvider2"
        specialtyFieldName="specialty2"
        dateField="date2"
        questionsFieldName="questionsForProvider2"
        updatesFieldName="updatesFromProvider2"
        recommendationsFieldName="recommendationsNextSteps2"
      />
      <div className="flex flex-col sm:flex-row justify-end gap-4 p-6">
        <PrimaryButton
          type="submit"
          isLoading={postInPatientStayNotesMutation.isPending}
          disabled={postInPatientStayNotesMutation.isPending}
          className="sm:!w-fit w-full md:text-base text-sm"
        >
          Save In-Patient Stay Notes
        </PrimaryButton>
      </div>
    </form>
  );
};
