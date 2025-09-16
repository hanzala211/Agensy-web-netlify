import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  inPatientStayNotesFormSchema,
  type InPatientStayNotesFormData,
  type OpenedFileData,
} from "@agensy/types";
import { InPatientStayNotesCard } from "./InPatientStayNotesCard";
import {
  Card,
  CommonLoader,
  DatePickerField,
  Input,
  PrimaryButton,
} from "@agensy/components";
import { ICONS } from "@agensy/constants";
import { useParams } from "react-router-dom";
import {
  useGetInPatientStayNotes,
  usePostInPatientStayNotes,
} from "@agensy/api";
import { useEffect } from "react";
import { DateUtils, toast } from "@agensy/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext, useClientContext } from "@agensy/context";
import { APP_ACTIONS } from "@agensy/constants";

export const InPatientStayNotes = () => {
  const params = useParams();
  const { setOpenedFileData, setHasUnsavedChanges } = useClientContext();
  const {
    data: inPatientData,
    isFetching: isLoadingInPatient,
    refetch,
  } = useGetInPatientStayNotes(params.clientId!);
  const { handleFilterPermission } = useAuthContext();
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
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      inPatientStayNotes: [],
    },
  });
  // Watch form changes to detect unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty, setHasUnsavedChanges]);
  const {
    fields: inPatientStayNotesFields,
    append: appendInPatientStayNote,
    remove: removeInPatientStayNote,
  } = useFieldArray({
    control,
    name: "inPatientStayNotes",
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapPatientDataToFormData = (inPatientData: any) => {
    const mappedInPatientStayNotes = inPatientData.in_patient_stay_notes.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (note: any) => ({
        id: note?.id || "",
        date: note?.date ? DateUtils.formatDateToRequiredFormat(note.date) : "",
        facilityName: note?.facility_name || "",
        medicalProvider: note?.medical_provider || "",
        specialty: note?.specialty || "",
        questionsForProvider: note?.questions_for_provider
          ? note.questions_for_provider.split(", ").map((question: string) => ({
              question: question.trim(),
            }))
          : [],
        updatesFromProvider: note?.updates_from_provider
          ? note.updates_from_provider.split(", ").map((update: string) => ({
              update: update.trim(),
            }))
          : [],
        recommendationsNextSteps: note?.recommendations_next_steps
          ? note.recommendations_next_steps
              .split(", ")
              .map((recommendation: string) => ({
                recommendation: recommendation.trim(),
              }))
          : [],
      })
    );

    const formData = {
      firstName: inPatientData.client_info?.first_name || "",
      lastName: inPatientData.client_info?.last_name || "",
      dateOfBirth: inPatientData.client_info?.date_of_birth
        ? DateUtils.formatDateToRequiredFormat(
            inPatientData.client_info?.date_of_birth
          )
        : "",
      inPatientStayNotes: mappedInPatientStayNotes,
    };
    return formData;
  };

  useEffect(() => {
    if (inPatientData && inPatientData?.in_patient_stay_notes) {
      const formData = mapPatientDataToFormData(inPatientData);
      reset(formData as unknown as InPatientStayNotesFormData);
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
      const formData = mapPatientDataToFormData(
        postInPatientStayNotesMutation.data
      );
      reset(formData as unknown as InPatientStayNotesFormData);
      setOpenedFileData({
        ...formData,
        last_update: {
          updatedAt:
            postInPatientStayNotesMutation.data?.last_update?.updatedAt || "",
        },
      } as unknown as OpenedFileData);
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

    const mappedInPatientStayNotes =
      data.inPatientStayNotes?.map((note) => {
        const item = {
          id: note.id ? note.id : null,
          date: note.date ? DateUtils.changetoISO(note.date) : null,
          facility_name: note.facilityName ? note.facilityName : null,
          medical_provider: note.medicalProvider ? note.medicalProvider : null,
          specialty: note.specialty ? note.specialty : null,
          questions_for_provider:
            note.questionsForProvider && note.questionsForProvider.length > 0
              ? note.questionsForProvider
                  .map((item) => item.question)
                  .join(", ").length > 0
                ? note.questionsForProvider
                    .map((item) => item.question)
                    .join(", ")
                : null
              : null,
          updates_from_provider:
            note.updatesFromProvider && note.updatesFromProvider.length > 0
              ? note.updatesFromProvider.map((item) => item.update).join(", ")
                  .length > 0
                ? note.updatesFromProvider.map((item) => item.update).join(", ")
                : null
              : null,
          recommendations_next_steps:
            note.recommendationsNextSteps &&
            note.recommendationsNextSteps.length > 0
              ? note.recommendationsNextSteps
                  .map((item) => item.recommendation)
                  .join(", ").length > 0
                ? note.recommendationsNextSteps
                    .map((item) => item.recommendation)
                    .join(", ")
                : null
              : null,
        };

        if (!item.id) {
          // @ts-expect-error - TODO: fix this
          delete item.id;
        }

        return item;
      }) || [];

    const postData = {
      in_patient_stay_notes: mappedInPatientStayNotes,
      client_info: {
        first_name: data.firstName ? data.firstName : null,
        last_name: data.lastName ? data.lastName : null,
        date_of_birth: data.dateOfBirth
          ? DateUtils.changetoISO(data.dateOfBirth)
          : null,
      },
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

  const addNewInPatientStayNote = () => {
    appendInPatientStayNote({
      id: "",
      date: "",
      facilityName: "",
      medicalProvider: "",
      specialty: "",
      questionsForProvider: [],
      updatesFromProvider: [],
      recommendationsNextSteps: [],
    });
  };

  return (
    <div className="bg-gray-50 w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card title="Personal Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="First Name:"
              register={register("firstName")}
              error={errors.firstName?.message as string}
            />
            <Input
              label="Last Name:"
              register={register("lastName")}
              error={errors.lastName?.message as string}
            />
            <div className="md:col-span-2">
              <DatePickerField
                control={control}
                name={"dateOfBirth"}
                label="Date of Birth:"
              />
            </div>
          </div>
        </Card>

        <Card
          title="In-Patient Stay Notes"
          className="mb-6"
          buttonText={<ICONS.plus size={16} />}
          onButtonClick={addNewInPatientStayNote}
          ariaLabel="Add New In-Patient Stay Note"
          showButton={true}
        >
          <div className="space-y-6">
            {inPatientStayNotesFields.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No in-patient stay notes added yet.</p>
                <p className="text-sm">
                  Click the + button above to add your first in-patient stay
                  note.
                </p>
              </div>
            ) : (
              inPatientStayNotesFields.map((field, index) => (
                <InPatientStayNotesCard
                  key={field.id}
                  index={index}
                  register={register}
                  control={control}
                  errors={errors}
                  onRemove={() => removeInPatientStayNote(index)}
                  canRemove={inPatientStayNotesFields.length > 1}
                />
              ))
            )}
          </div>
        </Card>

        {handleFilterPermission(
          params.clientId as string,
          APP_ACTIONS.EditAgensyForms
        ) && (
          <div className="bg-basicWhite/90 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-all duration-300 overflow-hidden">
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
          </div>
        )}
      </form>
    </div>
  );
};
