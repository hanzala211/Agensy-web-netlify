import {
  APP_ACTIONS,
  DOCUMENT_CATEGORY_OPTIONS,
  DOCUMENT_SORT_OPTIONS,
  ICONS,
  PERMISSIONS,
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
import { useAddDocumentMutation, useDeleteDocumentMutation } from "@agensy/api";
import { useAuthContext, useClientContext } from "@agensy/context";
import type { DocumentFormData } from "@agensy/types";
import { toast } from "@agensy/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDocumentManager } from "@agensy/hooks";

const itemsPerPage = 3;

export const ClientDocuments: React.FC = () => {
  const { userData } = useAuthContext();
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
  const userPermissions =
    PERMISSIONS[userData?.role as keyof typeof PERMISSIONS] || [];

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
    formData.append("description", data.description);
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

  return (
    <div className="w-full px-4">
      <SearchFilterBar
        showButton={userPermissions.includes(APP_ACTIONS.AddDocs)}
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
        buttonText="Add Document"
        onButtonClick={() => setIsAddDocumentModalOpen(true)}
      />
      <div className="mt-8 space-y-7 ">
        {!paginatedDocuments || paginatedDocuments.length === 0 ? (
          <EmptyStateCard
            onClick={() => {
              if (userPermissions.includes(APP_ACTIONS.AddDocs)) {
                setIsAddDocumentModalOpen(true);
              }
            }}
            ICON={ICONS.plus}
            label="Documents"
            showText={userPermissions.includes(APP_ACTIONS.AddDocs)}
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
              showActions={userPermissions.includes(APP_ACTIONS.DeleteDocs)}
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
        onClose={() => setIsAddDocumentModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={addDocumentMutation.isPending}
      />
    </div>
  );
};

export default ClientDocuments;
