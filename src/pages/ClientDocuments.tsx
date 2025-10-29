import {
  APP_ACTIONS,
  DOCUMENT_CATEGORY_OPTIONS,
  DOCUMENT_SORT_OPTIONS,
  ICONS,
  ROUTES,
} from "@agensy/constants";
import {
  AddDocumentModal,
  DocumentCard,
  Pagination,
  SearchFilterBar,
} from "@agensy/components";
import type React from "react";
import { useEffect, useState } from "react";
import { EmptyStateCard } from "@agensy/components";
import {
  useAddDocumentMutation,
  useAnalyzeDocumentMutation,
  useDeleteDocumentMutation,
} from "@agensy/api";
import { useAuthContext, useClientContext } from "@agensy/context";
import type { ConfidenceScore, DocumentFormData } from "@agensy/types";
import { toast } from "@agensy/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDocumentManager } from "@agensy/hooks";

const itemsPerPage = 3;

export const ClientDocuments: React.FC = () => {
  const { handleFilterPermission } = useAuthContext();
  const addDocumentMutation = useAddDocumentMutation();
  const deleteDocumentMutation = useDeleteDocumentMutation();
  const { selectedClient, addClientDocument, deleteClientDocument } =
    useClientContext();
  const {
    totalPages,
    paginatedDocuments,
    sortBy,
    filterBy,
    setSortBy,
    setFilterBy,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    handleDeleteMoveToLastPage,
  } = useDocumentManager({
    documents: selectedClient?.documents || [],
    initialItemsPerPage: itemsPerPage,
  });
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] =
    useState<boolean>(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const clientDocumentAnalyzeMutation = useAnalyzeDocumentMutation();
  const [analyzedDocRes, setAnalyzedDocRes] = useState<ConfidenceScore | null>(
    null
  );

  useEffect(() => {
    if (addDocumentMutation.status === "success") {
      setIsAddDocumentModalOpen(false);
      addClientDocument(addDocumentMutation.data);
      toast.success("Document added successfully");
      queryClient.invalidateQueries({
        queryKey: ["client", selectedClient?.id],
      });
    } else if (addDocumentMutation.status === "error") {
      toast.error("Failed to add document");
    }
  }, [addDocumentMutation.status]);

  useEffect(() => {
    if (clientDocumentAnalyzeMutation.status === "success") {
      console.log(clientDocumentAnalyzeMutation.data);
      setAnalyzedDocRes(clientDocumentAnalyzeMutation.data);
      toast.success("Document analyzed successfully");
    } else if (clientDocumentAnalyzeMutation.status === "error") {
      toast.error("Failed to analyze document");
    }
  }, [clientDocumentAnalyzeMutation.status]);

  useEffect(() => {
    if (deleteDocumentMutation.status === "success") {
      toast.success("Document deleted successfully");
      deleteClientDocument(deleteDocumentMutation.variables.documentId);
      queryClient.invalidateQueries({
        queryKey: ["client", selectedClient?.id],
      });
      handleDeleteMoveToLastPage(deleteDocumentMutation.variables.documentId);
    } else if (deleteDocumentMutation.status === "error") {
      toast.error("Failed to delete document");
    }
  }, [deleteDocumentMutation.status]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterBy, sortBy]);

  const handleSubmit = (data: DocumentFormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("document_type", data.documentType);
    formData.append("description", data.description || "");
    formData.append("file", data.file);
    formData.append("category", data.documentType as string);
    addDocumentMutation.mutate({
      clientId: selectedClient?.id as string,
      data: formData,
    });
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDelete = (documentId: string) => {
    deleteDocumentMutation.mutate({
      clientId: selectedClient?.id as string,
      documentId: documentId,
    });
  };

  const handleAnalyze = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    toast.info("Analyzing document.");
    clientDocumentAnalyzeMutation.mutate({
      clientId: selectedClient?.id as string,
      data: formData,
    });
  };

  return (
    <div className="w-full px-4">
      <SearchFilterBar
        showButton={true}
        searchPlaceholder="Search documents..."
        searchValue={searchTerm}
        setSearchValue={setSearchTerm}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterData={[
          { label: "All", value: "all" },
          ...DOCUMENT_CATEGORY_OPTIONS,
        ]}
        sortData={DOCUMENT_SORT_OPTIONS}
        filterLabel=""
        sortLabel=""
        buttonText="Add Document"
        onButtonClick={() => setIsAddDocumentModalOpen(true)}
        customFilterWidth="sm:!min-w-[200px] !min-w-full"
      />
      <div className="mt-8 space-y-1">
        {!paginatedDocuments || paginatedDocuments.length === 0 ? (
          <EmptyStateCard
            onClick={() => {
              setIsAddDocumentModalOpen(true);
            }}
            ICON={ICONS.plus}
            label="Documents"
          />
        ) : (
          paginatedDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onDelete={handleDelete}
              isDeleting={deleteDocumentMutation.isPending}
              onPreview={() =>
                navigate(
                  `/${ROUTES.clients}/${selectedClient?.id}/${ROUTES.clientDocuments}/${doc.id}`
                )
              }
              showActions={handleFilterPermission(
                selectedClient?.id as string,
                APP_ACTIONS.DeleteDocs
              )}
            />
          ))
        )}
        {paginatedDocuments && paginatedDocuments.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
          />
        )}
      </div>
      <AddDocumentModal
        isOpen={isAddDocumentModalOpen}
        onClose={() => {
          setAnalyzedDocRes(null);
          setIsAddDocumentModalOpen(false);
        }}
        onSubmit={handleSubmit}
        isLoading={addDocumentMutation.isPending}
        handleAnalyze={handleAnalyze}
        isAnalyzing={clientDocumentAnalyzeMutation.isPending}
        analyzedDocRes={analyzedDocRes}
      />
    </div>
  );
};

export default ClientDocuments;
