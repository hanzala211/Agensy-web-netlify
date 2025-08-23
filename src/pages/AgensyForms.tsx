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
  InitialCareAssessmentPlan,
  ComprehensiveCarePlan,
  BurialInstructions,
  PersonalInfo,
  ImportantPeopleInLife,
  VitalsTracker,
  LabsTracker,
  InPatientStayNotes,
  ComprehensiveMedicationList,
} from "@agensy/components";
import type {
  FolderItem,
  FolderData,
  MedicalAppointmentTemplateData,
} from "@agensy/types";
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
        name: "When to call a Care Plan",
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
      {
        id: "medicare-cheat-sheet",
        name: "Medicare Cheat Sheet",
        type: "file",
        slug: "medicare-cheat-sheet",
      },
      {
        id: "burial-instructions",
        name: "Burial & End of Life Instructions",
        type: "file",
        slug: "burial-instructions",
      },
    ],
  },
  {
    id: "records-trackers",
    slug: "records-trackers",
    name: "Records & Trackers",
    type: "folder",
    children: [
      {
        id: "personal-info",
        name: "Personal Information & Password Organizer",
        type: "file",
        slug: "personal-info",
      },
      {
        id: "important-people-in-life",
        name: "Trusted Network Directory",
        type: "file",
        slug: "important-people-in-life",
      },
      {
        id: "vitals-tracker",
        name: "Vitals Tracker",
        type: "file",
        slug: "vitals-tracker",
      },
      {
        id: "labs-test-tracker",
        name: "Labs Test Tracker",
        type: "file",
        slug: "labs-test-tracker",
      },
      {
        id: "in-patient-stay-notes",
        name: "In-Patient Stay Notes",
        type: "file",
        slug: "in-patient-stay-notes",
      },
      {
        id: "comprehensive-medication-list",
        name: "Comprehensive Medication and Supplement List",
        type: "file",
        slug: "comprehensive-medication-list",
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
    content: <ComprehensiveCarePlan />,
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
    content: <InitialCareAssessmentPlan />,
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
    name: "When to call a Care Plan",
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
  "burial-instructions": {
    id: "burial-instructions",
    name: "Burial & End of Life Instructions",
    description: "Instructions for burial and end of life",
    content: <BurialInstructions />,
  },
  "personal-info": {
    id: "personal-info",
    name: "Personal Information & Password Organizer",
    description: "Personal information and password Organizer",
    content: <PersonalInfo />,
  },
  "important-people-in-life": {
    id: "important-people-in-life",
    name: "Trusted Network Directory",
    description: "Important people in life",
    content: <ImportantPeopleInLife />,
  },
  "vitals-tracker": {
    id: "vitals-tracker",
    name: "Vitals Tracker",
    description: "Vitals Tracker",
    content: <VitalsTracker />,
  },
  "labs-test-tracker": {
    id: "labs-test-tracker",
    name: "Labs Test Tracker",
    description: "Labs Test Tracker",
    content: <LabsTracker />,
  },
  "in-patient-stay-notes": {
    id: "in-patient-stay-notes",
    name: "In-Patient Stay Notes",
    description: "In-Patient Stay Notes",
    content: <InPatientStayNotes />,
  },
  "comprehensive-medication-list": {
    id: "comprehensive-medication-list",
    name: "Comprehensive Medication and Supplement List",
    description: "Comprehensive Medication and Supplement List",
    content: <ComprehensiveMedicationList />,
  },
};

export const AgensyForms: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>();
  const [medicalAppointmentTemplates, setMedicalAppointmentTemplates] =
    useState<
      Array<{
        id: string;
        name: string;
        data: MedicalAppointmentTemplateData | null;
      }>
    >([]);
  const navigate = useNavigate();
  const params = useParams();

  const handleAddMedicalAppointmentTemplate = () => {
    const newTemplate = {
      id: `medical-appointment-template-${Date.now()}`,
      name: `Medical Appointment Template ${
        medicalAppointmentTemplates.length + 1
      }`,
      data: null,
    };
    setMedicalAppointmentTemplates((prev) => [...prev, newTemplate]);
  };

  const getDynamicMedicalTemplates = () => {
    return medicalAppointmentTemplates.map((template) => ({
      id: template.id,
      name: template.name,
      type: "file" as const,
      slug: template.id,
    }));
  };

  const getCurrentFolders = (): FolderItem[] => {
    if (currentPath.length === 0) {
      const updatedRootFolders = rootFolders.map((folder) => {
        if (folder.id === "medical") {
          return {
            ...folder,
            children: [
              ...(folder.children || []),
              ...getDynamicMedicalTemplates(),
            ],
          };
        }
        return folder;
      });
      return updatedRootFolders;
    }

    let currentLevel: FolderItem[] = rootFolders;
    let foundAll = true;
    currentPath.forEach((pathItem) => {
      if (!foundAll) return;
      const folder = currentLevel.find((item) => item.name === pathItem);
      if (folder && folder.children) {
        if (folder.id === "medical") {
          currentLevel = [...folder.children, ...getDynamicMedicalTemplates()];
        } else {
          currentLevel = folder.children;
        }
      } else {
        foundAll = false;
      }
    });
    return foundAll ? currentLevel : [];
  };

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

    if (!result && slug.startsWith("medical-appointment-template-")) {
      const dynamicTemplate = medicalAppointmentTemplates.find(
        (t) => t.id === slug
      );
      if (dynamicTemplate) {
        const virtualFile: FolderItem = {
          id: dynamicTemplate.id,
          name: dynamicTemplate.name,
          type: "file",
          slug: dynamicTemplate.id,
        };
        result = { file: virtualFile, path: currentPath };
      }
    }

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
  }, [params.folderSlug, params.formSlug, medicalAppointmentTemplates]);

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
    } else {
      const dynamicTemplate = medicalAppointmentTemplates.find(
        (t) => t.id === fileId
      );
      if (dynamicTemplate) {
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
          onAddMedicalAppointmentTemplate={handleAddMedicalAppointmentTemplate}
          showAddMedicalAppointmentButton={
            currentPath.length > 0 &&
            currentPath[currentPath.length - 1] === "Medical"
          }
        />
      </div>
    </div>
  );
};
