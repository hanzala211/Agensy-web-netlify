import { useUpdateClientMutation } from "@agensy/api";
import { AddClientModal, Card, InfoItem } from "@agensy/components";
import { APP_ACTIONS, ICONS } from "@agensy/constants";
import { useAuthContext, useClientContext } from "@agensy/context";
import type { ClientFormData } from "@agensy/types";
import { DateUtils, StringUtils, toast } from "@agensy/utils";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

export const PersonalInfoCard: React.FC = () => {
  const { handleFilterPermission } = useAuthContext();
  const updateClientMutation = useUpdateClientMutation();
  const { selectedClient } = useClientContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

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

  const handleUpdateClient = (data: ClientFormData) => {
    console.log(data);
    const postData = {
      first_name: data.firstName,
      last_name: data.lastName,
      preferred_name: data.preferredName ? data.preferredName : null,
      date_of_birth: data.dateOfBirth
        ? DateUtils.changetoISO(data.dateOfBirth)
        : null,
      gender: data.gender ? data.gender : null,
      marital_status: data.maritalStatus ? data.maritalStatus : null,
      address: data.address ? data.address : null,
      city: data.city ? data.city : null,
      state: data.state ? data.state : null,
      zip: data.zipCode ? data.zipCode : null,
      living_situation: data.livingSituation ? data.livingSituation : null,
    };
    updateClientMutation.mutate({
      id: selectedClient?.id?.toString() as string,
      data: postData,
    });
  };

  return (
    <React.Fragment>
      <Card
        title="Personal Information"
        buttonText={<ICONS.edit />}
        onButtonClick={() => setIsEditModalOpen(true)}
        ariaLabel="Edit Client Profile"
        showButton={handleFilterPermission(
          selectedClient?.id as string,
          APP_ACTIONS.EditClientBasicInfo
        )}
      >
        <div className="space-y-6">
          {selectedClient?.address && (
            <InfoItem label="Address:">
              <p>{selectedClient?.address}</p>
              <p>
                {selectedClient?.city} {selectedClient?.city && ","}{" "}
                {selectedClient?.state} {selectedClient?.zip}
              </p>
            </InfoItem>
          )}
          {selectedClient?.living_situation && (
            <InfoItem label="Living Situation:">
              {selectedClient?.living_situation
                ? StringUtils.capitalizeFirstLetter(
                    selectedClient.living_situation
                  )
                : ""}
            </InfoItem>
          )}

          <InfoItem label="Gender:">
            {selectedClient?.gender
              ? StringUtils.capitalizeFirstLetter(selectedClient.gender)
              : ""}
          </InfoItem>

          {selectedClient?.marital_status && (
            <InfoItem label="Marital Status:">
              {selectedClient?.marital_status
                ? StringUtils.capitalizeFirstLetter(
                    selectedClient.marital_status
                  )
                : ""}
            </InfoItem>
          )}
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
