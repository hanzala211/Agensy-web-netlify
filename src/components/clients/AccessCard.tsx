import React, { useMemo, useState } from "react";
import {
  ActionButtons,
  AntdTag,
  BorderedCard,
  ConfirmationModal,
} from "@agensy/components";
import {
  COLORS,
  ACCESS_ROLE_OPTIONS,
  RELATIONSHIP_TO_CLIENT,
} from "@agensy/constants";
import type { AccessInfo } from "@agensy/types";
import { DateUtils } from "@agensy/utils";
import { useAuthContext } from "@agensy/context";

interface AccessCardProps {
  access: AccessInfo;
  onDelete?: () => void;
  isDeleting?: boolean;
  onEdit?: () => void;
}

export const AccessCard: React.FC<AccessCardProps> = ({
  access,
  onDelete,
  isDeleting,
  onEdit,
}) => {
  const { userData } = useAuthContext();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const relationship = useMemo(
    () =>
      RELATIONSHIP_TO_CLIENT.find((item) => item.value === access.relation)
        ?.label,
    [access.relation]
  );

  const role = useMemo(
    () =>
      ACCESS_ROLE_OPTIONS.find((item) => item.value === access.role)?.label ||
      "Primary User",
    [access.role]
  );

  const handleDeleteUser = () => {
    setIsDeleteModalOpen(false);
    onDelete?.();
  };

  return (
    <BorderedCard className="relative">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-gray-900 mb-1 truncate">
                {access.first_name} {access.last_name}{" "}
                {access.relation && (
                  <p className="text-gray-500">({relationship})</p>
                )}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 text-sm">
            <div className="flex flex-col gap-2 text-gray-600">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm font-medium text-gray-700 sm:min-w-[100px] flex-shrink-0">
                  Email:
                </span>
                <span className="text-sm text-gray-600 break-all">
                  {access.email || "Not provided"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm font-medium text-gray-700 sm:min-w-[100px] flex-shrink-0">
                  Phone:
                </span>
                <span className="text-sm text-gray-600">
                  {access.phone || "Not provided"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {access.role !== "primary_user" && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 sm:min-w-[100px] flex-shrink-0">
                    Assigned by:
                  </span>
                  <span className="text-sm text-gray-600">
                    {userData?.first_name} {userData?.last_name}
                  </span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm font-medium text-gray-700 sm:min-w-[100px] flex-shrink-0">
                  Assigned at:
                </span>
                <span className="text-sm text-gray-600">
                  {DateUtils.formatDateTime(String(access.createdAt)) ||
                    "Not provided"}{" "}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 md:items-end items-start lg:min-w-[200px]">
          <div className="flex gap-2 items-start lg:self-stretch lg:justify-end">
            <AntdTag
              color={
                access.role === "family_member"
                  ? "green"
                  : access.role === "caregiver"
                  ? "orange"
                  : COLORS.temporaryBlue
              }
            >
              {role}
            </AntdTag>
          </div>
          {userData?.cognito_id !== access?.cognito_id && (
            <div className="flex gap-2 items-start lg:self-stretch lg:justify-end">
              <ActionButtons
                onDelete={() => setIsDeleteModalOpen(true)}
                isDeleting={isDeleting}
                deleteLabel={`Remove contact ${access.first_name} ${access.last_name}`}
                editLabel={`Edit contact ${access.first_name} ${access.last_name}`}
                onEdit={onEdit}
              />
              <ConfirmationModal
                title="Delete User"
                isModalOpen={isDeleteModalOpen}
                onOk={handleDeleteUser}
                onCancel={() => setIsDeleteModalOpen(false)}
              >
                <p>Are you sure you want to delete this user?</p>
              </ConfirmationModal>
            </div>
          )}
        </div>
      </div>
    </BorderedCard>
  );
};
