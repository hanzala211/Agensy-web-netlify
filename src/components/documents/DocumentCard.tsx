import { AntdTag, BorderedCard, TertiaryButton } from "@agensy/components";
import { COLORS, DOCUMENT_CATEGORY_OPTIONS, ICONS } from "@agensy/constants";
import type { Document } from "@agensy/types";
import { DateUtils, StringUtils } from "@agensy/utils";

interface DocumentCardProps {
  doc: Document;
  onDelete: (documentId: string, clientId?: string) => void;
  isDeleting?: boolean;
  onPreview?: (documentId: string) => void;
  showLabel?: boolean;
  showClientName?: boolean;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  doc,
  onDelete,
  isDeleting,
  onPreview,
  showLabel = false,
  showClientName = false,
}) => {
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
              Client:{" "}
              <span className="font-semibold">
                {doc?.client?.first_name} {doc?.client?.last_name}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center gap-3 mt-4 md:mt-0">
          <div>
            {showLabel && (
              <AntdTag
                color={
                  doc.upload_type === "client" ? "green" : COLORS.temporaryBlue
                }
              >
                {doc.upload_type === "client" ? "Client" : "General"}
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
            <TertiaryButton
              aria_label="Delete document"
              className={`hover:bg-red-50 hover:text-red-500 hover:border-red-300 ${
                isDeleting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() =>
                onDelete(doc.id as string, doc.client_id as string)
              }
              disabled={isDeleting}
            >
              <ICONS.delete size={16} />
            </TertiaryButton>
          </div>
        </div>
      </div>
    </BorderedCard>
  );
};
