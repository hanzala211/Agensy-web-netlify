import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Modal } from "@agensy/components";
import { ICONS } from "@agensy/constants";
import type { Client, ClientMedications } from "@agensy/types";

interface MedicationSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedication: (medication: ClientMedications) => void;
  title?: string;
}

export const MedicationSelectionModal: React.FC<
  MedicationSelectionModalProps
> = ({
  isOpen,
  onClose,
  onSelectMedication,
  title = "Select Existing Medication",
}) => {
  const queryClient = useQueryClient();
  const { clientId } = useParams();

  const client = queryClient.getQueryData(["client", clientId]) as
    | Client
    | undefined;
  const medications = client?.medications || [];

  const handleMedicationSelect = (medication: ClientMedications) => {
    onSelectMedication(medication);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-2xl"
      height="h-[80vh]"
    >
      <div className="space-y-4">
        <div className="max-h-full overflow-y-auto space-y-3">
          {medications.length > 0 ? (
            medications.map((medication) => (
              <div
                key={medication.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                onClick={() => handleMedicationSelect(medication)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {medication.medication_name}
                    </h3>
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      {medication.dosage && <p>Dosage: {medication.dosage}</p>}
                      {medication.frequency && (
                        <p>Frequency: {medication.frequency}</p>
                      )}
                      {medication.prescribing_doctor && (
                        <p>Prescribed by: {medication.prescribing_doctor}</p>
                      )}
                      {medication.purpose && (
                        <p>Purpose: {medication.purpose}</p>
                      )}
                    </div>
                  </div>
                  <ICONS.rightArrow className="text-gray-400 ml-2" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ICONS.medicine
                size={24}
                className="mx-auto mb-2 text-gray-400"
              />
              <p>No existing medications found</p>
              <p className="text-sm">
                Add medications to the client profile first
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
