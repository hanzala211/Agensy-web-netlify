import React, { useEffect, useState } from "react";
import { FieldRenderer } from "../FieldRenderer";
import {
  carePlanChecklistSchema as checklistSchema,
  generateCarePlanChecklistDefaultValues,
} from "@agensy/config";
import { Card, CommonLoader, PrimaryButton } from "@agensy/components";
import { useAuthContext, useClientContext } from "@agensy/context";
import type { ChecklistFormData, OpenedFileData } from "@agensy/types";
import {
  useGetChecklistForms,
  usePostChecklistFormsMutation,
} from "@agensy/api";
import { useParams } from "react-router-dom";
import { toast } from "@agensy/utils";
import { APP_ACTIONS } from "@agensy/constants";
import { useQueryClient } from "@tanstack/react-query";

// Add this helper function at the top of the component (after the imports)
const createSafeOpenedFileData = (
  formData: ChecklistFormData,
  clientFirstName: string,
  clientLastName: string,
  clientDateOfBirth: string,
  lastUpdate?: string
) => {
  return {
    ...formData,
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

export const CarePlanChecklist = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  const { handleFilterPermission } = useAuthContext();
  const {
    data: startOfCareChecklist,
    isFetching: isLoadingChecklist,
    refetch,
  } = useGetChecklistForms("care_plan", params.clientId!);
  const [formData, setFormData] = useState<ChecklistFormData>(
    generateCarePlanChecklistDefaultValues()
  );
  const [initialFormData, setInitialFormData] = useState<ChecklistFormData>(
    generateCarePlanChecklistDefaultValues()
  );
  const postStartCareChecklistMutation = usePostChecklistFormsMutation();
  const { setOpenedFileData, setHasUnsavedChanges } = useClientContext();

  const clientData = queryClient.getQueryData(["client", params.clientId]) as
    | { first_name?: string; last_name?: string; date_of_birth?: string }
    | undefined;
  const clientFirstName = clientData?.first_name || "";
  const clientLastName = clientData?.last_name || "";
  const clientDateOfBirth = clientData?.date_of_birth || "";
  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (
      startOfCareChecklist?.checklist_data &&
      typeof startOfCareChecklist.checklist_data === "object"
    ) {
      const mergedData = { ...generateCarePlanChecklistDefaultValues() };
      Object.keys(startOfCareChecklist.checklist_data).forEach((key) => {
        mergedData[key] = startOfCareChecklist.checklist_data[key];
      });

      setFormData(mergedData);
      setInitialFormData(mergedData);
    }
  }, [startOfCareChecklist]);

  useEffect(() => {
    const hasChanges = Object.keys(formData).some(
      (key) => formData[key] !== initialFormData[key]
    );
    setHasUnsavedChanges(hasChanges);
  }, [formData, initialFormData]);

  useEffect(() => {
    if (postStartCareChecklistMutation.status === "success") {
      toast.success(
        "Care Plan Checklist Successfully Saved",
        "The care plan checklist information has been saved successfully."
      );
      // Update initial form data to current form data after successful save
      setInitialFormData(formData);
      setHasUnsavedChanges(false);

      // Update openedFileData with latest form values
      setOpenedFileData(
        createSafeOpenedFileData(
          formData,
          clientFirstName,
          clientLastName,
          clientDateOfBirth,
          new Date().toISOString()
        ) as unknown as OpenedFileData
      );
    } else if (postStartCareChecklistMutation.status === "error") {
      toast.error(
        "Error Occurred",
        String(postStartCareChecklistMutation.error)
      );
    }
  }, [postStartCareChecklistMutation.status]);

  // Cleanup unsaved changes when component unmounts
  useEffect(() => {
    return () => {
      setHasUnsavedChanges(false);
    };
  }, [setHasUnsavedChanges]);

  useEffect(() => {
    setOpenedFileData(
      createSafeOpenedFileData(
        formData,
        clientFirstName,
        clientLastName,
        clientDateOfBirth,
        startOfCareChecklist?.updatedAt
      ) as unknown as OpenedFileData
    );
  }, [
    formData,
    clientFirstName,
    clientLastName,
    clientDateOfBirth,
    setOpenedFileData,
    startOfCareChecklist?.updatedAt,
  ]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Checklist data:", formData);
    postStartCareChecklistMutation.mutate({
      clientId: params.clientId!,
      param: "care_plan",
      data: {
        checklist_data: formData,
      },
    });
  };

  // Group items by headingId
  const groupedItems = checklistSchema.reduce((acc, field) => {
    const headingId = field.headingId || "default";
    if (!acc[headingId]) {
      acc[headingId] = [];
    }
    acc[headingId].push(field);
    return acc;
  }, {} as Record<string, typeof checklistSchema>);

  // Get heading label for each group
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

  // Get root fields for each heading group (parentId === null, excluding headings)
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
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
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
          params.clientId as string,
          APP_ACTIONS.EditAgensyForms
        ) && (
          <div className="bg-basicWhite/90 mt-4 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-all duration-300 overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-end gap-4 p-6">
              <PrimaryButton
                type="submit"
                isLoading={postStartCareChecklistMutation.isPending}
                disabled={postStartCareChecklistMutation.isPending}
                className="sm:!w-fit w-full md:text-base text-sm"
              >
                Save Care Plan Checklist
              </PrimaryButton>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
