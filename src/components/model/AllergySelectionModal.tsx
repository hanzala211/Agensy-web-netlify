import React from "react";
import { Modal } from "@agensy/components";
import { ICONS } from "@agensy/constants";

interface AllergySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAllergy: (allergy: string) => void;
  title: string;
  existingAllergies: string[];
}

export const AllergySelectionModal: React.FC<AllergySelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectAllergy,
  title,
  existingAllergies,
}) => {
  const handleAllergySelect = (allergy: string) => {
    onSelectAllergy(allergy);
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
          {existingAllergies.length > 0 ? (
            existingAllergies.map((allergy, index) => (
              <div
                key={index}
                className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 p-4 bg-white border border-gray-200 rounded-lg"
                onClick={() => handleAllergySelect(allergy)}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">{allergy}</h4>
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
              <p>No existing allergies found</p>
              <p className="text-sm">
                Add allergies to the client profile first
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
