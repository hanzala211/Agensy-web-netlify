import React, { useEffect, useState, useCallback } from "react";
import { FieldRenderer } from "../FieldRenderer";
import {
  checklistSchema,
  generateChecklistDefaultValues,
} from "@agensy/config";
import {
  Card,
  CommonLoader,
  PrimaryButton,
  StickyScrollToTop,
} from "@agensy/components";
import { useAuthContext, useClientContext } from "@agensy/context";
import type { ChecklistFormData, OpenedFileData } from "@agensy/types";
import {
  useGetChecklistForms,
  usePostChecklistFormsMutation,
} from "@agensy/api";
import { useParams } from "react-router-dom";
import { toast, StringUtils } from "@agensy/utils";
import { APP_ACTIONS } from "@agensy/constants";
import { useQueryClient } from "@tanstack/react-query";

export const StartofCareChecklist = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  const {
    data: startOfCareChecklist,
    isFetching: isLoadingChecklist,
    refetch,
  } = useGetChecklistForms("start_of_care", params.clientId!);
  const [formData, setFormData] = useState<ChecklistFormData>(
    generateChecklistDefaultValues()
  );
  const [initialFormData, setInitialFormData] = useState<ChecklistFormData>(
    generateChecklistDefaultValues()
  );
  const { handleFilterPermission } = useAuthContext();
  const postStartCareChecklistMutation = usePostChecklistFormsMutation();
  const {
    setOpenedFileData,
    setHasUnsavedChanges,
    shouldDownloadAfterSave,
    setShouldDownloadAfterSave,
    setHandleSaveAndDownload,
  } = useClientContext();

  // Extract client data from query cache
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
      const mergedData = { ...generateChecklistDefaultValues() };
      Object.keys(startOfCareChecklist.checklist_data).forEach((key) => {
        mergedData[key] = startOfCareChecklist.checklist_data[key];
      });

      setFormData(mergedData);
      setInitialFormData(mergedData);
    }
  }, [startOfCareChecklist]);

  // Watch form changes to detect unsaved changes
  useEffect(() => {
    const hasChanges = Object.keys(formData).some(
      (key) => formData[key] !== initialFormData[key]
    );
    setHasUnsavedChanges(hasChanges);
  }, [formData, initialFormData]);

  // Add this helper function at the top of the component
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
          updatedAt: lastUpdate || "",
        })
      ),
    };
  };

  useEffect(() => {
    if (postStartCareChecklistMutation.status === "success") {
      toast.success(
        "Start of Care Checklist Successfully Saved",
        "The start of care checklist information has been saved successfully."
      );
      // Update initial form data to current form data after successful save
      setInitialFormData(formData);
      setHasUnsavedChanges(false);

      // Use the helper function for success case
      setOpenedFileData(
        createSafeOpenedFileData(
          formData,
          clientFirstName,
          clientLastName,
          clientDateOfBirth,
          startOfCareChecklist?.updatedAt
        ) as unknown as OpenedFileData
      );

      // Trigger PDF download if requested
      if (shouldDownloadAfterSave) {
        setShouldDownloadAfterSave(false);
        setTimeout(() => {
          StringUtils.triggerPDFDownload();
        }, 500);
      }
    } else if (postStartCareChecklistMutation.status === "error") {
      toast.error(
        "Error Occurred",
        String(postStartCareChecklistMutation.error)
      );
      // Reset download flag on error
      if (shouldDownloadAfterSave) {
        setShouldDownloadAfterSave(false);
      }
    }
  }, [postStartCareChecklistMutation.status]);

  // Cleanup unsaved changes when component unmounts
  useEffect(() => {
    return () => {
      setHasUnsavedChanges(false);
    };
  }, [setHasUnsavedChanges]);

  useEffect(() => {
    // Use the helper function
    setOpenedFileData(
      createSafeOpenedFileData(
        formData,
        clientFirstName,
        clientLastName,
        clientDateOfBirth,
        startOfCareChecklist?.updatedAt
      ) as unknown as OpenedFileData
    );
  }, [formData]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log("Checklist data:", formData);
      postStartCareChecklistMutation.mutate({
        clientId: params.clientId!,
        param: "start_of_care",
        data: {
          checklist_data: formData,
        },
      });
    },
    [postStartCareChecklistMutation, params.clientId, formData]
  );

  const handleSaveAndDownload = useCallback(() => {
    setShouldDownloadAfterSave(true);
    handleSubmit({
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>);
  }, []);

  // Register the save function with context
  useEffect(() => {
    setHandleSaveAndDownload(() => handleSaveAndDownload);
    return () => setHandleSaveAndDownload(undefined);
  }, []);

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
                Save Start of Care Checklist
              </PrimaryButton>
            </div>
          </div>
        )}
      </form>
      <StickyScrollToTop />
    </div>
  );
};
