import React, { useEffect, useState } from "react";
import {
  Card,
  EmptyStateCard,
  AddDocumentModal,
  BorderedCard,
} from "@agensy/components";
import { ICONS, ROUTES, DASHBOARD_RECENT_DOCUMENTS } from "@agensy/constants";
import { useNavigate } from "react-router-dom";
import { useDocumentContext } from "@agensy/context";
import {
  useAddGeneralDocumentMutation,
  useAnalyzeGeneralDocumentMutation,
} from "@agensy/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@agensy/utils";
import type {
  DocumentFormData,
  ConfidenceScore,
  Document,
} from "@agensy/types";

export const RecentDocumentsCard: React.FC = () => {
  const navigate = useNavigate();
  const { setIsAddDocumentModalOpen, isAddDocumentModalOpen } =
    useDocumentContext();
  const documents = DASHBOARD_RECENT_DOCUMENTS.slice(0, 3); // Limit to 3 most recent
  const addGeneralDocumentMutation = useAddGeneralDocumentMutation();
  const queryClient = useQueryClient();
  const generalDocumentAnalyzeMutation = useAnalyzeGeneralDocumentMutation();
  const [analyzedDocRes, setAnalyzedDocRes] = useState<ConfidenceScore | null>(
    null
  );

  const handleAddDocument = () => {
    setIsAddDocumentModalOpen(true);
  };

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
    if (generalDocumentAnalyzeMutation.status === "success") {
      setAnalyzedDocRes(generalDocumentAnalyzeMutation.data);
      toast.success("Document analyzed successfully");
    } else if (generalDocumentAnalyzeMutation.status === "error") {
      toast.error("Failed to analyze document");
    }
  }, [generalDocumentAnalyzeMutation.status]);

  useEffect(() => {
    if (addGeneralDocumentMutation.status === "success") {
      queryClient.setQueryData(["general-documents"], (old: Document[]) => {
        if (!old) return [addGeneralDocumentMutation.data];
        return [...old, addGeneralDocumentMutation.data];
      });
      setIsAddDocumentModalOpen(false);
      toast.success("Document added successfully");
    } else if (addGeneralDocumentMutation.status === "error") {
      toast.error("Failed to add document");
    }
  }, [addGeneralDocumentMutation.status]);

  return (
    <>
      <Card
        title="Recent Documents"
        buttonText={<ICONS.plus size={18} />}
        ariaLabel="Add document"
        onButtonClick={handleAddDocument}
        className="border-gray-300"
      >
        {documents.length > 0 ? (
          <div className="space-y-1.5">
            {documents.map((document) => (
              <BorderedCard key={document.id} className="!p-2">
                <div
                  className="cursor-pointer"
                  onClick={() => navigate(`${ROUTES.documents}/${document.id}`)}
                >
                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {document.title}
                    </h3>
                    <div className="flex flex-col gap-1.5 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <ICONS.document className="text-gray-400" size={14} />
                        <span>{document.category || "Document"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ICONS.clockCircle
                          className="text-gray-400"
                          size={14}
                        />
                        <span>
                          {document.createdAt
                            ? new Date(document.createdAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ICONS.user className="text-gray-400" size={14} />
                        <span>
                          {document.uploadedBy?.first_name}{" "}
                          {document.uploadedBy?.last_name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </BorderedCard>
            ))}
          </div>
        ) : (
          <EmptyStateCard
            label="documents"
            ICON={ICONS.document}
            onClick={handleAddDocument}
          />
        )}
      </Card>
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
    </>
  );
};

export default RecentDocumentsCard;
