import {
  useAddGeneralDocumentMutation,
  useAnalyzeGeneralDocumentMutation,
} from "@agensy/api";
import { AddDocumentModal, PageHeader } from "@agensy/components";
import { useDocumentContext } from "@agensy/context";
import type {
  ConfidenceScore,
  Document,
  DocumentFormData,
} from "@agensy/types";
import { toast } from "@agensy/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";

export const Documents: React.FC = () => {
  const params = useParams();
  const addGeneralDocumentMutation = useAddGeneralDocumentMutation();
  const { isAddDocumentModalOpen, setIsAddDocumentModalOpen } =
    useDocumentContext();
  const queryClient = useQueryClient();
  const generalDocumentAnalyzeMutation = useAnalyzeGeneralDocumentMutation();
  const [analyzedDocRes, setAnalyzedDocRes] = useState<ConfidenceScore | null>(
    null
  );

  useEffect(() => {
    if (generalDocumentAnalyzeMutation.status === "success") {
      console.log(generalDocumentAnalyzeMutation.data);
      setAnalyzedDocRes(generalDocumentAnalyzeMutation.data);
      toast.success("Document analyzed successfully");
    } else if (generalDocumentAnalyzeMutation.status === "error") {
      toast.error("Failed to analyze document");
    }
  }, [generalDocumentAnalyzeMutation.status]);

  const handleAnalyze = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    toast.info("Analyzing document.");
    generalDocumentAnalyzeMutation.mutate(formData);
  };

  const handleSubmit = (data: DocumentFormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("document_type", data.documentType);
    formData.append("description", data.description ? data.description : "");
    formData.append("file", data.file);
    formData.append("category", data.documentType as string);
    formData.append("primary_user_id", data.primaryUserId as string);
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
    <div className="overflow-y-auto h-[100dvh] max-h-[calc(100dvh-50px)] md:max-h-[calc(100dvh)] w-full md:px-8 px-4 py-6">
      <PageHeader
        title="Documents"
        showButton={params.documentId ? false : true}
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
        handleAnalyze={handleAnalyze}
        isAnalyzing={generalDocumentAnalyzeMutation.isPending}
        analyzedDocRes={analyzedDocRes}
        showPrimaryUser={true}
      />
    </div>
  );
};

export default Documents;
