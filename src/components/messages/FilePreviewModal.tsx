import React, { useEffect } from "react";
import { ICONS } from "@agensy/constants";

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  fileType: string;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  fileType,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderFileContent = () => {
    switch (fileType) {
      case "image":
        return (
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            <img
              src={fileUrl}
              alt={fileName}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        );
      case "pdf":
        return (
          <div className="relative w-[90vw] h-[90vh] bg-white rounded-lg overflow-hidden">
            <iframe
              src={fileUrl}
              className="w-full h-full border-0"
              title={fileName}
            />
          </div>
        );
      case "document":
      case "other":
        return (
          <div className="relative max-w-[90vw] max-h-[90vh] bg-white rounded-lg p-8 flex flex-col items-center justify-center">
            <div className="text-center">
              <ICONS.fileAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {fileName}
              </h3>
              <p className="text-gray-500 mb-4">
                This file type cannot be previewed
              </p>
              <a
                href={fileUrl}
                download={fileName}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ICONS.download className="w-4 h-4" />
                Download File
              </a>
            </div>
          </div>
        );
      default:
        return (
          <div className="relative max-w-[90vw] max-h-[90vh] bg-white rounded-lg p-8 flex flex-col items-center justify-center">
            <div className="text-center">
              <ICONS.fileAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {fileName}
              </h3>
              <p className="text-gray-500 mb-4">
                This file type cannot be previewed
              </p>
              <a
                href={fileUrl}
                download={fileName}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ICONS.download className="w-4 h-4" />
                Download File
              </a>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200"
        title="Close"
      >
        <ICONS.close className="w-5 h-5 text-white" />
      </button>

      {renderFileContent()}
    </div>
  );
};

export default FilePreviewModal;
