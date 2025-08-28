import React, { useEffect, useState } from "react";
import { FieldRenderer } from "../FieldRenderer";
import {
  longTermCareInsurancePolicySchema as checklistSchema,
  generateLongTermCareInsurancePolicyDefaultValues,
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

export const LongTermCareInsurancePolicy = () => {
  const params = useParams();
  const {
    data: longTermCareInsurancePolicy,
    isFetching: isLoadingChecklist,
    refetch,
  } = useGetChecklistForms("long_term_care_insurance_policy", params.clientId!);
  const [formData, setFormData] = useState<ChecklistFormData>(
    generateLongTermCareInsurancePolicyDefaultValues()
  );
  const postLongTermCareInsurancePolicyMutation =
    usePostChecklistFormsMutation();
  const { setOpenedFileData } = useClientContext();

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (
      longTermCareInsurancePolicy?.checklist_data &&
      typeof longTermCareInsurancePolicy.checklist_data === "object"
    ) {
      setFormData((prev) => {
        const mergedData = { ...prev };

        Object.keys(longTermCareInsurancePolicy.checklist_data).forEach(
          (key) => {
            mergedData[key] = longTermCareInsurancePolicy.checklist_data[key];
          }
        );

        return mergedData;
      });
    }
  }, [longTermCareInsurancePolicy]);

  useEffect(() => {
    if (postLongTermCareInsurancePolicyMutation.status === "success") {
      toast.success(
        "Long Term Care Insurance Policy Checklist Successfully Saved",
        "The long term care insurance policy checklist information has been saved successfully."
      );
    } else if (postLongTermCareInsurancePolicyMutation.status === "error") {
      toast.error(
        "Error Occurred",
        String(postLongTermCareInsurancePolicyMutation.error)
      );
    }
  }, [postLongTermCareInsurancePolicyMutation.status]);

  useEffect(() => {
    setOpenedFileData({
      ...formData,
      last_update: { updatedAt: longTermCareInsurancePolicy?.updatedAt },
    } as unknown as OpenedFileData);
  }, [formData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Checklist data:", formData);
    postLongTermCareInsurancePolicyMutation.mutate({
      clientId: params.clientId!,
      param: "long_term_care_insurance_policy",
      data: {
        checklist_data: formData,
      },
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
      </form>
    </div>
  );
};
