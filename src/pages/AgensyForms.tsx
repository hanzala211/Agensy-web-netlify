import React, { useCallback, useEffect, useState } from "react";
import {
  FaceSheetShortForm,
  FolderExplorer,
  FaceSheetLongForm,
  HealthHistoryForm,
  StartofCareChecklist,
  EssentialDocumentForAging,
  CareRecipientQuestionaire,
  HospitalizationChecklist,
  CarePlanChecklist,
  MoveIn,
  NextStepsAfterDeath,
  MedicareCheatSheet,
  LongTermCareInsurancePolicy,
  CaregiverInformation,
} from "@agensy/components";
import type { FolderItem, FolderData } from "@agensy/types";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@agensy/constants";
import { MedicalAppointmentTemplate } from "@agensy/components";

const rootFolders: FolderItem[] = [
  {
    id: "start-of-care",
    slug: "start-of-care",
    name: "Start of Care",
    type: "folder",
    children: [
      {
        id: "start-of-care-checklist",
        name: "Start of Care Checklist",
        type: "file",
        slug: "start-of-care-checklist",
      },
    ],
  },
  {
    id: "assessment",
    slug: "assessment",
    name: "Assessment",
    type: "folder",
    children: [
      {
        id: "comprehensive-care-plan-assessment",
        name: "Comprehensive Care Plan Assessment",
        type: "file",
        slug: "comprehensive-care-plan-assessment",
      },
      {
        id: "care-recipient-questionnaire",
        name: "Care Recipient Questionnaire",
        type: "file",
        slug: "care-recipient-questionnaire",
      },
      {
        id: "initial-assessment",
        name: "Initial Assessment",
        type: "file",
        slug: "initial-assessment",
      },
    ],
  },
  {
    id: "medical",
    slug: "medical",
    name: "Medical",
    type: "folder",
    children: [
      {
        id: "face-sheet-short",
        name: "Face Sheet Short",
        type: "file",
        slug: "face-sheet-short",
      },
      {
        id: "face-sheet-long",
        name: "Face Sheet Long",
        type: "file",
        slug: "face-sheet-long",
      },
      {
        id: "health-history-form-medical",
        name: "Health History Form",
        type: "file",
        slug: "health-history-form-medical",
      },
      {
        id: "medicare-cheat-sheet",
        name: "Medicare Cheat Sheet",
        type: "file",
        slug: "medicare-cheat-sheet",
      },
      {
        id: "medical-appointment-template",
        name: "Medical Appointment Template",
        type: "file",
        slug: "medical-appointment-template",
      },
    ],
  },
  {
    id: "long-term-care-planning",
    slug: "long-term-care-planning",
    name: "Long Term Care Planning",
    type: "folder",
    children: [
      {
        id: "long-term-care-insurance-policy",
        name: "Long Term Care Insurance Policy",
        type: "file",
        slug: "long-term-care-insurance-policy",
      },
    ],
  },
  {
    id: "caregiver",
    slug: "caregiver",
    name: "Caregiver",
    type: "folder",
    children: [
      {
        id: "caregiver-information",
        name: "Caregiver Information",
        type: "file",
        slug: "caregiver-information",
      },
    ],
  },
  {
    id: "care-plans",
    slug: "care-plans",
    name: "Care Plans",
    type: "folder",
    children: [
      {
        id: "care-plan-checklists",
        name: "Care plan checklist",
        type: "file",
        slug: "care-plan-checklists",
      },
    ],
  },
  {
    id: "checklists",
    slug: "checklists",
    name: "Checklists",
    type: "folder",
    children: [
      {
        id: "move-in-checklist",
        name: "Move in",
        type: "file",
        slug: "move-in-checklist",
      },
      {
        id: "hospital-checklist",
        name: "Hospitalization Checklist",
        type: "file",
        slug: "hospital-checklist",
      },
      {
        id: "essential-document-for-aging",
        name: "Essential Document for Aging",
        type: "file",
        slug: "essential-document-for-aging",
      },
      {
        id: "next-steps-after-death",
        name: "Next Steps after Death",
        type: "file",
        slug: "next-steps-after-death",
      },
    ],
  },
];

const fileMap: Record<string, FolderData> = {
  // Start of Care files
  "start-of-care-checklist": {
    id: "start-of-care-checklist",
    name: "Start of Care Checklist",
    description: "Comprehensive checklist for initiating care services",
    content: <StartofCareChecklist />,
  },

  // Assessment files
  "comprehensive-care-plan-assessment": {
    id: "comprehensive-care-plan-assessment",
    name: "Comprehensive Care Plan Assessment",
    description: "Complete assessment for developing comprehensive care plans",
    content: <div>Comprehensive Care Plan Assessment content</div>,
  },
  "care-recipient-questionnaire": {
    id: "care-recipient-questionnaire",
    name: "Care Recipient Questionnaire",
    description:
      "Questionnaire for care recipients to assess needs and preferences",
    content: <CareRecipientQuestionaire />,
  },
  "initial-assessment": {
    id: "initial-assessment",
    name: "Initial Assessment",
    description: "Initial assessment form for new care recipients",
    content: <div>Initial Assessment content</div>,
  },

  // Medical files (existing and new)
  "face-sheet-long": {
    id: "face-sheet-long",
    name: "Face Sheet Long",
    description: "Comprehensive patient face sheet with detailed information",
    content: <FaceSheetLongForm />,
  },
  "face-sheet-short": {
    id: "face-sheet-short",
    name: "Face Sheet Short",
    description: "Condensed patient face sheet with essential information",
    content: <FaceSheetShortForm />,
  },
  "health-history-form-medical": {
    id: "health-history-form-medical",
    name: "Health History Form",
    description: "Medical health history documentation form",
    content: <HealthHistoryForm />,
  },
  "medicare-cheat-sheet": {
    id: "medicare-cheat-sheet",
    name: "Medicare Cheat Sheet",
    description: "Medicare Cheat Sheet for medications guidance",
    content: <MedicareCheatSheet />,
  },
  "medical-appointment-template": {
    id: "medical-appointment-template",
    name: "Medical Appointment Template",
    description: "Templates for standardized medical appointment notes",
    content: <MedicalAppointmentTemplate />,
  },

  // Long Term Care Planning files
  "long-term-care-insurance-policy": {
    id: "long-term-care-insurance-policy",
    name: "Long Term Care Insurance Policy",
    description: "Long Term Care Insurance Policy",
    content: <LongTermCareInsurancePolicy />,
  },

  // Caregiver files
  "caregiver-information": {
    id: "caregiver-information",
    name: "Caregiver Information",
    description: "Information and documentation for caregivers",
    content: <CaregiverInformation />,
  },
  // Care Plans files
  "care-plan-checklists": {
    id: "care-plan-checklists",
    name: "Care plan checklists",
    description: "Checklists for care plan development",
    content: <CarePlanChecklist />,
  },
  // Checklists files
  "move-in-checklist": {
    id: "move-in-checklist",
    name: "Move in",
    description: "Checklist for moving in new care recipients",
    content: <MoveIn />,
  },
  "hospital-checklist": {
    id: "hospital-checklist",
    name: "Hospitalization Checklist",
    description: "Checklist for hospitalization",
    content: <HospitalizationChecklist />,
  },
  "essential-document-for-aging": {
    id: "essential-document-for-aging",
    name: "Essential Document for Aging",
    description: "Essential document for aging",
    content: <EssentialDocumentForAging />,
  },
  "next-steps-after-death": {
    id: "next-steps-after-death",
    name: "Next Steps after Death",
    description: "Checklist for procedures following death",
    content: <NextStepsAfterDeath />,
  },
};

export const AgensyForms: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>();
  const navigate = useNavigate();
  const params = useParams();

  const findItemBySlug = (
    items: FolderItem[],
    slug: string,
    currentPath: string[] = []
  ): { item: FolderItem; path: string[] } | null => {
    let result: { item: FolderItem; path: string[] } | null = null;
    items.forEach((item) => {
      if (result) return;
      if (item.slug === slug) {
        result = { item, path: currentPath };
        return;
      }
      if (item.children) {
        const found = findItemBySlug(item.children, slug, [
          ...currentPath,
          item.name,
        ]);
        if (found) result = found;
      }
    });
    return result;
  };

  const findFileBySlug = (
    items: FolderItem[],
    slug: string,
    currentPath: string[] = []
  ): { file: FolderItem; path: string[] } | null => {
    let result: { file: FolderItem; path: string[] } | null = null;
    items.forEach((item) => {
      if (result) return;
      if (item.type === "file" && item.slug === slug) {
        result = { file: item, path: currentPath };
        return;
      }
      if (item.children) {
        const found = findFileBySlug(item.children, slug, [
          ...currentPath,
          item.name,
        ]);
        if (found) result = found;
      }
    });

    return result;
  };

  useEffect(() => {
    const { folderSlug, formSlug } = params;

    if (formSlug) {
      const result = findFileBySlug(rootFolders, formSlug);
      if (result) {
        setCurrentPath(result.path);
        setSelectedItem(result.file.id);
      }
    } else if (folderSlug) {
      const result = findItemBySlug(rootFolders, folderSlug);
      if (result && result.item.type === "folder") {
        setCurrentPath([...result.path, result.item.name]);
        setSelectedItem(undefined);
      }
    } else {
      setCurrentPath([]);
      setSelectedItem(undefined);
    }
  }, [params.folderSlug, params.formSlug]);

  const getCurrentFolders = (): FolderItem[] => {
    if (currentPath.length === 0) {
      return rootFolders;
    }
    let currentLevel = rootFolders;
    let foundAll = true;
    currentPath.forEach((pathItem) => {
      if (!foundAll) return;
      const folder = currentLevel.find((item) => item.name === pathItem);
      if (folder && folder.children) {
        currentLevel = folder.children;
      } else {
        foundAll = false;
      }
    });
    return foundAll ? currentLevel : [];
  };

  const getFileContent = useCallback(
    (fileId: string): FolderData | undefined => {
      return fileMap[fileId];
    },
    []
  );

  const handleFolderClick = (folderId: string) => {
    const findFolderById = (
      folders: FolderItem[],
      id: string
    ): FolderItem | null => {
      const directMatch = folders.find((folder) => folder.id === id);
      if (directMatch) return directMatch;

      let result: FolderItem | null = null;
      folders.forEach((folder) => {
        if (result) return;
        if (folder.children) {
          const found = findFolderById(folder.children, id);
          if (found) result = found;
        }
      });

      return result;
    };

    const folder = findFolderById(getCurrentFolders(), folderId);
    if (folder && folder.type === "folder") {
      navigate(
        `/clients/${params.clientId}/${ROUTES.agensyFormsFolders}/${folder.slug}`
      );
    }
  };

  const handleFileClick = (fileId: string) => {
    const findFileById = (
      folders: FolderItem[],
      id: string
    ): FolderItem | null => {
      const directMatch = folders.find((item) => item.id === id);
      if (directMatch) return directMatch;

      let result: FolderItem | null = null;
      folders.forEach((folder) => {
        if (result) return;
        if (folder.children) {
          const found = findFileById(folder.children, id);
          if (found) result = found;
        }
      });

      return result;
    };

    const file = findFileById(rootFolders, fileId);
    if (file && file.type === "file") {
      if (params.folderSlug) {
        navigate(
          `/clients/${params.clientId}/${ROUTES.agensyFormsFolders}/${params.folderSlug}/${file.slug}`
        );
      } else {
        setSelectedItem(fileId);
      }
    }
  };

  const handleFileClose = () => {
    if (params.folderSlug) {
      navigate(
        `/clients/${params.clientId}/${ROUTES.agensyFormsFolders}/${params.folderSlug}`
      );
    } else {
      navigate(`/clients/${params.clientId}/${ROUTES.agensyFormsFolders}`);
    }
  };

  const handleBackClick = () => {
    if (params.formSlug) {
      if (params.folderSlug) {
        navigate(
          `/clients/${params.clientId}/${ROUTES.agensyFormsFolders}/${params.folderSlug}`
        );
      } else {
        navigate(`/clients/${params.clientId}/${ROUTES.agensyFormsFolders}`);
      }
    } else if (currentPath.length > 0) {
      if (currentPath.length === 1) {
        navigate(`/clients/${params.clientId}/${ROUTES.agensyFormsFolders}`);
      } else {
        const parentPath = currentPath.slice(0, -1);
        const parentFolderName = parentPath[parentPath.length - 1];
        const parentFolder = rootFolders.find(
          (f) => f.name === parentFolderName
        );
        if (parentFolder) {
          navigate(
            `/clients/${params.clientId}/${ROUTES.agensyFormsFolders}/${parentFolder.slug}`
          );
        }
      }
    }
  };

  const handlePathClick = (pathIndex: number) => {
    if (pathIndex === -1) {
      navigate(`/clients/${params.clientId}/${ROUTES.agensyFormsFolders}`);
    } else {
      const targetPath = currentPath.slice(0, pathIndex + 1);
      const targetFolderName = targetPath[targetPath.length - 1];

      const findFolderByName = (
        folders: FolderItem[],
        name: string
      ): FolderItem | null => {
        const directMatch = folders.find((folder) => folder.name === name);
        if (directMatch) return directMatch;

        let result: FolderItem | null = null;
        folders.forEach((folder) => {
          if (result) return;
          if (folder.children) {
            const found = findFolderByName(folder.children, name);
            if (found) result = found;
          }
        });

        return result;
      };

      const targetFolder = findFolderByName(rootFolders, targetFolderName);
      if (targetFolder) {
        navigate(
          `/clients/${params.clientId}/${ROUTES.agensyFormsFolders}/${targetFolder.slug}`
        );
      }
    }
  };

  const selectedFileContent = selectedItem
    ? getFileContent(selectedItem)
    : undefined;

  return (
    <div className="h-full">
      <div className="w-full">
        <FolderExplorer
          folders={getCurrentFolders()}
          onFolderClick={handleFolderClick}
          onFileClick={handleFileClick}
          onFileClose={handleFileClose}
          selectedItem={selectedItem}
          currentPath={currentPath}
          onBackClick={handleBackClick}
          fileContent={selectedFileContent}
          onPathClick={handlePathClick}
        />
      </div>
    </div>
  );
};
