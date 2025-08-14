import React, { useMemo, useEffect, useState } from "react";
import { ICONS } from "@agensy/constants";
import { FileContentDisplay } from "./FileContentDisplay";
import type {
  BurialInstructionsFormData,
  CareRecipientQuestionnaireData,
  ComprehensiveCarePlanFormData,
  FaceSheetLongFormData,
  FaceSheetShortFormData,
  FolderData,
  FolderItem,
  HealthHistoryFormData,
  InitialCareAssessmentPlanFormData,
  MedicalAppointmentTemplateData,
} from "@agensy/types";
import { OCRModel, TertiaryButton } from "@agensy/components";
import { useClientContext } from "@agensy/context";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useParams } from "react-router-dom";
import FaceSheetLongFormPDF from "./face-sheet-long/FaceSheetLongFormPDF";
import FaceSheetShortFormPDF from "./face-sheet-short/FaceSheetShortFormPDF";
import HealthHistoryFormPDF from "./health-history-form/HealthHistoryFormPDF";
import { StartofCareChecklistPDF } from "./start-of-care-checklist/StartofCareChecklistPDF";
import { checklistSchema } from "@agensy/config";
import EssentialDocumentsForAgingPDF from "./essential-documents-for-aging/EssentialDocumentsForAgingPDF";
import CareRecipientQuestionairePDF from "./care-recipient-questionaire/CareRecipientQuestionairePDF";
import { HospitalizationChecklistPDF } from "./hospitalization-checklist/HospitalizationChecklistPDF";
import { CarePlanChecklistPDF } from "./care-plan-checklist/CarePlanChecklistPDF";
import { MoveInPDF } from "./move-in-checklist/MoveInPDF";
import { NextStepsAfterDeathPDF } from "./next-steps-after-death-checklist/NextStepsAfterDeathPDF";
import { MedicareCheatSheetPDF } from "./medicare-cheat-sheet/MedicareCheatSheetPDF";
import { LongTermCareInsurancePolicyPDF } from "./long-term-care-insurance-policy/LongTermCareInsurancePolicyPDF";
import { CaregiverInformationPDF } from "./caregiver-information/CaregiverInformationPDF";
import MedicalAppointmentTemplatePDF from "./medical-appointment-template/MedicalAppointmentTemplatePDF";
import InitialCareAssessmentPlanPDF from "./initial-care-assessment/InitialCareAssessmentPlanPDF";
import ComprehensiveCarePlanPDF from "./comprehensive-care-plan/ComprehensiveCarePlanPDF";
import BurialInstructionsPDF from "./burial-instructions/BurialInstructionsPDF";

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
  const { setOpenedFileData, openedFileData, setOcrResult } =
    useClientContext();
  const [isOCRModelOpen, setIsOCRModelOpen] = useState<boolean>(false);
  const params = useParams();

  useEffect(() => {
    return () => {
      setOpenedFileData(null);
    };
  }, [params.clientId, params.formSlug, setOpenedFileData]);

  useEffect(() => {
    setOpenedFileData(null);
  }, [params.formSlug, setOpenedFileData]);
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

  const pdfDocument = useMemo(() => {
    if (!openedFileData || typeof openedFileData !== "object") {
      return null;
    }

    try {
      const hasValidData =
        openedFileData &&
        typeof openedFileData === "object" &&
        Object.keys(openedFileData).length > 0;

      if (!hasValidData) {
        return null;
      }

      if (!params.formSlug) {
        console.warn("No form slug provided for PDF generation");
        return null;
      }

      switch (params.formSlug) {
        case "face-sheet-long":
          if (openedFileData && typeof openedFileData === "object") {
            return (
              <FaceSheetLongFormPDF
                data={
                  openedFileData as unknown as FaceSheetLongFormData & {
                    last_update: { updatedAt: string };
                  }
                }
              />
            );
          }
          break;
        case "face-sheet-short":
          if (openedFileData && typeof openedFileData === "object") {
            return (
              <FaceSheetShortFormPDF
                data={
                  openedFileData as unknown as FaceSheetShortFormData & {
                    last_update: { updatedAt: string };
                  }
                }
              />
            );
          }
          break;
        case "health-history-form-medical":
          if (openedFileData && typeof openedFileData === "object") {
            console.log(openedFileData);
            return (
              <HealthHistoryFormPDF
                data={
                  openedFileData as unknown as HealthHistoryFormData & {
                    last_update: { updatedAt: string };
                  }
                }
              />
            );
          }
          break;
        case "start-of-care-checklist":
          if (openedFileData && typeof openedFileData === "object") {
            return (
              <StartofCareChecklistPDF
                data={
                  openedFileData as unknown as {
                    [key: string]: boolean | string;
                  } & {
                    last_update: { updatedAt: string };
                  }
                }
                schema={checklistSchema}
              />
            );
          }
          break;
        case "essential-document-for-aging":
          if (openedFileData && typeof openedFileData === "object") {
            return (
              <EssentialDocumentsForAgingPDF
                data={
                  openedFileData as unknown as {
                    essential_documents: {
                      id: string;
                      category: string;
                      document_name: string;
                      in_place: boolean;
                      notes?: string | null;
                    }[];
                    last_update?: { updatedAt: string };
                  }
                }
              />
            );
          }
          break;
        case "care-recipient-questionnaire":
          if (openedFileData && typeof openedFileData === "object") {
            return (
              <CareRecipientQuestionairePDF
                data={
                  openedFileData as unknown as CareRecipientQuestionnaireData & {
                    last_update: { updatedAt: string };
                  }
                }
              />
            );
          }
          break;
        case "initial-assessment":
          if (openedFileData && typeof openedFileData === "object") {
            return (
              <InitialCareAssessmentPlanPDF
                data={
                  openedFileData as unknown as InitialCareAssessmentPlanFormData & {
                    last_update: { updatedAt: string };
                  }
                }
              />
            );
          }
          break;
        case "hospital-checklist":
          if (openedFileData && typeof openedFileData === "object") {
            return (
              <HospitalizationChecklistPDF
                data={
                  openedFileData as unknown as {
                    [key: string]: boolean | string;
                  } & {
                    last_update: { updatedAt: string };
                  }
                }
              />
            );
          }
          break;
        case "care-plan-checklists":
          if (openedFileData && typeof openedFileData === "object") {
            return (
              <CarePlanChecklistPDF
                data={
                  openedFileData as unknown as {
                    [key: string]: boolean | string;
                  } & {
                    last_update: { updatedAt: string };
                  }
                }
              />
            );
          }
          break;
        case "move-in-checklist":
          if (openedFileData && typeof openedFileData === "object") {
            return (
              <MoveInPDF
                data={
                  openedFileData as unknown as {
                    [key: string]: boolean | string;
                  } & {
                    last_update: { updatedAt: string };
                  }
                }
              />
            );
          }
          break;
        case "next-steps-after-death":
          if (openedFileData && typeof openedFileData === "object") {
            return (
              <NextStepsAfterDeathPDF
                data={
                  openedFileData as unknown as {
                    [key: string]: boolean | string;
                  } & {
                    last_update: { updatedAt: string };
                  }
                }
              />
            );
          }
          break;
        case "medicare-cheat-sheet":
          if (openedFileData && typeof openedFileData === "object") {
            return (
              <MedicareCheatSheetPDF
                data={
                  openedFileData as unknown as {
                    [key: string]: boolean | string;
                  } & {
                    last_update: { updatedAt: string };
                  }
                }
              />
            );
          }
          break;
        case "long-term-care-insurance-policy":
          if (openedFileData && typeof openedFileData === "object") {
            return (
              <LongTermCareInsurancePolicyPDF
                data={
                  openedFileData as unknown as {
                    [key: string]: boolean | string;
                  } & {
                    last_update: { updatedAt: string };
                  }
                }
              />
            );
          }
          break;
        case "caregiver-information":
          if (openedFileData && typeof openedFileData === "object") {
            return (
              <CaregiverInformationPDF
                data={
                  openedFileData as unknown as {
                    [key: string]: boolean | string;
                  } & {
                    last_update: { updatedAt: string };
                  }
                }
              />
            );
          }
          break;
        case "medical-appointment-template":
          if (openedFileData && typeof openedFileData === "object") {
            return (
              <MedicalAppointmentTemplatePDF
                data={
                  openedFileData as unknown as MedicalAppointmentTemplateData & {
                    last_update: { updatedAt: string };
                  }
                }
              />
            );
          }
          break;
        case "comprehensive-care-plan-assessment":
          if (openedFileData && typeof openedFileData === "object") {
            return (
              <ComprehensiveCarePlanPDF
                data={
                  openedFileData as unknown as ComprehensiveCarePlanFormData & {
                    last_update: { updatedAt: string };
                  }
                }
              />
            );
          }
          break;
        case "burial-instructions":
          if (openedFileData && typeof openedFileData === "object") {
            return (
              <BurialInstructionsPDF
                data={
                  openedFileData as unknown as BurialInstructionsFormData & {
                    last_update: { updatedAt: string };
                  }
                }
              />
            );
          }
          break;
        default:
          console.warn(`Unknown form type: ${params.formSlug}`);
          return null;
      }

      return null;
    } catch (error) {
      console.error("Error creating PDF document:", error);
      return null;
    }
  }, [params.formSlug, openedFileData]);

  const showOCRButton = useMemo(() => {
    return (
      params.formSlug === "face-sheet-short" ||
      params.formSlug === "face-sheet-long" ||
      params.formSlug === "health-history-form-medical"
    );
  }, [params.formSlug]);

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
            className={`flex items-center sm:gap-3 ${
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
                <div className="flex items-center justify-between sm:flex-row flex-col w-full gap-2">
                  <div className="flex items-center gap-2">
                    <ICONS.fileAlt className="text-gray-600" />
                    {fileContent?.name}
                  </div>
                  <div className="flex items-center gap-2">
                    {showOCRButton && (
                      <TertiaryButton
                        onClick={() => setIsOCRModelOpen(true)}
                        aria_label="Upload OCR"
                        className="hover:bg-blue-50 !border-gray-500 shadow-none hover:text-blue-500 hover:!border-blue-300 bg-transparent"
                      >
                        <span className="flex items-center gap-2">
                          Scan Document
                        </span>
                      </TertiaryButton>
                    )}
                    <OCRModel
                      onSubmitProp={(data) => setOcrResult(data)}
                      isOpen={isOCRModelOpen}
                      onClose={() => setIsOCRModelOpen(false)}
                    />
                    {openedFileData &&
                      pdfDocument &&
                      typeof openedFileData === "object" &&
                      Object.keys(openedFileData).length > 0 && (
                        <PDFDownloadLink
                          document={pdfDocument}
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
