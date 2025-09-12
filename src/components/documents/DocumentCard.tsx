import {
  AntdTag,
  BorderedCard,
  ConfirmationModal,
  TertiaryButton,
} from "@agensy/components";
import {
  APP_ACTIONS,
  COLORS,
  DOCUMENT_CATEGORY_OPTIONS,
  ICONS,
  PERMISSIONS,
} from "@agensy/constants";
import { useAuthContext } from "@agensy/context";
import type { Document } from "@agensy/types";
import { DateUtils, StringUtils } from "@agensy/utils";
import { useState } from "react";

interface DocumentCardProps {
  doc: Document;
  onDelete?: (documentId: string, clientId?: string) => void;
  isDeleting?: boolean;
  onPreview?: (documentId: string) => void;
  showLabel?: boolean;
  showClientName?: boolean;
  showActions?: boolean;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  doc,
  onDelete,
  isDeleting,
  onPreview,
  showLabel = false,
  showClientName = false,
  showActions = true,
}) => {
  const { userData } = useAuthContext();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const userPermissions =
    PERMISSIONS[userData?.role as keyof typeof PERMISSIONS] || [];
  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const getFileTypeDisplay = (fileType: string): string => {
    if (fileType.startsWith("image/")) {
      return "Image";
    } else if (fileType === "application/pdf") {
      return "PDF";
    }
    return StringUtils.capitalizeFirstLetter(fileType.split("/")[0]);
  };

  const handleDeleteDocument = () => {
    setIsDeleteModalOpen(false);
    onDelete?.(doc.id as string, doc.client_id as string);
  };

  return (
    <BorderedCard>
      <div className="flex items-start md:flex-row flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ICONS.document />
            <span className="font-semibold text-base">{doc.title}</span>
          </div>
          <div className="text-sm text-gray-500">
            Category:{" "}
            <span className="font-semibold">
              {
                [...(DOCUMENT_CATEGORY_OPTIONS || [])].find(
                  (category) => category.value === doc.category
                )?.label
              }
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Uploaded:{" "}
            <span className="font-semibold">
              {DateUtils.formatRelativeTime(String(doc.createdAt))}{" "}
            </span>
            |{" "}
            <span className="font-semibold">
              {getFileTypeDisplay(doc.file_type)}
            </span>{" "}
            |{" "}
            <span className="font-semibold">
              {formatFileSize(doc.file_size)}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            By:{" "}
            <span className="font-semibold">
              {doc?.uploadedBy?.first_name} {doc?.uploadedBy?.last_name}
            </span>
          </div>
          {showClientName && (
            <div className="text-sm text-gray-500">
              Care Recipient:{" "}
              <span className="font-semibold">
                {doc?.client?.first_name} {doc?.client?.last_name}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col md:items-center items-start gap-3 mt-4 md:mt-0">
          <div>
            {showLabel && (
              <AntdTag
                color={
                  doc.upload_type === "client" ? "green" : COLORS.temporaryBlue
                }
              >
                {doc.upload_type === "client" ? "Care Recipient" : "General"}
              </AntdTag>
            )}
          </div>
          <div className="flex gap-2 items-center">
            <TertiaryButton
              aria_label="Preview document"
              onClick={() => onPreview?.(doc.id as string)}
              className="hover:bg-lightBlue hover:text-blue-500 hover:border-blue-400"
            >
              <ICONS.eyeOn size={16} />
            </TertiaryButton>
            {showActions &&
              userPermissions.includes(APP_ACTIONS.DeleteDocs) && (
                <TertiaryButton
                  aria_label="Delete document"
                  className={`hover:bg-red-50 hover:text-red-500 hover:border-red-300 ${
                    isDeleting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={isDeleting}
                >
                  <ICONS.delete size={16} />
                </TertiaryButton>
              )}
          </div>
        </div>
      </div>
      <ConfirmationModal
        title="Delete Document"
        isModalOpen={isDeleteModalOpen}
        onOk={handleDeleteDocument}
        onCancel={() => setIsDeleteModalOpen(false)}
      >
        <p>Are you sure you want to delete this document?</p>
      </ConfirmationModal>
    </BorderedCard>
  );
};
