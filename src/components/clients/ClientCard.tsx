import React, { useEffect, useState } from "react";
import type { Client } from "@agensy/types";
import { DateUtils, toast, StringUtils } from "@agensy/utils";
import {
  useDeleteClientMutation,
  useUpdateClientStatusMutation,
} from "@agensy/api";
import { BorderedCard, ConfirmationModal } from "@agensy/components";
import { APP_ACTIONS, COLORS, ROLE_MAP, ROLES } from "@agensy/constants";
import { useAuthContext } from "@agensy/context";
import { Tooltip } from "antd";

interface ClientCardProps {
  client: Client;
  onViewProfile: () => void;
  loadClients?: () => void;
  showStatus?: boolean;
  showActions?: boolean;
  isPrimaryUserSubscribed?: boolean;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onViewProfile,
  loadClients,
  showStatus = true,
  showActions = true,
  isPrimaryUserSubscribed,
}) => {
  const { handleFilterPermission, userData } = useAuthContext();
  const updateClientStatusMutation = useUpdateClientStatusMutation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const deleteClientMutation = useDeleteClientMutation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (updateClientStatusMutation.status === "success") {
      loadClients?.();
      toast.success(
        "Care Recipient Status Updated",
        "Care Recipient status updated successfully"
      );
    } else if (updateClientStatusMutation.status === "error") {
      toast.error(
        "Failed to update care recipient status",
        updateClientStatusMutation.error.message
      );
    }
  }, [updateClientStatusMutation.status]);

  useEffect(() => {
    if (deleteClientMutation.status === "success") {
      loadClients?.();
      toast.success(
        "Care Recipient deleted successfully",
        "The care recipient and all associated data have been permanently removed from the system"
      );
    } else if (deleteClientMutation.status === "error") {
      toast.error(
        "Failed to delete care recipient",
        deleteClientMutation.error.message
      );
    }
  }, [deleteClientMutation.status]);

  const handleToggleActive = (status: boolean) => {
    setIsModalOpen(false);
    updateClientStatusMutation.mutate({ id: String(client.id), status });
  };

  const formatRoleToProperStr = (str: string) => {
    return ROLE_MAP[str] || str;
  };

  const handleDeleteClient = () => {
    setIsDeleteModalOpen(false);
    deleteClientMutation.mutate(client.id as string);
  };

  return (
    <BorderedCard key={client.id}>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-2">
        <div className="md:col-span-1">
          <h2 className="text-lg font-semibold text-darkGray truncate">
            {client.first_name} {client.last_name}
          </h2>
          <div className="flex flex-row gap-4">
            <div className="mt-1 space-y-1 text-sm text-slateGrey">
              <p>
                Role:{" "}
                {formatRoleToProperStr(
                  client.Users.find((user) => user.id === userData?.id)
                    ?.UserRoles.role || "System Admin"
                )}
              </p>
              <p>
                Living:{" "}
                {client.living_situation
                  ? StringUtils.capitalizeFirstLetter(client.living_situation)
                  : "None"}
              </p>
            </div>
            <div className="mt-1 space-y-1 text-sm text-slateGrey">
              <p>
                DOB:{" "}
                {client.date_of_birth
                  ? DateUtils.formatDateToRequiredFormat(
                      client.date_of_birth as string
                    )
                  : "None"}
              </p>
              <p>
                Family Admin:{" "}
                {(() => {
                  const primaryUser = client.Users.find(
                    (item) => item.UserRoles.role === ROLES.PRIMARY_USER
                  );
                  return primaryUser
                    ? `${primaryUser.first_name} ${primaryUser.last_name} ${
                        primaryUser.id === userData?.id ? "(You)" : ""
                      }`
                    : "None";
                })()}
              </p>
            </div>
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
          {/* @ts-expect-error/ TODO TS error */}
          <Tooltip
            title={
              !isPrimaryUserSubscribed
                ? "This care recipient's family admin's subscription has expired"
                : ""
            }
            open={!isPrimaryUserSubscribed ? undefined : false}
            color={COLORS.primaryColor}
            key={COLORS.primaryColor}
          >
            <button
              className={`text-primaryColor ${
                !isPrimaryUserSubscribed
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-basicBlue"
              } transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryColor py-1 px-2 rounded-md mr-2`}
              onClick={onViewProfile}
              aria-label={`View ${
                showStatus ? "profile" : "appointments"
              } for ${client.first_name}`}
              disabled={!isPrimaryUserSubscribed}
            >
              {showStatus ? "View Profile" : "View Appointments"}
            </button>
          </Tooltip>
          {showActions &&
            handleFilterPermission(
              client.id as string,
              APP_ACTIONS.ChangeClientStatus
            ) && (
              //  @ts-expect-error/ TODO TS error
              <Tooltip
                title={
                  !isPrimaryUserSubscribed
                    ? "This care recipient's family admin's subscription has expired"
                    : ""
                }
                open={!isPrimaryUserSubscribed ? undefined : false}
                color={COLORS.primaryColor}
                key={COLORS.primaryColor}
              >
                <button
                  className={`text-sm ${
                    updateClientStatusMutation.isPending ||
                    !isPrimaryUserSubscribed
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
                  disabled={
                    updateClientStatusMutation.isPending ||
                    !isPrimaryUserSubscribed
                  }
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
              </Tooltip>
            )}
          {showActions &&
            handleFilterPermission(
              client.id as string,
              APP_ACTIONS.ChangeClientStatus
            ) && (
              <button
                disabled={
                  deleteClientMutation.isPending || !isPrimaryUserSubscribed
                }
                onClick={() => setIsDeleteModalOpen(true)}
                className={`text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 py-1 px-2 rounded-md transition-colors duration-200 text-basicRed hover:text-darkRed focus:ring-basicRed ${
                  deleteClientMutation.isPending || !isPrimaryUserSubscribed
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {/*  @ts-expect-error/ TODO TS error */}
                <Tooltip
                  title={
                    !isPrimaryUserSubscribed
                      ? "This care recipient's family admin's subscription has expired"
                      : ""
                  }
                  open={!isPrimaryUserSubscribed ? undefined : false}
                  color={COLORS.primaryColor}
                  key={COLORS.primaryColor}
                >
                  {deleteClientMutation.isPending ? "Deleting..." : "Delete"}
                </Tooltip>
              </button>
            )}
          <ConfirmationModal
            title="Delete client"
            isModalOpen={isDeleteModalOpen}
            onOk={() => handleDeleteClient()}
            onCancel={() => setIsDeleteModalOpen(false)}
          >
            <p>
              Are you sure you want to permanently delete this care recipient?
              This action cannot be undone and will remove all associated data
              including appointments, documents, and medical records.
            </p>
          </ConfirmationModal>
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
