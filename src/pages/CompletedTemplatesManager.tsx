import {
  EmptyStateCard,
  Pagination,
  SearchFilterBar,
  TemplateCard,
} from "@agensy/components";
import {
  ICONS,
  MOCK_TEMPLATES,
  TEMPLATE_SORT_OPTIONS,
  TEMPLATE_TYPE_OPTIONS,
} from "@agensy/constants";
import type { Template } from "@agensy/types";
import type React from "react";
import { useTemplateManager } from "@agensy/hooks";

export const CompletedTemplatesManager: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    filterBy,
    setFilterBy,
    sortBy,
    setSortBy,
    paginatedTemplates,
    totalPages,
    currentPage,
    handlePrevPage,
    handleNextPage,
  } = useTemplateManager({
    initialItemsPerPage: 6,
    templates: MOCK_TEMPLATES,
  });

  return (
    <div className="w-full">
      <SearchFilterBar
        searchPlaceholder="Search completed templates..."
        searchValue={searchTerm}
        setSearchValue={setSearchTerm}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterData={[{ label: "All", value: "all" }, ...TEMPLATE_TYPE_OPTIONS]}
        sortData={TEMPLATE_SORT_OPTIONS}
        filterLabel="Type"
        sortLabel="Sort by"
      />
      <div className="mt-8 space-y-4">
        {paginatedTemplates.length === 0 ? (
          <EmptyStateCard
            showText={false}
            ICON={ICONS.document}
            label="Completed Templates"
          />
        ) : (
          paginatedTemplates.map((template: Template) => (
            <TemplateCard
              key={template.id}
              template={template}
              showCompletedDate={true}
            />
          ))
        )}
        {paginatedTemplates.length > 0 && (
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

export default CompletedTemplatesManager;
