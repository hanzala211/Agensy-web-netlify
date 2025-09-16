import {
  useAddHealthCareMutation,
  useDeleteHealthCareMutation,
  useUpdateHealthCareMutation,
} from "@agensy/api";
import {
  AddClientHealthProviderModal,
  Card,
  EmptyStateCard,
  HealthcareProviderItem,
} from "@agensy/components";
import { APP_ACTIONS, ICONS } from "@agensy/constants";
import { useAuthContext, useClientContext } from "@agensy/context";
import type {
  ClientHealthProviderFormData,
  HealthcareProvider,
} from "@agensy/types";
import { DateUtils, toast } from "@agensy/utils";
import React, { useEffect, useState } from "react";

export const HealthCareProviderCard: React.FC = () => {
  const { handleFilterPermission } = useAuthContext();
  const addHealthCareProviderMutation = useAddHealthCareMutation();
  const updateHealthCareProviderMutation = useUpdateHealthCareMutation();
  const deleteHealthCareProviderMutation = useDeleteHealthCareMutation();
  const {
    selectedClient,
    addClientHealthCareProvider,
    updateClientHealthCareProvider,
    deleteClientHealthCareProvider,
  } = useClientContext();
  const [isHealthCareModalOpen, setIsHealthCareModalOpen] =
    useState<boolean>(false);
  const [selectedEditHealthCareProvider, setSelectedEditHealthCareProvider] =
    useState<HealthcareProvider | null>(null);

  useEffect(() => {
    if (addHealthCareProviderMutation.status === "success") {
      addClientHealthCareProvider(addHealthCareProviderMutation.data);
      toast.success("New provider added successfully!");
      setIsHealthCareModalOpen(false);
    } else if (addHealthCareProviderMutation.status === "error") {
      toast.error("Couldn’t add provider. Please retry.");
    }
  }, [addHealthCareProviderMutation.status]);

  useEffect(() => {
    if (updateHealthCareProviderMutation.status === "success") {
      updateClientHealthCareProvider(updateHealthCareProviderMutation.data);
      toast.success("Provider updated successfully!");
      setIsHealthCareModalOpen(false);
    } else if (addHealthCareProviderMutation.status === "error") {
      toast.error("Couldn’t update provider. Please retry.");
    }
  }, [updateHealthCareProviderMutation.status]);

  useEffect(() => {
    if (deleteHealthCareProviderMutation.status === "success") {
      deleteClientHealthCareProvider(
        deleteHealthCareProviderMutation.variables.providerId
      );
      toast.success("Provider deleted successfully!");
      setIsHealthCareModalOpen(false);
    } else if (deleteHealthCareProviderMutation.status === "error") {
      toast.error("Couldn’t delete provider. Please retry.");
    }
  }, [deleteHealthCareProviderMutation.status]);

  useEffect(() => {
    if (!isHealthCareModalOpen) removeEditHealthCareProvider();
  }, [isHealthCareModalOpen]);

  const handleSubmitForm = (data: ClientHealthProviderFormData) => {
    const postData = {
      address: data.address ? data.address : null,
      fax: data.fax ? data.fax : null,
      last_visit: data.last_visit
        ? DateUtils.changetoISO(data.last_visit)
        : null,
      next_visit: data.next_visit
        ? DateUtils.changetoISO(data.next_visit)
        : null,
      notes: data.notes ? data.notes : null,
      phone: data.phone ? data.phone : null,
      provider_name: data.provider_name ? data.provider_name : null,
      provider_type: data.provider_type ? data.provider_type : null,
      specialty: data.specialty ? data.specialty : null,
    };
    if (selectedEditHealthCareProvider) {
      updateHealthCareProviderMutation.mutate({
        provider: postData,
        clientId: selectedClient?.id as string,
        providerId: selectedEditHealthCareProvider.id as string,
      });
    } else {
      addHealthCareProviderMutation.mutate({
        provider: postData,
        clientId: selectedClient?.id as string,
      });
    }
  };

  const handleEdit = (item: HealthcareProvider) => {
    setSelectedEditHealthCareProvider(item);
    setIsHealthCareModalOpen(true);
  };

  const handleDelete = (provider: HealthcareProvider) => {
    deleteHealthCareProviderMutation.mutate({
      providerId: provider.id as string,
      clientId: selectedClient?.id as string,
    });
  };

  const removeEditHealthCareProvider = () => {
    setTimeout(() => {
      setSelectedEditHealthCareProvider(null);
    }, 100);
  };

  return (
    <React.Fragment>
      <Card
        title="Healthcare Providers"
        buttonText={<ICONS.plus size={16} />}
        onButtonClick={() => setIsHealthCareModalOpen(true)}
        ariaLabel="Add New HealthCare Provider"
        showButton={handleFilterPermission(
          selectedClient?.id as string,
          APP_ACTIONS.EditClientMedicalInfo
        )}
      >
        <div className="flex flex-col gap-6">
          {selectedClient?.healthcareProviders &&
          selectedClient?.healthcareProviders?.length > 0 ? (
            selectedClient?.healthcareProviders?.map((provider) => (
              <HealthcareProviderItem
                key={provider.id}
                provider={provider as HealthcareProvider}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={deleteHealthCareProviderMutation.isPending}
                showActions={handleFilterPermission(
                  selectedClient?.id as string,
                  APP_ACTIONS.EditClientMedicalInfo
                )}
              />
            ))
          ) : (
            <EmptyStateCard
              ICON={ICONS.plus}
              label="Healthcare Providers"
              showText={handleFilterPermission(
                selectedClient?.id as string,
                APP_ACTIONS.EditClientMedicalInfo
              )}
              onClick={() => {
                if (
                  handleFilterPermission(
                    selectedClient?.id as string,
                    APP_ACTIONS.EditClientMedicalInfo
                  )
                ) {
                  setIsHealthCareModalOpen(true);
                }
              }}
            />
          )}
        </div>
      </Card>
      <AddClientHealthProviderModal
        isOpen={isHealthCareModalOpen}
        setIsOpen={setIsHealthCareModalOpen}
        title={
          selectedEditHealthCareProvider
            ? "Edit Healthcare Provider"
            : "Add Healthcare Provider"
        }
        btnText={
          selectedEditHealthCareProvider ? "Edit Provider" : "Add Provider"
        }
        onSubmit={handleSubmitForm}
        isButtonLoading={
          addHealthCareProviderMutation.isPending ||
          updateHealthCareProviderMutation.isPending
        }
        editItem={selectedEditHealthCareProvider as HealthcareProvider}
      />
    </React.Fragment>
  );
};

export default HealthCareProviderCard;
