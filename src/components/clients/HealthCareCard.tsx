import {
  Card,
  EditClientHealthcareModal,
  EmptyStateCard,
  HealthcareItem,
} from "@agensy/components";
import { APP_ACTIONS, ICONS } from "@agensy/constants";
import { useAuthContext, useClientContext } from "@agensy/context";
import React, { useEffect, useMemo, useState } from "react";
import { useUpdateClientHealthcareMutation } from "@agensy/api";
import type { HospitalFormData } from "@agensy/types";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@agensy/utils";

export const HealthCareCard: React.FC = () => {
  const { handleFilterPermission } = useAuthContext();
  const updateClientHealthcareMutation = useUpdateClientHealthcareMutation();
  const { selectedClient } = useClientContext();
  const [isEditHealthcareModalOpen, setIsEditHealthcareModalOpen] =
    useState<boolean>(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (updateClientHealthcareMutation.isSuccess) {
      setIsEditHealthcareModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["client", selectedClient?.id],
      });
      toast.success("Healthcare information updated successfully");
    } else if (updateClientHealthcareMutation.status === "error") {
      toast.error("Failed to update healthcare information");
    }
  }, [updateClientHealthcareMutation.isSuccess]);

  const selectedHealthCareProvider = useMemo(() => {
    return selectedClient?.healthcareProviders?.find((item) =>
      item?.provider_type
        ? item?.provider_type
            .split(" ")
            .join("")
            .toLowerCase()
            .includes("primary") ||
          item?.provider_type
            .split(" ")
            .join("")
            .toLowerCase()
            .includes("physician")
        : null
    );
  }, [selectedClient]);

  const handleSubmit = (data: HospitalFormData) => {
    const postData = {
      preferred_hospital: data.preferred_hospital
        ? data.preferred_hospital
        : null,
      hospital_address: data.hospital_address ? data.hospital_address : null,
      hospital_phone: data.hospital_phone ? data.hospital_phone : null,
      pharmacy_name: data.pharmacy_name ? data.pharmacy_name : null,
      pharmacy_address: data.pharmacy_address ? data.pharmacy_address : null,
      pharmacy_phone: data.pharmacy_phone ? data.pharmacy_phone : null,
      pharmacy_fax: data.pharmacy_fax ? data.pharmacy_fax : null,
    };
    updateClientHealthcareMutation.mutate({
      clientId: selectedClient?.id as string,
      data: postData,
    });
  };

  return (
    <React.Fragment>
      <Card
        title="Healthcare Information"
        buttonText={<ICONS.edit />}
        onButtonClick={() => setIsEditHealthcareModalOpen(true)}
        ariaLabel="Edit Healthcare Information"
        showButton={handleFilterPermission(
          selectedClient?.id as string,
          APP_ACTIONS.EditClientMedicalInfo
        )}
      >
        {selectedClient?.preferred_hospital ||
        selectedClient?.pharmacy_name ||
        selectedHealthCareProvider ? (
          <div className="flex flex-col gap-6">
            {selectedHealthCareProvider && (
              <HealthcareItem
                label="Primary Physician"
                icon={<ICONS.doctor size={22} />}
              >
                <p className="font-medium">
                  {selectedHealthCareProvider?.provider_name}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedHealthCareProvider?.phone}
                </p>
              </HealthcareItem>
            )}

            {selectedClient?.preferred_hospital && (
              <HealthcareItem
                label="Preferred Hospital"
                icon={<ICONS.hospital size={22} />}
              >
                <p className="font-medium">
                  {selectedClient?.preferred_hospital}
                </p>
                <p>{selectedClient?.hospital_address}</p>
                <p className="text-sm text-gray-600">
                  {selectedClient?.hospital_phone}
                </p>
              </HealthcareItem>
            )}

            {selectedClient?.pharmacy_name && (
              <HealthcareItem
                label="Preferred Pharmacy"
                icon={<ICONS.pharmacy size={22} />}
              >
                <p className="font-medium">{selectedClient?.pharmacy_name}</p>
                <p className="text-sm text-gray-600">
                  {selectedClient?.pharmacy_address}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedClient?.pharmacy_phone}
                </p>
              </HealthcareItem>
            )}
          </div>
        ) : (
          <EmptyStateCard
            ICON={ICONS.edit}
            label="Healthcare Information"
            onClick={() => {
              if (
                handleFilterPermission(
                  selectedClient?.id as string,
                  APP_ACTIONS.EditClientMedicalInfo
                )
              ) {
                setIsEditHealthcareModalOpen(true);
              }
            }}
            isEdit={true}
            showText={handleFilterPermission(
              selectedClient?.id as string,
              APP_ACTIONS.EditClientMedicalInfo
            )}
          />
        )}
      </Card>
      <EditClientHealthcareModal
        editClient={selectedClient}
        isOpen={isEditHealthcareModalOpen}
        setIsOpen={setIsEditHealthcareModalOpen}
        onSubmit={handleSubmit}
        isButtonLoading={updateClientHealthcareMutation.isPending}
      />
    </React.Fragment>
  );
};
