import React, { useCallback, useEffect, useState } from "react";
import { FaceSheetShortForm, FolderExplorer } from "@agensy/components";
import type { FolderItem, FolderData } from "@agensy/types";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@agensy/constants";

const rootFolders: FolderItem[] = [
  {
    id: "medical",
    slug: "medical",
    name: "Medical",
    type: "folder",
    children: [
      {
        id: "face-sheet-long",
        name: "Face Sheet Long",
        type: "file",
        slug: "face-sheet-long",
      },
      {
        id: "face-sheet-short",
        name: "Face Sheet Short",
        type: "file",
        slug: "face-sheet-short",
      },
    ],
  },
];

const fileMap: Record<string, FolderData> = {
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
