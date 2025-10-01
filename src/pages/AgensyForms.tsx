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
import { APP_ACTIONS, PERMISSIONS, ROUTES } from "@agensy/constants";
import { MedicalAppointmentTemplate } from "@agensy/components";
import {
  useCreateNewMedicalTemplateMutation,
  useGetAllMedicalAppointmentTemplates,
} from "@agensy/api";
import { toast } from "@agensy/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@agensy/context";

const getRootFolders = (userPermissions: string[]): FolderItem[] => [
  {
    id: "assessment",
    slug: "assessment",
    name: "Assessments",
    type: "folder",
    children: [
      {
        id: "care-recipient-questionnaire",
        name: "Care Recipient Questionnaire",
        type: "file",
        slug: "care-recipient-questionnaire",
      },
      {
        id: "initial-assessment",
        name: "Initial Care Plan Assessment",
        type: "file",
        slug: "initial-assessment",
      },
      {
        id: "comprehensive-care-plan-assessment",
        name: "Comprehensive Care Plan Assessment",
        type: "file",
        slug: "comprehensive-care-plan-assessment",
      },
    ],
  },

  {
    id: "essential-health-information",
    slug: "essential-health-information",
    name: "Essential Health Information",
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
        id: "vitals-tracker",
        name: "Vitals Tracker",
        type: "file",
        slug: "vitals-tracker",
      },
      {
        id: "labs-test-tracker",
        name: "Labs Tests & Imaging Tracker",
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
        name: "Comprehensive Medication List",
        type: "file",
        slug: "comprehensive-medication-list",
      },
    ],
  },
  {
    id: "essential-documents-for-aging",
    slug: "essential-documents-for-aging",
    name: "Essential Documents for Aging",
    type: "folder",
    children: [
      ...(!userPermissions.includes(APP_ACTIONS.ViewPersonalInfo)
        ? []
        : [
            {
              id: "personal-info",
              name: "Personal Information & Password Organizer",
              type: "file" as const,
              slug: "personal-info",
            },
            {
              id: "important-people-in-life",
              name: "Trusted Network Directory",
              type: "file" as const,
              slug: "important-people-in-life",
            },
          ]),

      {
        id: "burial-instructions",
        name: "Burial Instructions",
        type: "file",
        slug: "burial-instructions",
      },
    ],
  },

  {
    id: "guides-checklists",
    slug: "guides-checklists",
    name: "Guides & Checklists",
    type: "folder",
    children: [
      {
        id: "start-of-care-checklist",
        name: "Start of Care Checklist",
        type: "file",
        slug: "start-of-care-checklist",
      },
      {
        id: "long-term-care-insurance-policy",
        name: "Long Term Care Insurance Policy",
        type: "file",
        slug: "long-term-care-insurance-policy",
      },
      {
        id: "caregiver-information",
        name: "Caregiver Information Sheet",
        type: "file",
        slug: "caregiver-information",
      },
      {
        id: "care-plan-checklists",
        name: "When to call a Care Plan",
        type: "file",
        slug: "care-plan-checklists",
      },
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
    ],
  },
  {
    id: "medical-appointment-templates",
    slug: "medical-appointment-templates",
    name: "Medical Appointment Templates",
    type: "folder",
    children: [],
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
    name: "Initial Care Plan Assessment",
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
    name: "Caregiver Information Sheet",
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
    name: "Burial Instructions",
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
    name: "Labs Tests & Imaging Tracker",
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
    name: "Comprehensive Medication List",
    description: "Comprehensive Medication and Supplement List",
    content: <ComprehensiveMedicationList />,
  },
};

export const AgensyForms: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [medicalAppointmentTemplates, setMedicalAppointmentTemplates] =
    useState<
      Array<{
        id: string;
        name: string;
        data: MedicalAppointmentTemplateData | null;
      }>
    >([]);
  const [showLabel, setShowLabel] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const queryClient = useQueryClient();
  const { data: medicalAppointmentTemplatesData } =
    useGetAllMedicalAppointmentTemplates(params.clientId as string);
  const createNewMedicalTemplateMutation =
    useCreateNewMedicalTemplateMutation();
  const { filterClientRole } = useAuthContext();
  const userPermissions =
    PERMISSIONS[
      filterClientRole(params.clientId as string) as keyof typeof PERMISSIONS
    ] || [];

  useEffect(() => {
    const careData: { questionnaire: { id: string } } =
      queryClient.getQueryData([
        "care-recipient-questionnaire",
        params.clientId,
      ]) as unknown as { questionnaire: { id: string } };
    setShowLabel(careData?.questionnaire?.id === null);
  }, []);

  useEffect(() => {
    if (createNewMedicalTemplateMutation.status === "success") {
      toast.success(
        "Medical Appointment Template Created",
        "New medical appointment template has been created successfully."
      );
      queryClient.invalidateQueries({
        queryKey: ["medical-appointment-templates", params.clientId],
      });
      navigate(
        `/clients/${params.clientId}/${ROUTES.agensyFormsFolders}/medical-appointment-templates/medical-appointment-template_${createNewMedicalTemplateMutation.data.id}`
      );
    } else if (createNewMedicalTemplateMutation.status === "error") {
      toast.error(
        "Failed to Create Template",
        "An error occurred while creating the medical appointment template. Please try again."
      );
    }
  }, [createNewMedicalTemplateMutation.status]);

  const handleAddMedicalAppointmentTemplate = () => {
    createNewMedicalTemplateMutation.mutate({
      clientId: params.clientId as string,
    });
  };

  const getDynamicMedicalTemplates = () => {
    // Always return an array, even if empty
    return medicalAppointmentTemplates.map((template) => ({
      id: template.id,
      name:
        template.name === "Medical Appointment Template"
          ? template.name + " (Empty)"
          : template.name,
      type: "file" as const,
      slug: template.id,
    }));
  };

  const getCurrentFolders = (): FolderItem[] => {
    const rootFolders = getRootFolders(userPermissions);

    if (currentPath.length === 0) {
      const updatedRootFolders = rootFolders.map((folder) => {
        if (folder.id === "medical-appointment-templates") {
          const dynamicTemplates = getDynamicMedicalTemplates();
          return {
            ...folder,
            children: dynamicTemplates,
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
        if (folder.id === "medical-appointment-templates") {
          const dynamicTemplates = getDynamicMedicalTemplates();

          if (searchQuery) {
            currentLevel = dynamicTemplates.filter((item) =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
          } else {
            currentLevel = dynamicTemplates;
          }
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

    if (slug.startsWith("medical-appointment-template_")) {
      const dynamicTemplate = medicalAppointmentTemplates.find(
        (t) => t.id === slug
      );
      if (dynamicTemplate) {
        const rootFolders = getRootFolders(userPermissions);
        const medicalFolder = rootFolders.find(
          (folder) => folder.id === "medical-appointment-templates"
        );
        if (medicalFolder) {
          return {
            file: {
              id: dynamicTemplate.id,
              name: dynamicTemplate.name,
              type: "file" as const,
              slug: dynamicTemplate.id,
            },
            path: [medicalFolder.name],
          };
        }
      }
    }

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
    if (medicalAppointmentTemplatesData) {
      const templates = medicalAppointmentTemplatesData?.templates.map(
        (template: { id: string; template_name: string }) => ({
          id: `medical-appointment-template_${template.id}`,
          name: template.template_name,
          data: template,
        })
      );
      setMedicalAppointmentTemplates(templates);
    }
  }, [medicalAppointmentTemplatesData]);

  useEffect(() => {
    const { folderSlug, formSlug } = params;
    const rootFolders = getRootFolders(userPermissions);

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
  }, [
    params.folderSlug,
    params.formSlug,
    medicalAppointmentTemplates,
    searchQuery,
    userPermissions,
  ]);

  useEffect(() => {
    if (
      currentPath.length === 0 ||
      currentPath[currentPath.length - 1] !== "Medical Appointment Templates"
    ) {
      setSearchQuery("");
    }
  }, [currentPath, setSearchQuery]);

  const getFileContent = useCallback(
    (fileId: string): FolderData | undefined => {
      if (fileId.startsWith("medical-appointment-template_")) {
        const template = medicalAppointmentTemplates.find(
          (t) => t.id === fileId
        );
        if (template) {
          return {
            id: template.id,
            name: template.name,
            description: "Dynamic medical appointment template",
            content: <MedicalAppointmentTemplate />,
          };
        }
      }

      return fileMap[fileId];
    },
    [medicalAppointmentTemplates]
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

    const rootFolders = getRootFolders(userPermissions);
    const folder = findFolderById(rootFolders, folderId);
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

    const rootFolders = getRootFolders(userPermissions);
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
        if (params.folderSlug) {
          navigate(
            `/clients/${params.clientId}/${ROUTES.agensyFormsFolders}/${params.folderSlug}/${fileId}`
          );
        } else {
          setSelectedItem(fileId);
        }
      }
    }
  };

  const handleFileClose = () => {
    if (params.formSlug) {
      if (params.folderSlug) {
        navigate(
          `/clients/${params.clientId}/${ROUTES.agensyFormsFolders}/${params.folderSlug}`
        );
      } else {
        navigate(`/clients/${params.clientId}/${ROUTES.agensyFormsFolders}`);
      }
    } else if (params.folderSlug) {
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
        const parentFolder = getRootFolders(userPermissions).find(
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

      const targetFolder = findFolderByName(
        getRootFolders(userPermissions),
        targetFolderName
      );
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
            currentPath[currentPath.length - 1] ===
              "Medical Appointment Templates"
          }
          isCreatingMedicalTemplate={createNewMedicalTemplateMutation.isPending}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showLabel={showLabel}
        />
      </div>
    </div>
  );
};
