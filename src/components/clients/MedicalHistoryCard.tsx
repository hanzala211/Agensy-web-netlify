import { DateUtils, toast } from "@agensy/utils";
import {
  AddClientMedicalHistory,
  EmptyStateCard,
  InfoItem,
  Card,
} from "@agensy/components";
import { APP_ACTIONS, ICONS, PERMISSIONS } from "@agensy/constants";
import { useAuthContext, useClientContext } from "@agensy/context";
import React, { useEffect, useState } from "react";
import {
  useAddClientMedicalHistoryMutation,
  useUpdateClientMedicalHistoryMutation,
} from "@agensy/api";
import type { MedicalHistoryFormData } from "@agensy/types";
import ItemList from "./ItemList";

export const MedicalHistoryCard: React.FC = () => {
  const { userData } = useAuthContext();
  const addClientMedicalHistoryMutation = useAddClientMedicalHistoryMutation();
  const updateClientMedicalHistoryMutation =
    useUpdateClientMedicalHistoryMutation();
  const { selectedClient, addClientMedicalHistory } = useClientContext();
  const [isAddMedicalHistoryModalOpen, setIsAddMedicalHistoryModalOpen] =
    useState<boolean>(false);
  const userPermissions =
    PERMISSIONS[userData?.role as keyof typeof PERMISSIONS] || [];

  useEffect(() => {
    if (addClientMedicalHistoryMutation.status === "success") {
      toast.success("Medical history added Successfully");
      setIsAddMedicalHistoryModalOpen(false);
      addClientMedicalHistory(addClientMedicalHistoryMutation.data);
    } else if (addClientMedicalHistoryMutation.status === "error") {
      toast.error("Failed to add medical history. Please try again.");
    }
  }, [addClientMedicalHistoryMutation.status]);

  useEffect(() => {
    if (updateClientMedicalHistoryMutation.status === "success") {
      toast.success("Medical history updated Successfully");
      setIsAddMedicalHistoryModalOpen(false);
      addClientMedicalHistory(updateClientMedicalHistoryMutation.data);
    } else if (updateClientMedicalHistoryMutation.status === "error") {
      toast.error("Failed to update medical history. Please try again.");
    }
  }, [updateClientMedicalHistoryMutation.status]);

  const handleSubmit = (data: MedicalHistoryFormData) => {
    const postData: unknown = {
      diagnoses:
        data.diagnoses && data.diagnoses?.length > 0
          ? data.diagnoses.join(", ").length > 0
            ? data.diagnoses.join(", ")
            : null
          : null,
      allergies:
        data.allergies && data.allergies?.length > 0
          ? data.allergies.join(", ").length > 0
            ? data.allergies.join(", ")
            : null
          : null,
      dietary_restrictions:
        data.dietary_restrictions && data.dietary_restrictions.length > 0
          ? data.dietary_restrictions.join(", ").length > 0
            ? data.dietary_restrictions.join(", ")
            : null
          : null,
      surgical_history:
        data.surgical_history && data.surgical_history.length > 0
          ? data.surgical_history.join(", ").length > 0
            ? data.surgical_history.join(", ")
            : null
          : null,
      cognitive_status: data.cognitive_status
        ? data.cognitive_status === "Other"
          ? data.cognitive_status_text ? data.cognitive_status_text : null
          : data.cognitive_status
        : null,
      notes: data.notes ? data.notes : null,
      last_cognitive_screening: data.last_cognitive_screening
        ? DateUtils.changetoISO(data.last_cognitive_screening)
        : null,
      cognitive_score: data.cognitive_score ? data.cognitive_score : null,
      test_type: data.test_type ? data.test_type : null,
    };
    if (!selectedClient?.medical) {
      addClientMedicalHistoryMutation.mutate({
        clientId: selectedClient?.id as string,
        postData,
      });
    } else {
      updateClientMedicalHistoryMutation.mutate({
        clientId: selectedClient?.id as string,
        postData,
      });
    }
  };

  return (
    <React.Fragment>
      <Card
        title="Medical History"
        onButtonClick={() => setIsAddMedicalHistoryModalOpen(true)}
        buttonText={
          selectedClient?.medical ? <ICONS.edit /> : <ICONS.plus size={16} />
        }
        ariaLabel={
          selectedClient?.medical
            ? "Edit Client Medical History"
            : "Add Client Medical History"
        }
        showButton={userPermissions.includes(APP_ACTIONS.EditClientMedicalInfo)}
      >
        {selectedClient?.medical?.diagnoses ||
        selectedClient?.medical?.allergies ||
        selectedClient?.medical?.dietary_restrictions ||
        selectedClient?.medical?.cognitive_status ||
        selectedClient?.medical?.cognitive_score ||
        selectedClient?.medical?.surgical_history ||
        selectedClient?.medical?.last_cognitive_screening ||
        selectedClient?.medical?.notes ? (
          <div className="grid lg:grid-cols-2 gap-5 items-start">
            <div className="grid gap-4">
              {selectedClient?.medical?.diagnoses && (
                <ItemList
                  label="Diagnosis:"
                  items={selectedClient?.medical?.diagnoses.split(", ")}
                />
              )}

              {selectedClient?.medical?.dietary_restrictions && (
                <ItemList
                  label="Dietary Restrictions:"
                  items={selectedClient?.medical?.dietary_restrictions?.split(
                    ", "
                  )}
                />
              )}

              {selectedClient?.medical.cognitive_status && (
                <InfoItem label="Cognitive Status:">
                  <p>{selectedClient?.medical.cognitive_status}</p>
                </InfoItem>
              )}

              {selectedClient?.medical?.cognitive_score && (
                <InfoItem label="Cognitive Score:">
                  <p>
                    {selectedClient.medical.cognitive_score?.split("/")[0]} out
                    of {selectedClient.medical.cognitive_score?.split("/")[1]}{" "}
                    {selectedClient?.medical?.test_type &&
                      `in ${selectedClient?.medical?.test_type}`}
                  </p>
                </InfoItem>
              )}
            </div>
            <div className="grid gap-4">
              {selectedClient?.medical?.allergies && (
                <ItemList
                  label="Allergies:"
                  items={selectedClient?.medical?.allergies?.split(", ")}
                />
              )}

              {selectedClient?.medical?.surgical_history && (
                <ItemList
                  label="Surgical History:"
                  items={selectedClient?.medical?.surgical_history?.split(", ")}
                />
              )}

              {selectedClient?.medical?.last_cognitive_screening && (
                <InfoItem label="Last Screening:">
                  <p>
                    {DateUtils.formatDateToRequiredFormat(
                      selectedClient?.medical?.last_cognitive_screening
                    )}
                  </p>
                </InfoItem>
              )}

              {selectedClient?.medical?.notes && (
                <InfoItem label="Note:">
                  <p>{selectedClient.medical?.notes}</p>
                </InfoItem>
              )}
            </div>
          </div>
        ) : (
          <EmptyStateCard
            ICON={ICONS.plus}
            label="Medical History"
            onClick={() => {
              if (userPermissions.includes(APP_ACTIONS.EditClientMedicalInfo)) {
                setIsAddMedicalHistoryModalOpen(true);
              }
            }}
            showText={userPermissions.includes(
              APP_ACTIONS.EditClientMedicalInfo
            )}
          />
        )}
      </Card>
      <AddClientMedicalHistory
        editData={selectedClient?.medical ? selectedClient.medical : null}
        isOpen={isAddMedicalHistoryModalOpen}
        setIsOpen={setIsAddMedicalHistoryModalOpen}
        onSubmit={handleSubmit}
        isLoading={
          addClientMedicalHistoryMutation.isPending ||
          updateClientMedicalHistoryMutation.isPending
        }
      />
    </React.Fragment>
  );
};

export default MedicalHistoryCard;
