import React, { useCallback, useEffect, useState } from "react";
import { FaceSheetShortForm, FolderExplorer } from "@agensy/components";
import type { FolderItem, FolderData } from "@agensy/types";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@agensy/constants";

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
      {
        id: "health-history-form-soc",
        name: "Health History Form",
        type: "file",
        slug: "health-history-form-soc",
      },
      {
        id: "face-sheets-form-soc",
        name: "Face Sheets Form",
        type: "file",
        slug: "face-sheets-form-soc",
      },
      {
        id: "instructions-form-soc",
        name: "Instructions Form",
        type: "file",
        slug: "instructions-form-soc",
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
        id: "bank-roi-forms",
        name: "Bank ROI Forms",
        type: "file",
        slug: "bank-roi-forms",
      },
      {
        id: "agensy-note-templates",
        name: "Agensy Note Templates",
        type: "file",
        slug: "agensy-note-templates",
      },
      {
        id: "instructions-when-how-to-use",
        name: "Instructions on when/how to use",
        type: "file",
        slug: "instructions-when-how-to-use",
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
        id: "poa-documents",
        name: "POA Documents, Living Will, Advance Directives, MPOA, DNR",
        type: "file",
        slug: "poa-documents",
      },
      {
        id: "account-password-tracking",
        name: "Account /password tracking",
        type: "file",
        slug: "account-password-tracking",
      },
      {
        id: "professional-contacts",
        name: "Professional contacts",
        type: "file",
        slug: "professional-contacts",
      },
      {
        id: "insurance-id-information",
        name: "Insurance & ID Information",
        type: "file",
        slug: "insurance-id-information",
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
      {
        id: "caregiver-communication-expectations",
        name: "Instructions on caregiver communication and expectations",
        type: "file",
        slug: "caregiver-communication-expectations",
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
        id: "care-plan-checklists-examples",
        name: "Care plan checklists and examples",
        type: "file",
        slug: "care-plan-checklists-examples",
      },
      {
        id: "when-to-call-care-plans",
        name: "Instructions on when to call care plans",
        type: "file",
        slug: "when-to-call-care-plans",
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
        name: "Hospital",
        type: "file",
        slug: "hospital-checklist",
      },
      {
        id: "emergency-checklist",
        name: "Emergency",
        type: "file",
        slug: "emergency-checklist",
      },
      {
        id: "next-steps-after-death",
        name: "Next Steps after Death",
        type: "file",
        slug: "next-steps-after-death",
      },
      {
        id: "family-check-in",
        name: "Family check in",
        type: "file",
        slug: "family-check-in",
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
    content: <div>Start of Care Checklist content</div>,
  },
  "health-history-form-soc": {
    id: "health-history-form-soc",
    name: "Health History Form",
    description: "Detailed health history form for start of care",
    content: <div>Health History Form content</div>,
  },
  "face-sheets-form-soc": {
    id: "face-sheets-form-soc",
    name: "Face Sheets Form",
    description: "Face sheets form for start of care documentation",
    content: <div>Face Sheets Form content</div>,
  },
  "instructions-form-soc": {
    id: "instructions-form-soc",
    name: "Instructions Form",
    description: "Instructions form for start of care procedures",
    content: <div>Instructions Form content</div>,
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
    description: "Questionnaire for care recipients to assess needs and preferences",
    content: <div>Care Recipient Questionnaire content</div>,
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
    content: <div>Face Sheet long content</div>,
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
    content: <div>Health History Form content</div>,
  },
  "bank-roi-forms": {
    id: "bank-roi-forms",
    name: "Bank ROI Forms",
    description: "Bank Release of Information forms",
    content: <div>Bank ROI Forms content</div>,
  },
  "agensy-note-templates": {
    id: "agensy-note-templates",
    name: "Agensy Note Templates",
    description: "Templates for standardized care notes",
    content: <div>Agensy Note Templates content</div>,
  },
  "instructions-when-how-to-use": {
    id: "instructions-when-how-to-use",
    name: "Instructions on when/how to use",
    description: "Guidelines for when and how to use medical forms",
    content: <div>Instructions on when/how to use content</div>,
  },
  
  // Long Term Care Planning files
  "poa-documents": {
    id: "poa-documents",
    name: "POA Documents, Living Will, Advance Directives, MPOA, DNR",
    description: "Power of Attorney and advance directive documents",
    content: <div>POA Documents content</div>,
  },
  "account-password-tracking": {
    id: "account-password-tracking",
    name: "Account /password tracking",
    description: "Secure tracking of accounts and passwords",
    content: <div>Account/password tracking content</div>,
  },
  "professional-contacts": {
    id: "professional-contacts",
    name: "Professional contacts",
    description: "Directory of professional contacts and services",
    content: <div>Professional contacts content</div>,
  },
  "insurance-id-information": {
    id: "insurance-id-information",
    name: "Insurance & ID Information",
    description: "Insurance and identification information tracking",
    content: <div>Insurance & ID Information content</div>,
  },
  
  // Caregiver files
  "caregiver-information": {
    id: "caregiver-information",
    name: "Caregiver Information",
    description: "Information and documentation for caregivers",
    content: <div>Caregiver Information content</div>,
  },
  "caregiver-communication-expectations": {
    id: "caregiver-communication-expectations",
    name: "Instructions on caregiver communication and expectations",
    description: "Guidelines for caregiver communication and expectations",
    content: <div>Caregiver communication and expectations content</div>,
  },
  
  // Care Plans files
  "care-plan-checklists-examples": {
    id: "care-plan-checklists-examples",
    name: "Care plan checklists and examples",
    description: "Checklists and examples for care plan development",
    content: <div>Care plan checklists and examples content</div>,
  },
  "when-to-call-care-plans": {
    id: "when-to-call-care-plans",
    name: "Instructions on when to call care plans",
    description: "Guidelines for when to activate care plans",
    content: <div>Instructions on when to call care plans content</div>,
  },
  
  // Checklists files
  "move-in-checklist": {
    id: "move-in-checklist",
    name: "Move in",
    description: "Checklist for moving in new care recipients",
    content: <div>Move in checklist content</div>,
  },
  "hospital-checklist": {
    id: "hospital-checklist",
    name: "Hospital",
    description: "Checklist for hospital visits and procedures",
    content: <div>Hospital checklist content</div>,
  },
  "emergency-checklist": {
    id: "emergency-checklist",
    name: "Emergency",
    description: "Emergency response checklist",
    content: <div>Emergency checklist content</div>,
  },
  "next-steps-after-death": {
    id: "next-steps-after-death",
    name: "Next Steps after Death",
    description: "Checklist for procedures following death",
    content: <div>Next Steps after Death content</div>,
  },
  "family-check-in": {
    id: "family-check-in",
    name: "Family check in",
    description: "Family check-in procedures and forms",
    content: <div>Family check in content</div>,
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
