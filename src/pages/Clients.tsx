import { useEffect, useMemo, useState } from "react";
import {
  ClientCard,
  AddClientModal,
  ClientSkeleton,
  SearchFilterBar,
  Pagination,
  EmptyStateCard,
} from "@agensy/components";
import {
  CLIENTS_FILTERS,
  CLIENTS_SORT_OPTIONS,
  ICONS,
  ROLES,
  ROUTES,
  SUBSCRIPTION_STATUSES,
} from "@agensy/constants";
import type { Client, ClientFormData } from "@agensy/types";
import { useNavigate } from "react-router-dom";
import {
  useAddClientMutation,
  useGetClientsWithFiltersQuery,
} from "@agensy/api";
import { DateUtils, toast } from "@agensy/utils";
import {
  useAuthContext,
  useClientContext,
  useHeaderContext,
} from "@agensy/context";

export const Clients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [filterBy, setFilterBy] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 5;

  const status = useMemo(() => {
    return filterBy === "all" ? undefined : filterBy;
  }, [filterBy]);

  const backendSortBy = useMemo(() => {
    return sortBy
      ? sortBy === "dob"
        ? "date_of_birth"
        : sortBy === "living"
        ? "living_situation"
        : sortBy
      : undefined;
  }, [sortBy]);

  const sortOrder = "asc";

  const queryParams = useMemo(
    () => ({
      status,
      sortBy: backendSortBy,
      sortOrder,
      page: currentPage,
      limit,
      search: debouncedSearchTerm || undefined,
    }),
    [status, backendSortBy, sortOrder, currentPage, limit, debouncedSearchTerm]
  );

  const clientsQuery = useGetClientsWithFiltersQuery(queryParams);

  const clientsData = clientsQuery.data;
  const clients = clientsData?.data || [];
  const pagination = clientsData?.pagination;
  useEffect(() => {
    if (pagination && pagination?.totalPages > 0) {
      setTotalPages(pagination?.totalPages || 0);
    }
  }, [pagination?.totalPages]);
  const isLoading = clientsQuery.isLoading;
  const error = clientsQuery.error;

  const addClientMutation = useAddClientMutation();
  const { setSelectedClient } = useClientContext();
  const { isPrimaryUserSubscriptionActive, userData } = useAuthContext();
  const [isAddClientModalOpen, setIsAddClientModalOpen] =
    useState<boolean>(false);
  const navigate = useNavigate();
  const { setHeaderConfig } = useHeaderContext();

  const refetchClients = () => {
    clientsQuery.refetch();
  };

  useEffect(() => {
    setHeaderConfig({
      showButton: true,
      onButtonClick() {
        if (
          (userData?.subscription_status === SUBSCRIPTION_STATUSES.INACTIVE ||
            userData?.subscription_status ===
              SUBSCRIPTION_STATUSES.CANCELLED) &&
          userData?.role !== ROLES.ADMIN
        ) {
          toast.error(
            "Subscription Error!",
            "Please upgrade your subscription to add a care recipient."
          );
          navigate("/settings/billing");
          return;
        }
        setIsAddClientModalOpen(true);
      },
      showBackButton: false,
      buttonText: "Add Care Recipient",
      buttonAriaLabel: "Add new care recipient",
      disabled: false,
      title: "Care Recipients",
    });
  }, [userData]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Reset page to 1 when filters, search, or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterBy, debouncedSearchTerm, sortBy]);

  useEffect(() => {
    if (addClientMutation.status === "success") {
      setIsAddClientModalOpen(false);
      addClientMutation.reset();
      refetchClients();
    } else if (addClientMutation.status === "error") {
      toast.error("Failed to add client", String(addClientMutation.error));
    }
  }, [addClientMutation.status]);

  const handleViewProfile = (clientId: string) => {
    const client = clients.find(
      (client: Client) => client?.id?.toString() === clientId
    );
    if (client) {
      setSelectedClient(client);
      navigate(`/${ROUTES.clients}/${clientId}/${ROUTES.clientOverview}`);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleAddClient = (data: ClientFormData) => {
    const postData: unknown = {
      first_name: data.firstName,
      last_name: data.lastName,
      preferred_name: data.preferredName ? data.preferredName : null,
      date_of_birth: data.dateOfBirth
        ? DateUtils.changetoISO(data.dateOfBirth)
        : null,
      gender: data.gender ? data.gender : null,
      marital_status: data.maritalStatus ? data.maritalStatus : null,
      address: data.address ? data.address : null,
      city: data.city ? data.city : null,
      state: data.state ? data.state : null,
      zip: data.zipCode ? data.zipCode : null,
      living_situation: data.livingSituation ? data.livingSituation : null,
      hospital_phone: data.hospital_phone ? data.hospital_phone : null,
      hospital_address: data.hospital_address ? data.hospital_address : null,
      pharmacy_name: data.pharmacy_name ? data.pharmacy_name : null,
      pharmacy_phone: data.pharmacy_phone ? data.pharmacy_phone : null,
      pharmacy_address: data.pharmacy_address ? data.pharmacy_address : null,
      pharmacy_fax: data.pharmacy_fax ? data.pharmacy_fax : null,
      preferred_hospital: data.preferred_hospital
        ? data.preferred_hospital
        : null,
      primary_user_id: data.familyAdminId ? data.familyAdminId : null,
    };
    // @ts-expect-error // TODO type error
    if (!postData.primary_user_id) {
      // @ts-expect-error // TODO type error
      delete postData.primary_user_id;
    }
    addClientMutation.mutate(postData);
  };

  const handleEmptyStateClick = () => {
    if (
      (userData?.subscription_status === SUBSCRIPTION_STATUSES.INACTIVE ||
        userData?.subscription_status === SUBSCRIPTION_STATUSES.CANCELLED) &&
      userData?.role !== ROLES.ADMIN
    ) {
      toast.error(
        "Subscription Error!",
        "Please upgrade your subscription to add a care recipient."
      );
      navigate("/settings/billing");
      return;
    }
    setIsAddClientModalOpen(true);
  };
  return (
    <div className="overflow-y-auto h-[100dvh] max-h-[calc(100dvh-75px)] w-full px-4 py-6">
      <SearchFilterBar
        searchPlaceholder="Search care recipients..."
        customFilterWidth="sm:!min-w-[250px] !min-w-full"
        searchValue={searchTerm}
        setSearchValue={setSearchTerm}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterData={CLIENTS_FILTERS}
        filterLabel=""
        sortData={CLIENTS_SORT_OPTIONS}
        sortLabel=""
      />

      <div className="space-y-1 mb-6">
        {isLoading ? (
          Array(5)
            .fill(null)
            .map((_, index) => <ClientSkeleton key={`skeleton-${index}`} />)
        ) : clients.length > 0 ? (
          clients.map((client: Client) => (
            <ClientCard
              key={client.id}
              client={client}
              onViewProfile={() =>
                handleViewProfile(client?.id?.toString() || "")
              }
              loadClients={refetchClients}
              isPrimaryUserSubscribed={isPrimaryUserSubscriptionActive(
                client.id?.toString() || ""
              )}
            />
          ))
        ) : error ? (
          <EmptyStateCard
            label="Client"
            ICON={ICONS.plus}
            onClick={handleEmptyStateClick}
          />
        ) : (
          <EmptyStateCard
            label="Client"
            ICON={ICONS.plus}
            onClick={handleEmptyStateClick}
          />
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />
      <AddClientModal
        isOpen={isAddClientModalOpen}
        setIsOpen={setIsAddClientModalOpen}
        title="Add Care Recipient Profile"
        btnText="Add Care Recipient"
        onSubmit={handleAddClient}
        isButtonLoading={addClientMutation.isPending}
      />
    </div>
  );
};

export default Clients;
