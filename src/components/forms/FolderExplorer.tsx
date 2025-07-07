import React, { useCallback, useMemo } from "react";
import { ICONS } from "@agensy/constants";
import { FileContentDisplay } from "./FileContentDisplay";
import type {
  FaceSheetLongFormData,
  FaceSheetShortFormData,
  FolderData,
  FolderItem,
  HealthHistoryFormData,
} from "@agensy/types";
import { TertiaryButton } from "@agensy/components";
import { useClientContext } from "@agensy/context";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useParams } from "react-router-dom";
import FaceSheetLongFormPDF from "./face-sheet-long/FaceSheetLongFormPDF";
import FaceSheetShortFormPDF from "./face-sheet-short/FaceSheetShortFormPDF";
import HealthHistoryFormPDF from "./health-history-form/HealthHistoryFormPDF";

interface FolderExplorerProps {
  folders: FolderItem[];
  onFolderClick?: (folderId: string) => void;
  onFileClick?: (fileId: string) => void;
  onFileClose?: () => void;
  selectedItem?: string;
  currentPath?: string[];
  onBackClick?: () => void;
  onPathClick?: (pathIndex: number) => void;
  fileContent?: FolderData;
}

export const FolderExplorer: React.FC<FolderExplorerProps> = ({
  folders,
  onFolderClick,
  onFileClick,
  onFileClose,
  selectedItem,
  currentPath = [],
  onBackClick,
  onPathClick,
  fileContent,
}) => {
  const { setOpenedFileData, openedFileData } = useClientContext();
  const params = useParams();
  const isShowingFileContent = useMemo(
    () => selectedItem && fileContent,
    [selectedItem, fileContent]
  );
  const showBackButton = useMemo(
    () => currentPath.length > 0 || isShowingFileContent,
    [currentPath, isShowingFileContent]
  );

  const handleItemClick = (item: FolderItem) => {
    if (item.type === "folder") {
      onFolderClick?.(item.id);
    } else {
      onFileClick?.(item.id);
    }
  };

  const handleBackButtonClick = () => {
    if (isShowingFileContent) {
      onFileClose?.();
      setOpenedFileData(null);
    } else {
      onBackClick?.();
    }
  };

  const getPDFDocument = useCallback(() => {
    switch (params.formSlug) {
      case "face-sheet-long":
        return (
          <FaceSheetLongFormPDF
            data={openedFileData as unknown as FaceSheetLongFormData}
          />
        );
      case "face-sheet-short":
        return (
          <FaceSheetShortFormPDF
            data={openedFileData as unknown as FaceSheetShortFormData}
          />
        );
      case "health-history-form-medical":
        return (
          <HealthHistoryFormPDF
            data={openedFileData as unknown as HealthHistoryFormData}
          />
        );
      default:
        return <></>;
    }
  }, [params.formSlug, openedFileData]);

  const renderGridItem = (item: FolderItem) => {
    const isSelected = selectedItem === item.id;
    const Icon = item.type === "folder" ? ICONS.folder : ICONS.fileAlt;

    return (
      <div
        key={item.id}
        className={`
          flex flex-col items-center p-6 rounded-xl cursor-pointer transition-all duration-200
          hover:bg-blue-50 hover:shadow-md border-2 border-transparent
          ${
            isSelected
              ? "bg-blue-50 border-blue-200 shadow-md"
              : "hover:border-blue-100"
          }
        `}
        onClick={() => handleItemClick(item)}
      >
        <div className="mb-4">
          <Icon
            size={64}
            className={`${
              item.type === "folder" ? "text-blue-600" : "text-gray-600"
            } drop-shadow-sm`}
          />
        </div>
        <span className="text-sm font-medium text-gray-800 text-center leading-tight">
          {item.name}
        </span>
        {item.children && item.children.length > 0 && (
          <span className="text-xs text-gray-500 mt-1">
            {item.children.length} items
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="!p-0 overflow-hidden border-2 border-gray-200 rounded-lg">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center gap-3 ${
              isShowingFileContent ? "w-full" : "w-fit"
            }`}
          >
            {showBackButton && (
              <button
                onClick={handleBackButtonClick}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ICONS.leftArrow size={18} className="text-gray-600" />
              </button>
            )}
            <h3 className={`font-semibold text-gray-800 w-full`}>
              {isShowingFileContent ? (
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="flex items-center gap-2">
                    <ICONS.fileAlt className="text-gray-600" />
                    {fileContent?.name}
                  </div>
                  {openedFileData && (
                    <PDFDownloadLink
                      document={getPDFDocument()}
                      fileName={`${fileContent?.name}.pdf`}
                    >
                      <TertiaryButton
                        aria_label="Download PDF"
                        className="hover:bg-green-50 shadow-none hover:text-green-500 hover:border-green-300 bg-transparent"
                      >
                        <span className="flex items-center gap-2">
                          <ICONS.download />
                        </span>
                      </TertiaryButton>
                    </PDFDownloadLink>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ICONS.folder className="text-blue-600" />
                  {currentPath.length > 0
                    ? currentPath[currentPath.length - 1]
                    : "Agensy Forms"}
                </div>
              )}
            </h3>
          </div>
          {!isShowingFileContent && currentPath.length > 0 && (
            <div className="text-sm text-gray-500">{folders.length} items</div>
          )}
        </div>
        {!isShowingFileContent && currentPath.length > 0 && (
          <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
            <span
              className="hover:text-blue-600 cursor-pointer transition-colors"
              onClick={() => onPathClick?.(-1)}
            >
              Agensy Forms
            </span>
            {currentPath.map((pathSegment, index) => (
              <React.Fragment key={index}>
                <span className="text-gray-300">{">"}</span>
                <span
                  className="hover:text-blue-600 cursor-pointer transition-colors"
                  onClick={() => onPathClick?.(index)}
                >
                  {pathSegment}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {isShowingFileContent ? (
        <FileContentDisplay fileContent={fileContent as FolderData} />
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {folders.map((folder) => renderGridItem(folder))}
          </div>
          {folders.length === 0 && (
            <div className="text-center py-12">
              <ICONS.folder size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">This folder is empty</p>
              <p className="text-sm text-gray-400 mt-1">No items to display</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FolderExplorer;
