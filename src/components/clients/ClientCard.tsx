import React, { useEffect, useState } from "react";
import type { Client } from "@agensy/types";
import { DateUtils, toast, StringUtils } from "@agensy/utils";
import { useUpdateClientStatusMutation } from "@agensy/api";
import { BorderedCard, ConfirmationModal } from "@agensy/components";
import { APP_ACTIONS, PERMISSIONS } from "@agensy/constants";
import { useAuthContext } from "@agensy/context";

interface ClientCardProps {
  client: Client;
  onViewProfile: () => void;
  loadClients?: () => void;
  showStatus?: boolean;
  showActions?: boolean;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onViewProfile,
  loadClients,
  showStatus = true,
  showActions = true,
}) => {
  const { userData } = useAuthContext();
  const updateClientStatusMutation = useUpdateClientStatusMutation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const userPermissions =
    PERMISSIONS[userData?.role as keyof typeof PERMISSIONS] || [];

  useEffect(() => {
    if (updateClientStatusMutation.status === "success") {
      loadClients?.();
      toast.success(
        "Client Status Updated",
        "Client status updated successfully"
      );
    } else if (updateClientStatusMutation.status === "error") {
      toast.error(
        "Failed to update client status",
        updateClientStatusMutation.error.message
      );
    }
  }, [updateClientStatusMutation.status]);

  const handleToggleActive = (status: boolean) => {
    setIsModalOpen(false);
    updateClientStatusMutation.mutate({ id: String(client.id), status });
  };

  return (
    <BorderedCard key={client.id}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-2">
        <div className="md:col-span-1">
          <h2 className="text-lg font-semibold text-darkGray truncate">
            {client.first_name} {client.last_name}
          </h2>
          <div className="mt-1 space-y-1 text-sm text-slateGrey">
            <p>
              DOB:{" "}
              {DateUtils.formatDateToRequiredFormat(
                client.date_of_birth as string
              )}
            </p>
            <p>
              Living:{" "}
              {StringUtils.capitalizeFirstLetter(client.living_situation)}
            </p>
          </div>
        </div>

        <div className="md:col-span-1 flex flex-col justify-center mt-3 md:mt-0">
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2 text-darkGray">
              Status:
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                client.active
                  ? "bg-lightGreen text-darkGreen"
                  : "bg-lightRed text-basicRed"
              }`}
            >
              {client.active ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="text-sm text-slateGrey mt-1">
            Last Updated:{" "}
            {DateUtils.formatRelativeTime(String(client.updatedAt))}
          </p>
        </div>

        <div className="md:col-span-1 flex items-center justify-start md:justify-end mt-3 md:mt-0">
          <button
            className="text-primaryColor hover:text-basicBlue transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryColor py-1 px-2 rounded-md mr-2"
            onClick={onViewProfile}
            aria-label={`View ${showStatus ? "profile" : "appointments"} for ${
              client.first_name
            }`}
          >
            {showStatus ? "View Profile" : "View Appointments"}
          </button>
          {showActions &&
            userPermissions.includes(APP_ACTIONS.ChangeClientStatus) && (
              <button
                className={`text-sm ${
                  updateClientStatusMutation.isPending
                    ? "opacity-50 cursor-not-allowed"
                    : "opacity-100 cursor-pointer"
                } font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 py-1 px-2 rounded-md transition-colors duration-200 ${
                  client.active
                    ? "text-basicRed hover:text-darkRed focus:ring-basicRed"
                    : "text-darkGreen hover:text-darkGreen focus:ring-darkGreen"
                }`}
                onClick={() => {
                  if (!client.active) {
                    handleToggleActive(!client.active);
                  } else {
                    setIsModalOpen(true);
                  }
                }}
                disabled={updateClientStatusMutation.isPending}
                aria-label={
                  client.active ? "Deactivate client" : "Activate client"
                }
              >
                {updateClientStatusMutation.isPending
                  ? "Updating..."
                  : client.active
                  ? "Deactivate"
                  : "Activate"}
              </button>
            )}
        </div>
      </div>
      <ConfirmationModal
        title="Deactivate Client"
        isModalOpen={isModalOpen}
        onOk={() => handleToggleActive(!client.active)}
        onCancel={() => setIsModalOpen(false)}
      >
        <p>Are you sure you want to deactivate this client?</p>
      </ConfirmationModal>
    </BorderedCard>
  );
};

export default ClientCard;
