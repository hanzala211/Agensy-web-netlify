import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldRenderer } from "../FieldRenderer";
import {
  caregiverInformationSchema as checklistSchema,
  generateCaregiverInformationDefaultValues,
} from "@agensy/config";
import {
  Card,
  CommonLoader,
  PrimaryButton,
  Input,
  TimeInput,
  TextArea,
} from "@agensy/components";
import { useAuthContext, useClientContext } from "@agensy/context";
import type {
  ChecklistFormData,
  OpenedFileData,
  CaregiverInformationFormData,
} from "@agensy/types";
import {
  useGetCaregiverInformation,
  usePostCaregiverInformationMutation,
} from "@agensy/api";
import { caregiverInformationFormSchema } from "@agensy/types";
import { useParams } from "react-router-dom";
import { toast } from "@agensy/utils";
import { useQueryClient } from "@tanstack/react-query";
import { APP_ACTIONS } from "@agensy/constants";

export const CaregiverInformation = () => {
  const { handleFilterPermission } = useAuthContext();
  const { clientId } = useParams();
  const [formData, setFormData] = useState<ChecklistFormData>(
    generateCaregiverInformationDefaultValues()
  );
  const postCaregiverInformationMutation =
    usePostCaregiverInformationMutation();
  const { setOpenedFileData, setHasUnsavedChanges } = useClientContext();
  const queryClient = useQueryClient();
  const {
    data: careGiverInfo,
    isFetching: isLoadingChecklist,
    refetch,
  } = useGetCaregiverInformation(clientId!);

  // Extract client data from query cache
  const clientData = queryClient.getQueryData(["client", clientId]) as
    | { first_name?: string; last_name?: string; date_of_birth?: string }
    | undefined;
  const clientFirstName = clientData?.first_name || "";
  const clientLastName = clientData?.last_name || "";
  const clientDateOfBirth = clientData?.date_of_birth || "";

  useEffect(() => {
    refetch();
  }, []);

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isDirty },
    reset,
    getValues,
  } = useForm<CaregiverInformationFormData>({
    resolver: zodResolver(caregiverInformationFormSchema),
    defaultValues: {
      name: "",
      nickname_preferred_name: "",
      wake_time: "",
      sleep_time: "",
      breakfast_time: "",
      lunch_time: "",
      snacks_time: "",
      activity_time: "",
      nap_time: "",
      dinner_time: "",
      medication_time: "",
      likes: "",
      dislikes: "",
      redirection_techniques: "",
      triggers: "",
      helpful_information: "",
      documentation: "",
    },
  });

  // Watch form changes to detect unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  useEffect(() => {
    if (careGiverInfo) {
      reset({
        name: careGiverInfo?.form_data?.name || "",
        nickname_preferred_name:
          careGiverInfo?.form_data?.nickname_preferred_name || "",
        wake_time: careGiverInfo?.form_data?.wake_time
          ? careGiverInfo?.form_data?.wake_time.split(":")[0] +
            ":" +
            careGiverInfo.form_data?.wake_time.split(":")[1]
          : "",
        sleep_time: careGiverInfo?.form_data?.sleep_time
          ? careGiverInfo?.form_data.sleep_time.split(":")[0] +
            ":" +
            careGiverInfo.form_data.sleep_time.split(":")[1]
          : "",
        breakfast_time: careGiverInfo?.form_data?.breakfast_time
          ? careGiverInfo?.form_data.breakfast_time.split(":")[0] +
            ":" +
            careGiverInfo.form_data.breakfast_time.split(":")[1]
          : "",
        lunch_time: careGiverInfo?.form_data?.lunch_time
          ? careGiverInfo?.form_data?.lunch_time.split(":")[0] +
            ":" +
            careGiverInfo.form_data?.lunch_time.split(":")[1]
          : "",
        snacks_time: careGiverInfo?.form_data?.snacks_time
          ? careGiverInfo?.form_data.snacks_time.split(":")[0] +
            ":" +
            careGiverInfo.form_data?.snacks_time.split(":")[1]
          : "",
        activity_time: careGiverInfo?.form_data?.activity_time
          ? careGiverInfo?.form_data?.activity_time.split(":")[0] +
            ":" +
            careGiverInfo.form_data?.activity_time.split(":")[1]
          : "",
        nap_time: careGiverInfo?.form_data?.nap_time
          ? careGiverInfo?.form_data?.nap_time.split(":")[0] +
            ":" +
            careGiverInfo.form_data?.nap_time.split(":")[1]
          : "",
        dinner_time: careGiverInfo?.form_data?.dinner_time
          ? careGiverInfo?.form_data?.dinner_time.split(":")[0] +
            ":" +
            careGiverInfo.form_data?.dinner_time.split(":")[1]
          : "",
        medication_time: careGiverInfo?.form_data?.medication_time
          ? careGiverInfo?.form_data?.medication_time.split(":")[0] +
            ":" +
            careGiverInfo.form_data?.medication_time.split(":")[1]
          : "",
        likes: careGiverInfo?.form_data?.likes || "",
        dislikes: careGiverInfo?.form_data?.dislikes || "",
        redirection_techniques:
          careGiverInfo?.form_data?.redirection_techniques || "",
        triggers: careGiverInfo?.form_data?.triggers || "",
        helpful_information:
          careGiverInfo?.form_data?.helpful_information || "",
        documentation: careGiverInfo?.form_data?.documentation || "",
      });
    }
  }, [careGiverInfo, careGiverInfo?.form_data]);

  const createSafeOpenedFileData = (
    formData: ChecklistFormData,
    clientFirstName: string,
    clientLastName: string,
    clientDateOfBirth: string,
    lastUpdate?: string,
    formValues?: CaregiverInformationFormData
  ) => {
    return {
      ...formData,
      // Include the actual form values for PDF generation
      ...(formValues || {}),
      firstName: clientFirstName || "",
      lastName: clientLastName || "",
      dateOfBirth: clientDateOfBirth || "",
      last_update: JSON.parse(
        JSON.stringify({
          updatedAt: lastUpdate || new Date().toISOString(),
        })
      ),
    };
  };

  useEffect(() => {
    setOpenedFileData(
      createSafeOpenedFileData(
        formData,
        clientFirstName,
        clientLastName,
        clientDateOfBirth,
        careGiverInfo?.last_update?.updatedAt,
        getValues()
      ) as unknown as OpenedFileData
    );
  }, [formData]);

  useEffect(() => {
    if (postCaregiverInformationMutation.status === "success") {
      toast.success(
        "Caregiver Information Successfully Updated",
        "Your client's caregiver information has been saved and is now up to date."
      );
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
      setHasUnsavedChanges(false);

      // Update openedFileData with latest form values
      setOpenedFileData(
        createSafeOpenedFileData(
          formData,
          clientFirstName,
          clientLastName,
          clientDateOfBirth,
          new Date().toISOString(),
          getValues()
        ) as unknown as OpenedFileData
      );
    } else if (postCaregiverInformationMutation.status === "error") {
      toast.error(
        "Error Occurred",
        String(postCaregiverInformationMutation.error)
      );
    }
  }, [postCaregiverInformationMutation.status]);

  // Cleanup unsaved changes when component unmounts
  useEffect(() => {
    return () => {
      setHasUnsavedChanges(false);
    };
  }, [setHasUnsavedChanges]);

  const onSubmit = (data: CaregiverInformationFormData) => {
    console.log(data);
    const postData = {
      name: data.name ? data.name : null,
      nickname_preferred_name: data.nickname_preferred_name
        ? data.nickname_preferred_name
        : null,
      wake_time: data.wake_time ? data.wake_time : null,
      sleep_time: data.sleep_time ? data.sleep_time : null,
      breakfast_time: data.breakfast_time ? data.breakfast_time : null,
      lunch_time: data.lunch_time ? data.lunch_time : null,
      snacks_time: data.snacks_time ? data.snacks_time : null,
      activity_time: data.activity_time ? data.activity_time : null,
      nap_time: data.nap_time ? data.nap_time : null,
      dinner_time: data.dinner_time ? data.dinner_time : null,
      medication_time: data.medication_time ? data.medication_time : null,
      likes: data.likes ? data.likes : null,
      dislikes: data.dislikes ? data.dislikes : null,
      redirection_techniques: data.redirection_techniques
        ? data.redirection_techniques
        : null,
      triggers: data.triggers ? data.triggers : null,
      helpful_information: data.helpful_information
        ? data.helpful_information
        : null,
      documentation: data.documentation ? data.documentation : null,
    };
    postCaregiverInformationMutation.mutate({
      clientId: clientId!,
      data: postData,
    });
  };

  const groupedItems = checklistSchema.reduce((acc, field) => {
    const headingId = field.headingId || "default";
    if (!acc[headingId]) {
      acc[headingId] = [];
    }
    acc[headingId].push(field);
    return acc;
  }, {} as Record<string, typeof checklistSchema>);

  const getHeadingLabel = (headingId: string) => {
    const headingField = checklistSchema.find(
      (field) => field.id === headingId && field.type === "heading"
    );
    if (headingField) return headingField.label;

    // If no heading found, use the group label
    const groupField = checklistSchema.find(
      (field) =>
        field.headingId === headingId &&
        field.type === "group" &&
        field.parentId === null
    );
    return groupField?.label || `Section ${headingId}`;
  };

  const getRootFieldsForGroup = (headingId: string) => {
    return (
      groupedItems[headingId]?.filter(
        (field) => field.parentId === null && field.type !== "heading"
      ) || []
    );
  };

  return isLoadingChecklist ? (
    <div className="flex justify-center items-center h-screen">
      <CommonLoader />
    </div>
  ) : (
    <div>
      <form onSubmit={handleFormSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Caregiver Information Input Fields */}
          <Card title="Caregiver Information" childrenClasses="!px-0 py-2">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4 px-4">
                <Input
                  label="Name"
                  register={register("name")}
                  error={errors.name?.message}
                />
                <Input
                  label="Nickname/Preferred Name"
                  register={register("nickname_preferred_name")}
                  error={errors.nickname_preferred_name?.message}
                />
              </div>
            </div>
          </Card>

          {/* Schedule Section */}
          <Card title="Schedule" childrenClasses="!px-0 py-2">
            <div className="space-y-4 px-4">
              <div className="grid md:grid-cols-3 gap-4">
                <TimeInput
                  label="Wake"
                  register={register("wake_time")}
                  error={errors.wake_time?.message}
                  defaultValue={careGiverInfo?.form_data?.wake_time || ""}
                />
                <TimeInput
                  label="Sleep"
                  register={register("sleep_time")}
                  error={errors.sleep_time?.message}
                  defaultValue={careGiverInfo?.form_data?.sleep_time || ""}
                />
                <TimeInput
                  label="Nap"
                  register={register("nap_time")}
                  error={errors.nap_time?.message}
                  defaultValue={careGiverInfo?.form_data?.nap_time || ""}
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <TimeInput
                  label="Breakfast"
                  register={register("breakfast_time")}
                  error={errors.breakfast_time?.message}
                  defaultValue={careGiverInfo?.form_data?.breakfast_time || ""}
                />
                <TimeInput
                  label="Lunch"
                  register={register("lunch_time")}
                  error={errors.lunch_time?.message}
                  defaultValue={careGiverInfo?.form_data?.lunch_time || ""}
                />
                <TimeInput
                  label="Dinner"
                  register={register("dinner_time")}
                  error={errors.dinner_time?.message}
                  defaultValue={careGiverInfo?.form_data?.dinner_time || ""}
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <TimeInput
                  label="Snacks"
                  register={register("snacks_time")}
                  error={errors.snacks_time?.message}
                  defaultValue={careGiverInfo?.form_data?.snacks_time || ""}
                />
                <TimeInput
                  label="Activity"
                  register={register("activity_time")}
                  error={errors.activity_time?.message}
                  defaultValue={careGiverInfo?.form_data?.activity_time || ""}
                />
                <TimeInput
                  label="Medication"
                  register={register("medication_time")}
                  error={errors.medication_time?.message}
                  defaultValue={careGiverInfo?.form_data?.medication_time || ""}
                />
              </div>
            </div>
          </Card>

          {/* Likes Section */}
          <Card title="Likes" childrenClasses="!px-0 py-2">
            <div className="space-y-4 px-4">
              <TextArea
                label="Likes"
                placeholder="e.g., Reading, walking, classical music"
                register={register("likes")}
                error={errors.likes?.message}
              />
            </div>
          </Card>
          <Card title="Dislikes" childrenClasses="!px-0 py-2">
            <div className="space-y-4 px-4">
              <TextArea
                label="Dislikes"
                placeholder="e.g., Loud noises, Spicy food"
                register={register("dislikes")}
                error={errors.dislikes?.message}
              />
            </div>
          </Card>
          <Card title="Redirection Techniques" childrenClasses="!px-0 py-2">
            <div className="space-y-4 px-4">
              <TextArea
                label="Redirection Techniques"
                placeholder="e.g., Gentle reminders, Positive reinforcement"
                register={register("redirection_techniques")}
                error={errors.redirection_techniques?.message}
              />
            </div>
          </Card>
          <Card title="Triggers" childrenClasses="!px-0 py-2">
            <div className="space-y-4 px-4">
              <TextArea
                label="Triggers"
                placeholder="e.g., Changes in routine, Unfamiliar environments"
                register={register("triggers")}
                error={errors.triggers?.message}
              />
            </div>
          </Card>
          <Card title="Helpful Information" childrenClasses="!px-0 py-2">
            <div className="space-y-4 px-4">
              <TextArea
                label="Helpful Information"
                placeholder="e.g., Prefers quiet environment, Responds well to routine"
                register={register("helpful_information")}
                error={errors.helpful_information?.message}
              />
            </div>
          </Card>
          <Card title="Documentation" childrenClasses="!px-0 py-2">
            <div className="space-y-4 px-4">
              <TextArea
                label="Documentation"
                placeholder="e.g., Additional notes about care preferences"
                register={register("documentation")}
                error={errors.documentation?.message}
              />
            </div>
          </Card>

          {Object.keys(groupedItems).map((headingId) => {
            const rootFields = getRootFieldsForGroup(headingId);
            const headingLabel = getHeadingLabel(headingId);

            // Skip if no root fields (like standalone headings)
            if (rootFields.length === 0) return null;

            return (
              <Card
                key={headingId}
                title={headingLabel}
                childrenClasses="!px-0 py-2"
              >
                <div className="space-y-4">
                  {rootFields.map((field) => (
                    <FieldRenderer
                      key={field.id}
                      field={field}
                      formData={formData}
                      setFormData={setFormData}
                      schema={groupedItems[headingId]}
                    />
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
        {handleFilterPermission(
          clientId as string,
          APP_ACTIONS.EditAgensyForms
        ) && (
          <div className="bg-basicWhite/90 mt-4 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-all duration-300 overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-end gap-4 p-6">
              <PrimaryButton
                type="submit"
                isLoading={postCaregiverInformationMutation.isPending}
                disabled={postCaregiverInformationMutation.isPending}
                className="sm:!w-fit w-full md:text-base text-sm"
              >
                Save Caregiver Information
              </PrimaryButton>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
