import React, { useEffect, useState, useCallback } from "react";
import { FieldRenderer } from "../FieldRenderer";
import {
  longTermCareInsurancePolicySchema as checklistSchema,
  generateLongTermCareInsurancePolicyDefaultValues,
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
import { StringUtils, toast } from "@agensy/utils";
import { APP_ACTIONS } from "@agensy/constants";
import { useQueryClient } from "@tanstack/react-query";

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

export const LongTermCareInsurancePolicy = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  const {
    data: longTermCareInsurancePolicy,
    isFetching: isLoadingChecklist,
    refetch,
  } = useGetChecklistForms("long_term_care_insurance_policy", params.clientId!);
  const [formData, setFormData] = useState<ChecklistFormData>(
    generateLongTermCareInsurancePolicyDefaultValues()
  );
  const [initialFormData, setInitialFormData] = useState<ChecklistFormData>(
    generateLongTermCareInsurancePolicyDefaultValues()
  );
  const postLongTermCareInsurancePolicyMutation =
    usePostChecklistFormsMutation();
  const {
    setOpenedFileData,
    setHasUnsavedChanges,
    shouldDownloadAfterSave,
    setShouldDownloadAfterSave,
    setHandleSaveAndDownload,
  } = useClientContext();
  const { handleFilterPermission } = useAuthContext();

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
      longTermCareInsurancePolicy?.checklist_data &&
      typeof longTermCareInsurancePolicy.checklist_data === "object"
    ) {
      const mergedData = {
        ...generateLongTermCareInsurancePolicyDefaultValues(),
      };
      Object.keys(longTermCareInsurancePolicy.checklist_data).forEach((key) => {
        mergedData[key] = longTermCareInsurancePolicy.checklist_data[key];
      });

      setFormData(mergedData);
      setInitialFormData(mergedData);
    }
  }, [longTermCareInsurancePolicy]);

  useEffect(() => {
    const hasChanges = Object.keys(formData).some(
      (key) => formData[key] !== initialFormData[key]
    );
    setHasUnsavedChanges(hasChanges);
  }, [formData, initialFormData]);

  useEffect(() => {
    if (postLongTermCareInsurancePolicyMutation.status === "success") {
      toast.success(
        "Long Term Care Insurance Policy Checklist Successfully Saved",
        "The long term care insurance policy checklist information has been saved successfully."
      );
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

      // Trigger PDF download if requested
      if (shouldDownloadAfterSave) {
        setShouldDownloadAfterSave(false);
        setTimeout(() => {
          StringUtils.triggerPDFDownload();
        }, 500);
      }
    } else if (postLongTermCareInsurancePolicyMutation.status === "error") {
      toast.error(
        "Error Occurred",
        String(postLongTermCareInsurancePolicyMutation.error)
      );
      // Reset download flag on error
      if (shouldDownloadAfterSave) {
        setShouldDownloadAfterSave(false);
      }
    }
  }, [postLongTermCareInsurancePolicyMutation.status]);

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
        longTermCareInsurancePolicy?.updatedAt
      ) as unknown as OpenedFileData
    );
  }, [formData]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log("Checklist data:", formData);
      postLongTermCareInsurancePolicyMutation.mutate({
        clientId: params.clientId!,
        param: "long_term_care_insurance_policy",
        data: {
          checklist_data: formData,
        },
      });
    },
    [formData, postLongTermCareInsurancePolicyMutation, params.clientId]
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
  }, [setHandleSaveAndDownload, handleSaveAndDownload]);

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
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {Object.keys(groupedItems).map((headingId) => {
            const rootFields = getRootFieldsForGroup(headingId);
            const headingLabel = getHeadingLabel(headingId);

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
                isLoading={postLongTermCareInsurancePolicyMutation.isPending}
                disabled={postLongTermCareInsurancePolicyMutation.isPending}
                className="sm:!w-fit w-full md:text-base text-sm"
              >
                Save Long Term Care Insurance Policy Checklist
              </PrimaryButton>
            </div>
          </div>
        )}
      </form>
      <StickyScrollToTop />
    </div>
  );
};
