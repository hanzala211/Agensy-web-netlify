import React, { useEffect, useState } from "react";
import { FieldRenderer } from "../FieldRenderer";
import {
  carePlanChecklistSchema as checklistSchema,
  generateCarePlanChecklistDefaultValues,
} from "@agensy/config";
import { Card, CommonLoader, PrimaryButton } from "@agensy/components";
import { useClientContext } from "@agensy/context";
import type { ChecklistFormData, OpenedFileData } from "@agensy/types";
import {
  useGetChecklistForms,
  usePostChecklistFormsMutation,
} from "@agensy/api";
import { useParams } from "react-router-dom";
import { toast } from "@agensy/utils";

export const CarePlanChecklist = () => {
  const params = useParams();
  const {
    data: startOfCareChecklist,
    isFetching: isLoadingChecklist,
    refetch,
  } = useGetChecklistForms("care_plan_checklist", params.clientId!);
  const [formData, setFormData] = useState<ChecklistFormData>(
    generateCarePlanChecklistDefaultValues()
  );
  const postStartCareChecklistMutation = usePostChecklistFormsMutation();
  const { setOpenedFileData } = useClientContext();

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (
      startOfCareChecklist?.checklist_data &&
      typeof startOfCareChecklist.checklist_data === "object"
    ) {
      setFormData((prev) => {
        const mergedData = { ...prev };

        Object.keys(startOfCareChecklist.checklist_data).forEach((key) => {
          mergedData[key] = startOfCareChecklist.checklist_data[key];
        });

        return mergedData;
      });
    }
  }, [startOfCareChecklist]);

  useEffect(() => {
    if (postStartCareChecklistMutation.status === "success") {
      toast.success(
        "Care Plan Checklist Successfully Saved",
        "The care plan checklist information has been saved successfully."
      );
    } else if (postStartCareChecklistMutation.status === "error") {
      toast.error(
        "Error Occurred",
        String(postStartCareChecklistMutation.error)
      );
    }
  }, [postStartCareChecklistMutation.status]);

  useEffect(() => {
    setOpenedFileData({
      ...formData,
      last_update: { updatedAt: startOfCareChecklist?.updatedAt },
    } as unknown as OpenedFileData);
  }, [formData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Checklist data:", formData);
    postStartCareChecklistMutation.mutate({
      clientId: params.clientId!,
      param: "care_plan_checklist",
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
      </form>
    </div>
  );
};
