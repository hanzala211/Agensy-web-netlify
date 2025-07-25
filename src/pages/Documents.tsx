import { useAddGeneralDocumentMutation } from "@agensy/api";
import { AddDocumentModal, PageHeader } from "@agensy/components";
import { APP_ACTIONS, PERMISSIONS } from "@agensy/constants";
import { useAuthContext, useDocumentContext } from "@agensy/context";
import type { Document, DocumentFormData } from "@agensy/types";
import { toast } from "@agensy/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";

export const Documents: React.FC = () => {
  const { userData } = useAuthContext();
  const params = useParams();
  const addGeneralDocumentMutation = useAddGeneralDocumentMutation();
  const { isAddDocumentModalOpen, setIsAddDocumentModalOpen } =
    useDocumentContext();
  const queryClient = useQueryClient();
  const userPermissions =
    PERMISSIONS[userData?.role as keyof typeof PERMISSIONS] || [];

  const handleSubmit = (data: DocumentFormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("document_type", data.documentType);
    formData.append("description", data.description ? data.description : "");
    formData.append("file", data.file);
    formData.append("category", data.documentType as string);
    addGeneralDocumentMutation.mutate(formData);
  };

  useEffect(() => {
    if (addGeneralDocumentMutation.status === "success") {
      queryClient.setQueryData(["general-documents"], (old: Document[]) => {
        return [...old, addGeneralDocumentMutation.data];
      });
      setIsAddDocumentModalOpen(false);
      toast.success("Document added successfully");
    } else if (addGeneralDocumentMutation.status === "error") {
      toast.error("Failed to add document");
    }
  }, [addGeneralDocumentMutation.status]);

  return (
    <div className="overflow-y-auto h-[100dvh] max-h-[calc(100dvh-50px)] md:max-h-[calc(100dvh)] w-full px-4 py-6">
      <PageHeader
        title="Documents"
        showButton={
          params.documentId || !userPermissions.includes(APP_ACTIONS.AddDocs)
            ? false
            : true
        }
        buttonText="Add Document"
        showBackButton={params.documentId ? true : false}
        onButtonClick={() => setIsAddDocumentModalOpen(true)}
      />
      <main className="mt-8">
        <Outlet />
      </main>
      <AddDocumentModal
        isOpen={isAddDocumentModalOpen}
        onClose={() => setIsAddDocumentModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={addGeneralDocumentMutation.isPending}
      />
    </div>
  );
};

export default Documents;
