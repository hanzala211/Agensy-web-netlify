import React, { useMemo } from "react";
import { ActionButtons, AntdTag, BorderedCard } from "@agensy/components";
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
}

export const AccessCard: React.FC<AccessCardProps> = ({
  access,
  onDelete,
  isDeleting,
}) => {
  const { userData } = useAuthContext();
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

          <div className="flex flex-col lg:flex-row lg:items-center gap-2">
            <div className="space-y-2">
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

            <div className="space-y-2 lg:ml-20">
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

        <div className="flex gap-2 flex-col items-center">
          <div className="flex gap-2">
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
            <div className="flex gap-2">
              <ActionButtons
                onDelete={onDelete}
                isDeleting={isDeleting}
                deleteLabel={`Remove contact ${access.first_name} ${access.last_name}`}
                editLabel={`Edit contact ${access.first_name} ${access.last_name}`}
                onEdit={() => null}
              />
            </div>
          )}
        </div>
      </div>
    </BorderedCard>
  );
};
