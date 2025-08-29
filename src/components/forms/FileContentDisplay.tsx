import React from "react";
import { ICONS } from "@agensy/constants";
import type { FolderData } from "@agensy/types";

interface FileContentDisplayProps {
  fileContent: FolderData;
}

export const FileContentDisplay: React.FC<FileContentDisplayProps> = ({
  fileContent,
}) => {
  return (
    <div className="md:p-6 p-3 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <ICONS.fileAlt size={32} className="text-gray-600" />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {fileContent.name}
          </h2>
          {fileContent.description && (
            <p className="text-gray-600 mt-1">{fileContent.description}</p>
          )}
        </div>
      </div>

      <div>{fileContent.content}</div>
    </div>
  );
};

export default FileContentDisplay;
