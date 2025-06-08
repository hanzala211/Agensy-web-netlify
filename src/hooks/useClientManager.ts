import { useGetClientsQuery } from "@agensy/api";
import type { Client } from "@agensy/types";
import { useMemo, useState } from "react";

export const useClientManager = ({
  initialItemPerPage = 5,
}: {
  initialItemPerPage: number;
}) => {
  const {
    data: clients,
    isLoading,
    error,
    refetch: loadClients,
  } = useGetClientsQuery();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterBy, setFilterBy] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [itemsPerPage] = useState<number>(initialItemPerPage);

  const filteredClients = useMemo(
    () =>
      !isLoading
        ? [...(clients || [])].filter((client: Client) => {
            const matchesSearch = `${client.first_name} ${client.last_name}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
            const matchesFilter =
              filterBy === "all" ||
              (filterBy === "active" && client.active) ||
              (filterBy === "inactive" && !client.active);

            return matchesSearch && matchesFilter;
          })
        : [],
    [isLoading, clients, searchTerm, filterBy]
  );

  const sortClients = useMemo(() => {
    return (clients: Client[], sortBy: string) => {
      return [...(clients || [])].sort((a, b) => {
        switch (sortBy) {
          case "name":
            return a.first_name.localeCompare(b.first_name);
          case "status":
            if (a.active && !b.active) return -1;
            if (!a.active && b.active) return 1;
            return 0;
          case "dob":
            return (
              new Date(b.date_of_birth).getTime() -
              new Date(a.date_of_birth).getTime()
            );
          case "living":
            return a.living_situation.localeCompare(b.living_situation);
          default:
            return 0;
        }
      });
    };
  }, []);

  const sortedClients = sortClients(filteredClients, sortBy);

  const totalPages = useMemo(
    () => Math.ceil(sortedClients.length / itemsPerPage),
    [sortedClients]
  );
  const paginatedClients = useMemo(
    () =>
      sortedClients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [sortedClients, currentPage]
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return {
    searchTerm,
    currentPage,
    filterBy,
    sortBy,
    setSearchTerm,
    setCurrentPage,
    setFilterBy,
    setSortBy,
    filteredClients,
    sortedClients,
    totalPages,
    paginatedClients,
    handlePrevPage,
    handleNextPage,
    error,
    isLoading,
    loadClients,
    clients,
  };
};
