import {
  ActionButtons,
  BorderedCard,
  ConfirmationModal,
} from "@agensy/components";
import { ICONS } from "@agensy/constants";
import type { ClientMedications } from "@agensy/types";
import { DateUtils } from "@agensy/utils";
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

  const truncateText = (text: string): string => {
    return text.length > 30 ? text.substring(0, 30) + "..." : text;
  };

  const handleDeleteMedication = () => {
    setIsDeleteModalOpen(false);
    onDelete?.(medication);
  };
  return (
    <BorderedCard className="!p-4">
      <div className="flex flex-col gap-2 lg:flex-row items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-3">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700">
              <ICONS.medicine size={16} />
            </span>
            <div className="md:text-lg text-sm font-semibold text-gray-800 truncate">
              {truncateText(medication?.medication_name || "")}
            </div>
            {medication.dosage && (
              <div className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium text-xs md:text-sm">
                {medication?.dosage}
              </div>
            )}
            {medication.purpose && (
              <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium text-xs md:text-sm">
                {medication?.purpose}
              </div>
            )}
          </div>

          <div className="mt-2 pl-2.5 flex flex-wrap items-center gap-2 text-xs text-gray-600">
            {medication?.frequency && (
              <React.Fragment>
                <div className="flex items-center gap-1">
                  <ICONS.clockCircle size={14} className="text-gray-400" />
                  <span>{medication?.frequency}</span>
                </div>
                <span className="text-gray-300">•</span>
              </React.Fragment>
            )}
            <div className="flex items-center gap-1">
              <ICONS.doctor size={14} className="text-gray-400" />
              <span>
                Prescribed By:{" "}
                {medication.prescribing_doctor
                  ? medication?.prescribing_doctor
                  : "NONE"}
              </span>
            </div>
          </div>

          {(medication?.start_date ||
            medication?.end_date ||
            medication?.refill_due) && (
            <div className="mt-1.5 pl-1 flex flex-wrap items-center gap-3 text-xs text-gray-600">
              {medication?.start_date && (
                <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded-md">
                  <ICONS.calendar size={14} className="text-blue-400" />
                  <span>
                    Start:{" "}
                    {DateUtils.formatDateToRequiredFormat(
                      medication?.start_date as string
                    )}
                  </span>
                </div>
              )}
              {medication?.end_date && (
                <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded-md">
                  <ICONS.calendar size={14} className="text-red-400" />
                  <span>
                    End:{" "}
                    {DateUtils.formatDateToRequiredFormat(
                      medication?.end_date as string
                    )}
                  </span>
                </div>
              )}
              {medication?.refill_due && (
                <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded-md">
                  <ICONS.calendar size={14} className="text-orange-400" />
                  <span>
                    Refill:{" "}
                    {DateUtils.formatDateToRequiredFormat(
                      medication?.refill_due as string
                    )}
                  </span>
                </div>
              )}
            </div>
          )}
          {medication?.notes && (
            <div className="mt-2 pt-2 border-t border-gray-200 overflow-x-hidden">
              <p className="text-sm break-words break-all whitespace-pre-line italic text-gray-600 max-w-full">
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
