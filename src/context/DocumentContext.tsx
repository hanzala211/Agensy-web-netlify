import type { DocumentContextType } from "@agensy/types";
import { createContext, useContext, useState } from "react";

const DocumentContext = createContext<DocumentContextType | undefined>(
  undefined
);

export const DocumentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] =
    useState<boolean>(false);

  return (
    <DocumentContext.Provider
      value={{ isAddDocumentModalOpen, setIsAddDocumentModalOpen }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocumentContext = (): DocumentContextType => {
  const context = useContext(DocumentContext);
  if (!context)
    throw new Error("use useDocumentContext inside Document Provider");
  return context;
};
