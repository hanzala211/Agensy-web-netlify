import { useMemo, useState } from "react";
import { MOCK_TEMPLATES } from "@agensy/constants";
import type { Template } from "@agensy/types";

interface UseTemplateManagerProps {
  initialItemsPerPage?: number;
  templates?: Template[];
}

export const useTemplateManager = ({
  initialItemsPerPage = 10,
  templates = MOCK_TEMPLATES,
}: UseTemplateManagerProps = {}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterBy, setFilterBy] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(initialItemsPerPage);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch = template.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === "all" || template.type === filterBy;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filterBy, templates]);

  const sortedTemplates = useMemo(() => {
    return [...filteredTemplates].sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime()
        );
      }
      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt || "").getTime() -
          new Date(b.createdAt || "").getTime()
        );
      }
      if (sortBy === "a-z") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "z-a") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });
  }, [filteredTemplates, sortBy, templates]);

  const totalPages = useMemo(() => {
    return Math.ceil(sortedTemplates.length / itemsPerPage);
  }, [sortedTemplates, itemsPerPage]);

  const paginatedTemplates = useMemo(() => {
    return sortedTemplates.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [sortedTemplates, currentPage, itemsPerPage]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return {
    searchTerm,
    setSearchTerm,
    filterBy,
    setFilterBy,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedTemplates,
    handlePrevPage,
    handleNextPage,
  };
};

export default useTemplateManager;
