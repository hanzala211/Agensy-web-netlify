import {
  ActionButtons,
  BorderedCard,
  ConfirmationModal,
} from "@agensy/components";
import { ICONS } from "@agensy/constants";
import type { ClientMedications } from "@agensy/types";
import React, { useState } from "react";

interface MedicationItemProps {
  medication: ClientMedications;
  onEdit?: (item: ClientMedications) => void;
  onDelete?: (item: ClientMedications) => void;
  isDeleting?: boolean;
  showActions?: boolean;
}

export const MedicationItem: React.FC<MedicationItemProps> = ({
  medication,
  onEdit,
  onDelete,
  isDeleting = false,
  showActions = true,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const handleDeleteMedication = () => {
    setIsDeleteModalOpen(false);
    onDelete?.(medication);
  };
  return (
    <BorderedCard>
      <div className="flex flex-col gap-4 lg:flex-row items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center flex-wrap gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700">
              <ICONS.medicine size={20} />
            </span>
            <div className="md:text-xl text-sm font-semibold text-gray-800 break-words line-clamp-4">
              {medication.medication_name}
            </div>
            <div className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium text-xs md:text-sm">
              {medication.dosage}
            </div>
            {medication.purpose && (
              <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium text-xs md:text-sm">
                {medication.purpose}
              </div>
            )}
          </div>

          <div className="mt-3 pl-1 flex flex-wrap items-center gap-2 md:text-sm text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <ICONS.clockCircle size={14} className="text-gray-400" />
              <span>{medication.frequency}</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1">
              <ICONS.doctor size={14} className="text-gray-400" />
              <span>Prescribed By: {medication.prescribing_doctor}</span>
            </div>
          </div>

          {(medication.start_date ||
            medication.end_date ||
            medication.refill_due) && (
            <div className="mt-2 pl-1 flex flex-wrap items-center gap-3 md:text-sm text-xs text-gray-600">
              {medication?.start_date && (
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                  <ICONS.calendar size={14} className="text-blue-400" />
                  <span>Start: {medication.start_date}</span>
                </div>
              )}
              {medication?.end_date && (
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                  <ICONS.calendar size={14} className="text-red-400" />
                  <span>End: {medication.end_date}</span>
                </div>
              )}
              {medication?.refill_due && (
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                  <ICONS.calendar size={14} className="text-orange-400" />
                  <span>Refill: {medication.refill_due}</span>
                </div>
              )}
            </div>
          )}
          {medication?.notes && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm italic text-gray-600">
                {medication?.notes}
              </p>
            </div>
          )}
        </div>
        <div className="mt-4 flex items-start gap-2 md:mt-0 md:ml-4">
          {showActions && (
            <ActionButtons
              editLabel="Edit Medication"
              deleteLabel="Delete Medication"
              onEdit={() => onEdit?.(medication)}
              onDelete={() => setIsDeleteModalOpen(true)}
              isDeleting={isDeleting}
            />
          )}
          <ConfirmationModal
            title="Delete Medication"
            isModalOpen={isDeleteModalOpen}
            onOk={handleDeleteMedication}
            onCancel={() => setIsDeleteModalOpen(false)}
          >
            <p>Are you sure you want to delete this medication?</p>
          </ConfirmationModal>
        </div>
      </div>
    </BorderedCard>
  );
};
