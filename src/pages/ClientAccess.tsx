import React, { useState, useEffect, useMemo } from "react";
import {
  AccessCard,
  SearchFilterBar,
  Pagination,
  EmptyStateCard,
  AddAccessModal,
  EditAccessModal,
} from "@agensy/components";
import {
  ACCESS_ROLE_FILTERS,
  ACCESS_SORT_OPTIONS,
  APP_ACTIONS,
  ICONS,
  ROUTES,
} from "@agensy/constants";
import type { AccessInfo, Client } from "@agensy/types";
import { useAuthContext, useClientContext } from "@agensy/context";
import {
  useAddClientAccessMutation,
  useDeleteClientAccessMutation,
  useEditClientAccessMutation,
} from "@agensy/api";
import { toast } from "@agensy/utils";
import { Navigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const itemsPerPage = 4;

export const ClientAccess: React.FC = () => {
  const params = useParams();
  const addClientAccessMutation = useAddClientAccessMutation();
  const deleteClientAccessMutation = useDeleteClientAccessMutation();
  const editClientAccessMutation = useEditClientAccessMutation();
  const {
    selectedClient,
    addClientAccess,
    deleteClientAccess,
    updateClientAccess,
  } = useClientContext();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterBy, setFilterBy] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name-asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isAddAccessModalOpen, setIsAddAccessModalOpen] =
    useState<boolean>(false);
  const [isEditAccessModalOpen, setIsEditAccessModalOpen] =
    useState<boolean>(false);
  const [editData, setEditData] = useState<AccessInfo | null>(null);
  const { handleFilterPermission, loadAllUsers } = useAuthContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (addClientAccessMutation.status === "success") {
      toast.success("User added successfully");
      addClientAccess(addClientAccessMutation.data);
      setIsAddAccessModalOpen(false);
      queryClient.setQueryData(["clients"], (oldData: Client[]) => {
        return [...oldData, addClientAccessMutation.data];
      });
      queryClient.setQueryData(
        ["client", params.clientId],
        (oldData: Client) => {
          return {
            ...oldData,
            Users: [...oldData.Users, addClientAccessMutation.data],
          };
        }
      );
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      loadAllUsers();
    } else if (addClientAccessMutation.status === "error") {
      toast.error("Failed to add user", String(addClientAccessMutation.error));
    }
  }, [addClientAccessMutation.status]);

  useEffect(() => {
    if (deleteClientAccessMutation.status === "success") {
      toast.success("User deleted successfully");
      deleteClientAccess(deleteClientAccessMutation.variables.userId);

      queryClient.setQueryData(["clients"], (oldData: Client[]) => {
        return oldData.map((client) => {
          if (client.id === deleteClientAccessMutation.variables.clientId) {
            return {
              ...client,
              Users: client.Users.filter(
                (user) =>
                  user.id !== deleteClientAccessMutation.variables.userId
              ),
            };
          }
          return client;
        });
      });
      queryClient.setQueryData(
        ["client", params.clientId],
        (oldData: Client) => {
          return {
            ...oldData,
            Users: oldData.Users.filter(
              (user) => user.id !== deleteClientAccessMutation.variables.userId
            ),
          };
        }
      );
      loadAllUsers();
    } else if (deleteClientAccessMutation.status === "error") {
      toast.error(
        "Failed to delete user",
        String(deleteClientAccessMutation.error)
      );
    }
  }, [deleteClientAccessMutation.status]);

  useEffect(() => {
    if (editClientAccessMutation.status === "success") {
      toast.success("User updated successfully");
      updateClientAccess(
        editClientAccessMutation.variables.userId,
        editClientAccessMutation.data
      );
      queryClient.invalidateQueries({
        queryKey: ["client", params.clientId],
      });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setIsEditAccessModalOpen(false);
      setEditData(null);
      loadAllUsers();
    } else if (editClientAccessMutation.status === "error") {
      toast.error(
        "Failed to update user",
        String(editClientAccessMutation.error)
      );
    }
  }, [editClientAccessMutation.status]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterBy, sortBy]);

  const filteredAndSortedAccess = useMemo(() => {
    let filtered: AccessInfo[] = selectedClient?.Users || [];

    if (searchTerm) {
      filtered = filtered.filter((access) => {
        const fullName =
          `${access.first_name} ${access.last_name}`.toLowerCase();
        const relationship = (access.relation || "").toLowerCase();
        const email = (access.email || "").toLowerCase();
        const searchLower = searchTerm.toLowerCase();

        return (
          fullName.includes(searchLower) ||
          relationship.includes(searchLower) ||
          email.includes(searchLower)
        );
      });
    }

    if (filterBy !== "all") {
      filtered = filtered.filter(
        (access) =>
          access.UserRoles.role.toLowerCase().replace(" ", "_") === filterBy
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name-asc": {
          const nameA = `${a.first_name || ""} ${a.last_name || ""}`.trim();
          const nameB = `${b.first_name || ""} ${b.last_name || ""}`.trim();
          return nameA.localeCompare(nameB);
        }
        case "name-desc": {
          const nameDescA = `${a.first_name || ""} ${a.last_name || ""}`.trim();
          const nameDescB = `${b.first_name || ""} ${b.last_name || ""}`.trim();
          return nameDescB.localeCompare(nameDescA);
        }
        case "role":
          return (a.UserRoles.role || "").localeCompare(b.UserRoles.role || "");
        case "relationship":
          return (a.relation || "").localeCompare(b.relation || "");
        case "newest": {
          const dateB = new Date(b.createdAt || 0);
          const dateA = new Date(a.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        }
        case "oldest": {
          const oldestDateA = new Date(a.createdAt || 0);
          const oldestDateB = new Date(b.createdAt || 0);
          return oldestDateA.getTime() - oldestDateB.getTime();
        }
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchTerm, filterBy, sortBy, selectedClient?.Users]);

  const totalPages = useMemo(
    () => Math.ceil(filteredAndSortedAccess.length / itemsPerPage),
    [filteredAndSortedAccess]
  );
  const paginatedAccess = useMemo(
    () =>
      filteredAndSortedAccess.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [filteredAndSortedAccess, currentPage]
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDelete = (userID: string) => {
    deleteClientAccessMutation.mutate({
      clientId: selectedClient?.id as string,
      userId: userID,
    });
  };

  const handleAddUser = (data: unknown) => {
    addClientAccessMutation.mutate({
      items: data,
      clientId: selectedClient?.id as string,
    });
  };

  const handleEditUser = (data: unknown) => {
    editClientAccessMutation.mutate({
      clientId: selectedClient?.id as string,
      userId: editData?.id as string,
      data,
    });
  };

  if (
    !handleFilterPermission(
      selectedClient?.id as string,
      APP_ACTIONS.AccessControl
    )
  )
    return (
      <Navigate
        to={`/${ROUTES.clients}/${params.clientId}/${ROUTES.clientOverview}`}
      />
    );

  return (
    <div className="w-full px-4">
      <SearchFilterBar
        showButton={true}
        searchPlaceholder="Search by contact name, relationship, or email..."
        searchValue={searchTerm}
        setSearchValue={setSearchTerm}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterData={ACCESS_ROLE_FILTERS}
        sortData={ACCESS_SORT_OPTIONS}
        filterLabel="Role"
        sortLabel="Sort by"
        buttonText="Add User"
        onButtonClick={() => setIsAddAccessModalOpen(true)}
      />

      <div className="mt-8 space-y-6">
        {!paginatedAccess || paginatedAccess.length === 0 ? (
          <EmptyStateCard
            onClick={() => {
              if (
                handleFilterPermission(
                  selectedClient?.id as string,
                  APP_ACTIONS.AccessControl
                )
              ) {
                setIsAddAccessModalOpen(true);
              }
            }}
            showText={handleFilterPermission(
              selectedClient?.id as string,
              APP_ACTIONS.AccessControl
            )}
            ICON={ICONS.plus}
            label="Contacts"
          />
        ) : (
          paginatedAccess.map((access) => (
            <AccessCard
              key={access.id}
              access={access}
              onDelete={() => handleDelete(String(access.id))}
              isDeleting={deleteClientAccessMutation.isPending}
              onEdit={() => {
                setIsEditAccessModalOpen(true);
                setEditData(access);
              }}
            />
          ))
        )}
      </div>
      {paginatedAccess.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />
      )}
      <AddAccessModal
        isOpen={isAddAccessModalOpen}
        onClose={() => setIsAddAccessModalOpen(false)}
        onSubmit={handleAddUser}
        isLoading={addClientAccessMutation.isPending}
      />
      <EditAccessModal
        isOpen={isEditAccessModalOpen}
        onClose={() => {
          setIsEditAccessModalOpen(false);
          setEditData(null);
        }}
        editData={editData as AccessInfo}
        onSubmit={handleEditUser}
        isLoading={editClientAccessMutation.isPending}
      />
    </div>
  );
};

export default ClientAccess;
