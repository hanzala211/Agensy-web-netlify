import React from "react";
import { ActionButtons, AntdTag, BorderedCard } from "@agensy/components";
import { COLORS } from "@agensy/constants";

interface ContactItemProps {
  label: string;
  children: React.ReactNode;
  onEdit?: () => void;
  className?: string;
  onDelete?: () => void;
  type?: "primary" | "secondary" | "emergency";
  isDeleting?: boolean;
  showActions?: boolean;
}

export const ContactItem: React.FC<ContactItemProps> = ({
  label,
  children,
  onEdit = () => {},
  className = "",
  onDelete,
  type = "primary",
  isDeleting = false,
  showActions = true,
}) => {
  return (
    <div
      className={`group grid grid-cols-[1fr,auto] gap-3 lg:gap-4 items-center rounded-xl ${className}`}
    >
      <div className="flex flex-col">
        <BorderedCard
          className={`flex justify-between md:items-center ${
            type === "primary"
              ? ""
              : type === "secondary"
              ? "!border-green-500"
              : "border-red-500"
          }`}
        >
          {children}
          <div className="flex md:flex-col items-center gap-2">
            <AntdTag
              color={
                type === "primary"
                  ? COLORS.temporaryBlue
                  : type === "secondary"
                  ? "green"
                  : "error"
              }
            >
              {label}
            </AntdTag>
            {showActions && (
              <div className="flex flex-row gap-2">
                <ActionButtons
                  editLabel="Edit Contact"
                  deleteLabel="Delete Contact"
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isDeleting={isDeleting}
                />
              </div>
            )}
          </div>
        </BorderedCard>
      </div>
    </div>
  );
};

export default ContactItem;
