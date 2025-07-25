import { EmptyStateCard } from "@agensy/components";
import { MedicationItem } from "./MedicationItem";
import { Card } from "@agensy/components";
import { ICONS, PERMISSIONS, APP_ACTIONS } from "@agensy/constants";
import type { ClientMedications, MedicationFormData } from "@agensy/types";
import React, { useEffect, useState } from "react";
import AddMedicationModal from "./AddMedicationModal";
import {
  useAddClientMedicationMutation,
  useDeleteClientMedicationMutation,
  useEditClientMedicationMutation,
} from "@agensy/api";
import { useAuthContext, useClientContext } from "@agensy/context";
import { DateUtils, toast } from "@agensy/utils";

export const MedicationCard: React.FC = () => {
  const { userData } = useAuthContext();
  const addClientMedicationMutation = useAddClientMedicationMutation();
  const editClientMedicationMutation = useEditClientMedicationMutation();
  const deleteClientMedicationMutation = useDeleteClientMedicationMutation();
  const {
    selectedClient,
    addClientMedication,
    updateClientMedication,
    deleteClientMedication,
  } = useClientContext();
  const [isAddMedicationModalOpen, setIsAddMedicationModalOpen] =
    useState<boolean>(false);
  const [selectedEditMedication, setSelectedEditMedication] =
    useState<ClientMedications | null>(null);
  const userPermissions =
    PERMISSIONS[userData?.role as keyof typeof PERMISSIONS] || [];

  useEffect(() => {
    if (!isAddMedicationModalOpen) {
      removeEditMedication();
    }
  }, [isAddMedicationModalOpen]);

  useEffect(() => {
    if (addClientMedicationMutation.status === "success") {
      setIsAddMedicationModalOpen(false);
      addClientMedication(addClientMedicationMutation.data);
      toast.success("Medication added successfully");
    } else if (addClientMedicationMutation.status === "error") {
      toast.error("Failed to add medication");
    }
  }, [addClientMedicationMutation.status]);

  useEffect(() => {
    if (editClientMedicationMutation.status === "success") {
      setIsAddMedicationModalOpen(false);
      updateClientMedication(editClientMedicationMutation.data);
      toast.success("Medication updated successfully");
    } else if (editClientMedicationMutation.status === "error") {
      toast.error("Failed to update medication");
    }
  }, [editClientMedicationMutation.status]);

  useEffect(() => {
    if (deleteClientMedicationMutation.status === "success") {
      toast.success("Medication deleted successfully");
      deleteClientMedication(
        deleteClientMedicationMutation.variables.medicationId
      );
    } else if (deleteClientMedicationMutation.status === "error") {
      toast.error("Failed to delete medication");
    }
  }, [deleteClientMedicationMutation.status]);

  const handleMedicationChange = (data: MedicationFormData) => {
    const postData = {
      medication_name: data.medication_name,
      dosage: data.dosage ? data.dosage : null,
      frequency: data.frequency ? data.frequency : null,
      purpose: data.purpose ? data.purpose : null,
      prescribing_doctor: data.prescribing_doctor
        ? data.prescribing_doctor
        : null,
      start_date: data.start_date
        ? DateUtils.changetoISO(data.start_date)
        : null,
      end_date: data.end_date ? DateUtils.changetoISO(data.end_date) : null,
      refill_due: data.refill_due
        ? DateUtils.changetoISO(data.refill_due)
        : null,
      notes: data.notes ? data.notes : null,
    };
    if (selectedEditMedication) {
      editClientMedicationMutation.mutate({
        medication_id: selectedEditMedication.id as string,
        clientId: selectedClient?.id as string,
        postData,
      });
    } else {
      addClientMedicationMutation.mutate({
        client_id: selectedClient?.id as string,
        postData,
      });
    }
  };

  const handleEditMedication = (medication: ClientMedications) => {
    setSelectedEditMedication(medication);
    setIsAddMedicationModalOpen(true);
  };

  const removeEditMedication = () => {
    setTimeout(() => {
      setSelectedEditMedication(null);
    }, 100);
  };

  return (
    <React.Fragment>
      <Card
        title="Medications"
        buttonText={<ICONS.plus size={16} />}
        ariaLabel="Add New Medication"
        onButtonClick={() => setIsAddMedicationModalOpen(true)}
        showButton={userPermissions.includes(APP_ACTIONS.EditClientMedicalInfo)}
      >
        <div className="flex flex-col gap-5">
          {selectedClient?.medications?.map((medication: ClientMedications) => (
            <MedicationItem
              key={medication.id}
              medication={medication}
              onEdit={handleEditMedication}
              onDelete={() => {
                deleteClientMedicationMutation.mutate({
                  medicationId: medication.id as string,
                  clientId: selectedClient?.id as string,
                });
              }}
              isDeleting={deleteClientMedicationMutation.isPending}
              showActions={userPermissions.includes(
                APP_ACTIONS.EditClientMedicalInfo
              )}
            />
          ))}

          {selectedClient?.medications?.length === 0 && (
            <EmptyStateCard
              ICON={ICONS.plus}
              label="Medications"
              onClick={() => {
                if (
                  userPermissions.includes(APP_ACTIONS.EditClientMedicalInfo)
                ) {
                  setIsAddMedicationModalOpen(true);
                }
              }}
              showText={userPermissions.includes(
                APP_ACTIONS.EditClientMedicalInfo
              )}
            />
          )}
        </div>
      </Card>

      <AddMedicationModal
        isOpen={isAddMedicationModalOpen}
        setIsOpen={setIsAddMedicationModalOpen}
        onSubmit={handleMedicationChange}
        editMedication={selectedEditMedication}
        isLoading={
          addClientMedicationMutation.isPending ||
          editClientMedicationMutation.isPending
        }
      />
    </React.Fragment>
  );
};
