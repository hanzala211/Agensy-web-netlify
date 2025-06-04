import { useUpdateClientMutation } from "@agensy/api";
import { AddClientModal, Card, InfoItem } from "@agensy/components";
import { APP_ACTIONS, ICONS, PERMISSIONS } from "@agensy/constants";
import { useAuthContext, useClientContext } from "@agensy/context";
import type { ClientAddRequestData } from "@agensy/types";
import { StringUtils, toast } from "@agensy/utils";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

export const PersonalInfoCard: React.FC = () => {
  const { userData } = useAuthContext();
  const updateClientMutation = useUpdateClientMutation();
  const { selectedClient } = useClientContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const userPermissions =
    PERMISSIONS[userData?.role as keyof typeof PERMISSIONS] || [];

  useEffect(() => {
    if (updateClientMutation.status === "success") {
      setIsEditModalOpen(false);
      updateClientMutation.reset();
      queryClient.invalidateQueries({
        queryKey: ["client", selectedClient?.id],
      });
    } else if (updateClientMutation.status === "error") {
      toast.error(
        "Failed to update client",
        String(updateClientMutation.error)
      );
    }
  }, [updateClientMutation.status]);

  const handleUpdateClient = (data: ClientAddRequestData) =>
    updateClientMutation.mutate({
      id: selectedClient?.id?.toString() as string,
      data,
    });

  return (
    <React.Fragment>
      <Card
        title="Personal Information"
        buttonText={<ICONS.edit />}
        onButtonClick={() => setIsEditModalOpen(true)}
        ariaLabel="Edit Client Profile"
        showButton={userPermissions.includes(APP_ACTIONS.EditClientBasicInfo)}
      >
        <div className="space-y-6">
          <InfoItem label="Address:">
            <p>{selectedClient?.address}</p>
            <p>
              {selectedClient?.city}, {selectedClient?.state}{" "}
              {selectedClient?.zip}
            </p>
          </InfoItem>

          <InfoItem label="Living Situation:">
            {selectedClient?.living_situation
              ? StringUtils.capitalizeFirstLetter(
                  selectedClient.living_situation
                )
              : ""}
          </InfoItem>

          <InfoItem label="Gender:">
            {selectedClient?.gender
              ? StringUtils.capitalizeFirstLetter(selectedClient.gender)
              : ""}
          </InfoItem>

          <InfoItem label="Marital Status:">
            {selectedClient?.marital_status
              ? StringUtils.capitalizeFirstLetter(selectedClient.marital_status)
              : ""}
          </InfoItem>
        </div>
      </Card>
      <AddClientModal
        title="Edit Client Profile"
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        btnText="Save Changes"
        editClient={selectedClient}
        onSubmit={handleUpdateClient}
        isButtonLoading={updateClientMutation.isPending}
      />
    </React.Fragment>
  );
};
