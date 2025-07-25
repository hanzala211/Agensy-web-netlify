import React, { useState } from "react";
import { ICONS } from "@agensy/constants";
import { DateUtils, StringUtils } from "@agensy/utils";
import type { HealthcareProvider } from "@agensy/types";
import { ActionButtons } from "./ActionButtons";
import { BorderedCard, ConfirmationModal } from "@agensy/components";

interface HealthcareProviderProps {
  provider: HealthcareProvider;
  onEdit?: (provider: HealthcareProvider) => void;
  onDelete?: (provider: HealthcareProvider) => void;
  isDeleting?: boolean;
  showActions?: boolean;
}

export const HealthcareProviderItem: React.FC<HealthcareProviderProps> = ({
  onEdit,
  onDelete,
  provider,
  isDeleting,
  showActions = true,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const handleDeleteHealthCare = () => {
    setIsDeleteModalOpen(false);
    onDelete?.(provider as HealthcareProvider);
  };
  return (
    <BorderedCard>
      <div className="flex items-start gap-4">
        <div className="text-blue-500 p-2.5 bg-blue-50 rounded-full border border-blue-100/50 shadow-sm">
          <ICONS.doctor size={22} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-lg font-medium text-gray-800">
                {provider?.provider_name}
              </div>
              {provider?.specialty && (
                <div className="text-sm font-medium text-blue-700 mb-1">
                  {StringUtils.capitalizeFirstLetter(provider?.provider_type)}{" "}
                  {provider?.provider_type && provider?.specialty && "-"}{" "}
                  {provider?.specialty}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {showActions && (
                <ActionButtons
                  editLabel="Edit Healthcare Provider"
                  deleteLabel="Delete Healthcare Provider"
                  onEdit={() => onEdit?.(provider as HealthcareProvider)}
                  onDelete={() => setIsDeleteModalOpen(true)}
                  isDeleting={isDeleting}
                />
              )}
            </div>
          </div>

          <div className="space-y-2 text-gray-700">
            {provider?.address && (
              <div className="flex items-center gap-2">
                <ICONS.home
                  size={16}
                  className="text-gray-400 mt-1 flex-shrink-0"
                />
                <span className="text-sm">{provider?.address}</span>
              </div>
            )}

            {provider?.phone && (
              <div className="flex items-center gap-2">
                <ICONS.phone
                  size={16}
                  className="text-gray-400 flex-shrink-0"
                />
                <span className="text-sm">{provider?.phone}</span>
              </div>
            )}

            {provider?.fax && (
              <div className="flex items-center gap-2">
                <ICONS.fax size={16} className="text-gray-400 flex-shrink-0" />
                <span className="text-sm">Fax: {provider?.fax}</span>
              </div>
            )}

            <div
              className={`flex flex-wrap gap-x-4 gap-y-1 mt-3 pt-3 ${
                provider?.last_visit || provider?.next_visit
                  ? "border-t border-gray-100"
                  : ""
              }`}
            >
              {provider?.last_visit && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">Last Visit:</span>
                  <span className="text-xs font-medium">
                    {DateUtils.formatDateToRequiredFormat(provider?.last_visit)}
                  </span>
                </div>
              )}

              {provider?.next_visit && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">Next Visit:</span>
                  <span className="text-xs font-medium">
                    {DateUtils.formatDateToRequiredFormat(provider?.next_visit)}
                  </span>
                </div>
              )}
            </div>

            {provider?.notes && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm italic text-gray-700">
                  {provider?.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmationModal
        title="Delete Healthcare Provider"
        isModalOpen={isDeleteModalOpen}
        onOk={handleDeleteHealthCare}
        onCancel={() => setIsDeleteModalOpen(false)}
      >
        <p>Are you sure you want to delete this healthcare provider?</p>
      </ConfirmationModal>
    </BorderedCard>
  );
};

export default HealthcareProviderItem;
