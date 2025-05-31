import {
  DOCUMENT_CATEGORY_OPTIONS,
  DOCUMENT_SORT_OPTIONS,
  DOCUMENT_UPLOAD_TYPE_OPTIONS,
  ICONS,
} from "@agensy/constants";
import {
  DocumentCard,
  DocumentsManagerSkeleton,
  EmptyStateCard,
  Pagination,
  SearchFilterBar,
} from "@agensy/components";
import type React from "react";
import { useEffect } from "react";
import {
  useDeleteDocumentMutation,
  useDeleteGeneralDocumentMutation,
  useGetGeneralDocumentsQuery,
} from "@agensy/api";
import { useDocumentContext } from "@agensy/context";
import { toast } from "@agensy/utils";
import { useNavigate } from "react-router-dom";
import { useDocumentManager } from "@agensy/hooks";
import { useQueryClient } from "@tanstack/react-query";
import type { Document } from "@agensy/types";

const itemsPerPage = 4;

export const DocumentsManager: React.FC = () => {
  const {
    data: generalDocuments,
    refetch: loadGeneralDocuments,
    isLoading: isLoadingGeneralDocuments,
  } = useGetGeneralDocumentsQuery();
  const { setIsAddDocumentModalOpen } = useDocumentContext();
  const deleteDocumentMutation = useDeleteGeneralDocumentMutation();
  const deleteClientDocumentMutation = useDeleteDocumentMutation();
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
    uploadType,
    setUploadType,
    handleDeleteMoveToLastPage,
  } = useDocumentManager({
    documents: generalDocuments || [],
    initialItemsPerPage: itemsPerPage,
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    loadGeneralDocuments();
  }, []);

  useEffect(() => {
    if (deleteDocumentMutation.status === "success") {
      toast.success("Document deleted successfully");
      queryClient.setQueryData(["general-documents"], (old: Document[]) => {
        return old.filter(
          (doc) => doc?.id !== deleteDocumentMutation.variables
        );
      });
      handleDeleteMoveToLastPage(deleteDocumentMutation.variables);
    } else if (deleteDocumentMutation.status === "error") {
      toast.error("Failed to delete document");
    }
  }, [deleteDocumentMutation.status]);

  useEffect(() => {
    if (deleteClientDocumentMutation.status === "success") {
      toast.success("Document deleted successfully");
      queryClient.setQueryData(["general-documents"], (old: Document[]) => {
        return old.filter(
          (doc) => doc?.id !== deleteClientDocumentMutation.variables.documentId
        );
      });
      handleDeleteMoveToLastPage(
        deleteClientDocumentMutation.variables.documentId
      );
    } else if (deleteClientDocumentMutation.status === "error") {
      toast.error("Failed to delete document");
    }
  }, [deleteClientDocumentMutation.status]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterBy, sortBy]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDelete = (documentId: string, clientId?: string) => {
    console.log(documentId);
    if (clientId) {
      deleteClientDocumentMutation.mutate({
        clientId,
        documentId,
      });
    } else {
      deleteDocumentMutation.mutate(documentId);
    }
  };

  if (isLoadingGeneralDocuments)
    return <DocumentsManagerSkeleton itemsCount={4} />;

  return (
    <div className="w-full">
      <SearchFilterBar
        showExtraFilter={true}
        extraFilterLabel="Upload Type"
        extraFilter={uploadType}
        setExtraFilter={setUploadType}
        extraFilterData={DOCUMENT_UPLOAD_TYPE_OPTIONS}
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
        filterLabel="Category"
        sortLabel="Sort by"
      />
      <div className="mt-8 space-y-7 ">
        {!paginatedDocuments || paginatedDocuments.length === 0 ? (
          <EmptyStateCard
            onClick={() => setIsAddDocumentModalOpen(true)}
            ICON={ICONS.plus}
            label="Documents"
          />
        ) : (
          paginatedDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onDelete={handleDelete}
              isDeleting={
                deleteDocumentMutation.isPending ||
                deleteClientDocumentMutation.isPending
              }
              onPreview={() => navigate(`${doc.id}`)}
              showLabel={true}
              showClientName={doc.client_id ? true : false}
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
    </div>
  );
};

export default DocumentsManager;
