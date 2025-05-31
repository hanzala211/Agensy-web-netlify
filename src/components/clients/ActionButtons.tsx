import React from "react";
import { ICONS } from "@agensy/constants";
import { TertiaryButton } from "@agensy/components";

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  editLabel?: string;
  deleteLabel?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEdit,
  onDelete,
  isDeleting,
  editLabel,
  deleteLabel,
}) => {
  return (
    <React.Fragment>
      <TertiaryButton
        onClick={onEdit}
        aria_label={editLabel}
        className="hover:bg-blue-50 hover:text-blue-500 hover:border-blue-300"
      >
        <ICONS.edit />
      </TertiaryButton>
      <TertiaryButton
        onClick={onDelete}
        disabled={isDeleting}
        aria_label={deleteLabel}
        className={`hover:bg-red-50 hover:text-red-500 hover:border-red-300 ${
          isDeleting ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <ICONS.delete />
      </TertiaryButton>
    </React.Fragment>
  );
};
