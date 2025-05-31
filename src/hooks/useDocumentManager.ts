import type { Document } from "@agensy/types";
import { useMemo, useState } from "react";

interface UseDocumentManagerProps {
  documents: Document[];
  initialItemsPerPage?: number;
}

export const useDocumentManager = ({
  documents = [],
  initialItemsPerPage = 5,
}: UseDocumentManagerProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterBy, setFilterBy] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialItemsPerPage);
  const [uploadType, setUploadType] = useState<string>("all");

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = doc.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterBy === "all" || doc.document_type === filterBy;
      const matchesUploadType =
        uploadType === "all" || doc.upload_type === uploadType;
      return matchesSearch && matchesFilter && matchesUploadType;
    });
  }, [documents, filterBy, searchTerm, uploadType]);

  const sortedDocuments = useMemo(() => {
    if (!filteredDocuments.length) return [];

    if (sortBy === "newest") {
      return [...filteredDocuments].sort(
        (a, b) =>
          new Date(b.createdAt as Date).getTime() -
          new Date(a.createdAt as Date).getTime()
      );
    }
    if (sortBy === "oldest") {
      return [...filteredDocuments].sort(
        (a, b) =>
          new Date(a.createdAt as Date).getTime() -
          new Date(b.createdAt as Date).getTime()
      );
    }
    if (sortBy === "a-z") {
      return [...filteredDocuments].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }
    if (sortBy === "z-a") {
      return [...filteredDocuments].sort((a, b) =>
        b.title.localeCompare(a.title)
      );
    }
    return filteredDocuments;
  }, [filteredDocuments, sortBy]);

  const totalPages = useMemo(
    () => Math.ceil((sortedDocuments.length || 0) / itemsPerPage),
    [sortedDocuments, itemsPerPage]
  );

  const paginatedDocuments = useMemo(
    () =>
      sortedDocuments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [sortedDocuments, currentPage, itemsPerPage]
  );

  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, filterBy, sortBy, uploadType]);

  const handleDeleteMoveToLastPage = (documentId: string) => {
    const remainingDocuments = sortedDocuments.filter(
      (doc) => doc.id !== documentId
    );
    const newTotalPages = Math.ceil(remainingDocuments.length / itemsPerPage);

    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  return {
    searchTerm,
    filterBy,
    sortBy,
    currentPage,
    itemsPerPage,
    setSearchTerm,
    setFilterBy,
    setSortBy,
    setCurrentPage,
    setItemsPerPage,
    filteredDocuments,
    sortedDocuments,
    paginatedDocuments,
    totalPages,
    uploadType,
    setUploadType,
    handleDeleteMoveToLastPage
  };
};

export default useDocumentManager;
