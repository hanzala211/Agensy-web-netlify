import { useEffect, useState } from "react";
import {
  ClientCard,
  AddClientModal,
  ClientSkeleton,
  PageHeader,
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
import { useAddClientMutation } from "@agensy/api";
import { DateUtils, toast } from "@agensy/utils";
import { useClientManager } from "@agensy/hooks";
import { useAuthContext, useClientContext } from "@agensy/context";

export const Clients: React.FC = () => {
  const {
    clients,
    isLoading,
    error,
    loadClients,
    searchTerm,
    setSearchTerm,
    filterBy,
    setFilterBy,
    sortBy,
    setSortBy,
    paginatedClients,
    totalPages,
    currentPage,
    handlePrevPage,
    handleNextPage,
    sortedClients,
  } = useClientManager({ initialItemPerPage: 5 });
  const addClientMutation = useAddClientMutation();
  const { setSelectedClient } = useClientContext();
  const { isPrimaryUserSubscriptionActive, userData } = useAuthContext();
  const [isAddClientModalOpen, setIsAddClientModalOpen] =
    useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (addClientMutation.status === "success") {
      setIsAddClientModalOpen(false);
      addClientMutation.reset();
      loadClients();
    } else if (addClientMutation.status === "error") {
      toast.error("Failed to add client", String(addClientMutation.error));
    }
  }, [addClientMutation.status]);

  useEffect(() => {
    loadClients();
  }, []);

  const handleViewProfile = (clientId: string) => {
    const client = clients?.find(
      (client: Client) => client?.id?.toString() === clientId
    );
    if (client) {
      setSelectedClient(client);
      navigate(`/${ROUTES.clients}/${clientId}/${ROUTES.clientOverview}`);
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
    <div className="overflow-y-auto h-[100dvh] max-h-[calc(100dvh-50px)] md:max-h-[calc(100dvh)] w-full px-4 py-6">
      <PageHeader
        title="Care Recipients"
        buttonText="Add Care Recipient"
        buttonAriaLabel="Add new care recipient"
        onButtonClick={() => {
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
        }}
      />

      <SearchFilterBar
        searchPlaceholder="Search care recipients..."
        searchValue={searchTerm}
        setSearchValue={setSearchTerm}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterData={CLIENTS_FILTERS}
        sortData={CLIENTS_SORT_OPTIONS}
      />

      <div className="space-y-4 mb-6">
        {isLoading ? (
          Array(5)
            .fill(null)
            .map((_, index) => <ClientSkeleton key={`skeleton-${index}`} />)
        ) : paginatedClients.length > 0 ? (
          paginatedClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onViewProfile={() =>
                handleViewProfile(client?.id?.toString() || "")
              }
              loadClients={loadClients}
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

      {!isLoading && sortedClients.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />
      )}
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
