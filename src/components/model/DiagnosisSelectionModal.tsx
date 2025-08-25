import React from "react";
import { Modal } from "@agensy/components";
import { ICONS } from "@agensy/constants";

interface DiagnosisSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDiagnosis: (diagnosis: string) => void;
  title: string;
  existingDiagnoses: string[];
}

export const DiagnosisSelectionModal: React.FC<
  DiagnosisSelectionModalProps
> = ({ isOpen, onClose, onSelectDiagnosis, title, existingDiagnoses }) => {
  const handleDiagnosisSelect = (diagnosis: string) => {
    onSelectDiagnosis(diagnosis);
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
          {existingDiagnoses.length > 0 ? (
            existingDiagnoses.map((diagnosis, index) => (
              <div
                key={index}
                className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 p-4 bg-white border border-gray-200 rounded-lg"
                onClick={() => handleDiagnosisSelect(diagnosis)}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">{diagnosis}</h4>
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
              <p>No existing diagnoses found</p>
              <p className="text-sm">
                Add diagnoses to the client profile first
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
