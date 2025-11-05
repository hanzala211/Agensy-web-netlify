import React, { useEffect } from "react";
import { Card, EmptyStateCard, BorderedCard } from "@agensy/components";
import { ICONS, ROUTES } from "@agensy/constants";
import { useNavigate } from "react-router-dom";
import { useDocumentContext } from "@agensy/context";
import { useAddGeneralDocumentMutation } from "@agensy/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@agensy/utils";
import type { Document } from "@agensy/types";

interface RecentDocumentsCardProps {
  documents?: Array<{
    id: string;
    title: string;
    file_name: string;
    file_type: string;
    document_type: string;
    file_size: number;
    category: string;
    createdAt: string;
    uploadedBy: {
      id: string;
      first_name: string;
      last_name: string;
    };
    client?: {
      id: string;
      first_name: string;
      last_name: string;
    } | null;
  }>;
}

export const RecentDocumentsCard: React.FC<RecentDocumentsCardProps> = ({
  documents = [],
}) => {
  const navigate = useNavigate();
  const { setIsAddDocumentModalOpen } = useDocumentContext();
  const displayedDocuments = documents.slice(0, 4); // Limit to 4 most recent
  const addGeneralDocumentMutation = useAddGeneralDocumentMutation();
  const queryClient = useQueryClient();

  const truncateName = (
    name: string | undefined,
    maxLength: number = 15
  ): string => {
    if (!name) return "";
    return name.length > maxLength
      ? name.substring(0, maxLength) + "..."
      : name;
  };

  useEffect(() => {
    if (addGeneralDocumentMutation.status === "success") {
      queryClient.setQueryData(["general-documents"], (old: Document[]) => {
        if (!old) return [addGeneralDocumentMutation.data];
        return [...old, addGeneralDocumentMutation.data];
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setIsAddDocumentModalOpen(false);
      toast.success("Document added successfully");
    } else if (addGeneralDocumentMutation.status === "error") {
      toast.error("Failed to add document");
    }
  }, [addGeneralDocumentMutation.status]);

  return (
    <>
      <Card title="Recent Documents" className="border-gray-300">
        {displayedDocuments.length > 0 ? (
          <div className="space-y-1.5">
            {displayedDocuments.map((document) => (
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
                          {truncateName(document.uploadedBy?.first_name)}{" "}
                          {truncateName(document.uploadedBy?.last_name)}
                        </span>
                      </div>
                      {document.client && (
                        <div className="flex items-center gap-2">
                          <ICONS.users className="text-gray-400" size={14} />
                          <span>
                            {truncateName(document.client.first_name)}{" "}
                            {truncateName(document.client.last_name)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </BorderedCard>
            ))}
          </div>
        ) : (
          <EmptyStateCard label="documents" ICON={ICONS.document} />
        )}
      </Card>
    </>
  );
};

export default RecentDocumentsCard;
