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
import type {
  ClientMedicalHistoryRequestData,
  MedicalHistoryFormData,
} from "@agensy/types";
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
    const postData: ClientMedicalHistoryRequestData = {
      diagnoses: data.diagnoses.join(", "),
      allergies: data.allergies.join(", "),
      dietary_restrictions: data.dietary_restrictions.join(", "),
      surgical_history: data.surgical_history.join(", "),
      cognitive_status: data.cognitive_status,
      notes: data.notes as string,
      last_cognitive_screening: data.last_cognitive_screening,
      cognitive_score: `${data.cognitive_score}/${data.total_score}`,
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
        {selectedClient?.medical ? (
          <div className="grid lg:grid-cols-2 gap-5">
            <ItemList
              label="Diagnosis:"
              items={selectedClient?.medical?.diagnoses.split(", ")}
            />

            <ItemList
              label="Allergies:"
              items={selectedClient?.medical?.allergies.split(", ")}
            />

            <ItemList
              label="Dietary Restrictions:"
              items={selectedClient?.medical?.dietary_restrictions.split(", ")}
            />

            <ItemList
              label="Surgical History:"
              items={selectedClient?.medical?.surgical_history.split(", ")}
            />

            <InfoItem label="Cognitive Status:">
              <p>{selectedClient?.medical.cognitive_status}</p>
            </InfoItem>

            <InfoItem label="Last Screening:">
              <p>
                {DateUtils.formatDateToRequiredFormat(
                  selectedClient?.medical.last_cognitive_screening
                )}
              </p>
            </InfoItem>

            <InfoItem label="Cognitive Score:">
              <p>
                {selectedClient.medical.cognitive_score.split("/")[0]} out of{" "}
                {selectedClient.medical.cognitive_score.split("/")[1]}
              </p>
            </InfoItem>
            {selectedClient?.medical.notes && (
              <InfoItem label="Note:">
                <p>{selectedClient.medical.notes}</p>
              </InfoItem>
            )}
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
