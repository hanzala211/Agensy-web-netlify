import React, { useCallback, useState } from "react";
import { FaceSheetShortForm, FolderExplorer } from "@agensy/components";
import type { FolderItem, FolderData } from "@agensy/types";

const rootFolders: FolderItem[] = [
  {
    id: "medical",
    name: "Medical",
    type: "folder",
    children: [
      {
        id: "face-sheets",
        name: "Face Sheets",
        type: "folder",
        children: [
          { id: "face-sheet-long", name: "Face Sheet Long", type: "file" },
          { id: "face-sheet-short", name: "Face Sheet Short", type: "file" },
        ],
      },
    ],
  },
];

export const AgensyForms: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>();

  const getCurrentFolders = (): FolderItem[] => {
    if (currentPath.length === 0) {
      return rootFolders;
    }

    let currentLevel = rootFolders;
    for (const pathItem of currentPath) {
      const folder = currentLevel.find((item) => item.name === pathItem);
      if (folder && folder.children) {
        currentLevel = folder.children;
      } else {
        return [];
      }
    }
    return currentLevel;
  };

  const getFileContent = useCallback(
    (fileId: string): FolderData | undefined => {
      const fileMap: Record<string, FolderData> = {
        "face-sheet-long": {
          id: "face-sheet-long",
          name: "Face Sheet Long",
          description:
            "Comprehensive patient face sheet with detailed information",
          content: <div>Face Sheet long content</div>,
        },
        "face-sheet-short": {
          id: "face-sheet-short",
          name: "Face Sheet Short",
          description:
            "Condensed patient face sheet with essential information",
          content: <FaceSheetShortForm />,
        },
      };

      return fileMap[fileId];
    },
    []
  );

  const handleFolderClick = (folderId: string) => {
    const findFolderById = (
      folders: FolderItem[],
      id: string
    ): FolderItem | null => {
      for (const folder of folders) {
        if (folder.id === id) {
          return folder;
        }
        if (folder.children) {
          const found = findFolderById(folder.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const folder = findFolderById(getCurrentFolders(), folderId);
    if (folder && folder.type === "folder") {
      setCurrentPath([...currentPath, folder.name]);
      setSelectedItem(undefined);
    }
  };

  const handleFileClick = (fileId: string) => {
    setSelectedItem(fileId);
  };

  const handleFileClose = () => {
    setSelectedItem(undefined);
  };

  const handleBackClick = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
      setSelectedItem(undefined);
    }
  };

  const handlePathClick = (pathIndex: number) => {
    if (pathIndex === -1) {
      setCurrentPath([]);
    } else {
      setCurrentPath(currentPath.slice(0, pathIndex + 1));
    }
    setSelectedItem(undefined);
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
