import React, { useEffect } from "react";
import {
  AddAppointmentModal,
  AppointmentCard,
  EmptyStateCard,
  Pagination,
  SearchFilterBar,
} from "@agensy/components";
import {
  APP_ACTIONS,
  APPOINTMENT_SORT_OPTIONS,
  APPOINTMENT_TYPE_FILTERS,
  ICONS,
  PERMISSIONS,
} from "@agensy/constants";
import type { Appointment, Client } from "@agensy/types";
import { useAppointmentManager, useCalendarState } from "@agensy/hooks";
import { useAppointmentsContext, useAuthContext } from "@agensy/context";

export const AppointmentsList: React.FC = () => {
  const { appointments, setIsAddAppointmentModalOpen } =
    useAppointmentsContext();
  const {
    handleDelete,
    handleEdit,
    handleOpenEditModal,
    removeEditAppointment,
    isEditAppointmentModalOpen,
    setIsEditAppointmentModalOpen,
    editAppointmentData,
    deleteClientAppointmentMutation,
    editClientAppointmentMutation,
  } = useCalendarState(appointments as Appointment[]);
  const { clients, userData } = useAuthContext();
  const {
    searchTerm,
    setSearchTerm,
    filterBy,
    setFilterBy,
    sortBy,
    setSortBy,
    currentPage,
    totalPages,
    paginatedAppointments,
    handlePrevPage,
    handleNextPage,
    clientFilter,
    setClientFilter,
    from,
    setFrom,
    to,
    setTo,
    handleDeleteMoveToLastPage,
  } = useAppointmentManager({
    appointments: appointments as Appointment[],
    initialItemsPerPage: 4,
  });
  const userPermissions =
    PERMISSIONS[userData?.role as keyof typeof PERMISSIONS] || [];

  useEffect(() => {
    if (deleteClientAppointmentMutation.status === "success") {
      handleDeleteMoveToLastPage(
        deleteClientAppointmentMutation.variables.appointmentId
      );
    }
  }, [deleteClientAppointmentMutation.status]);

  return (
    <div className="space-y-6">
      <SearchFilterBar
        searchPlaceholder="Search appointments by title, type, or location..."
        searchValue={searchTerm}
        setSearchValue={setSearchTerm}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterData={APPOINTMENT_TYPE_FILTERS}
        sortData={APPOINTMENT_SORT_OPTIONS}
        filterLabel="Type"
        sortLabel="Sort by"
        showExtraFilter={true}
        extraFilterLabel="Client"
        extraFilterData={[
          { label: "All", value: "all" },
          ...(clients?.map((client: Client) => ({
            label: `${client.first_name} ${client.last_name}`,
            value: client.id as string,
          })) || []),
        ]}
        extraFilter={clientFilter}
        setExtraFilter={setClientFilter}
        showDatePicker={true}
        firstDateValue={from}
        setFirstDateValue={setFrom}
        secondDateValue={to}
        setSecondDateValue={setTo}
      />

      <div className="space-y-4">
        {paginatedAppointments.length === 0 ? (
          <EmptyStateCard
            ICON={ICONS.plus}
            label="Appointments"
            showText={userPermissions.includes(
              APP_ACTIONS.ClientAppointmentInfoEdit
            )}
            onClick={() => {
              if (
                userPermissions.includes(APP_ACTIONS.ClientAppointmentInfoEdit)
              ) {
                setIsAddAppointmentModalOpen(true);
              }
            }}
          />
        ) : (
          paginatedAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onEdit={handleOpenEditModal}
              onDelete={handleDelete}
              isDeleting={deleteClientAppointmentMutation.isPending}
              showActions={userPermissions.includes(
                APP_ACTIONS.ClientAppointmentInfoEdit
              )}
            />
          ))
        )}
      </div>

      {paginatedAppointments.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />
      )}
      <AddAppointmentModal
        isOpen={isEditAppointmentModalOpen}
        onClose={() => {
          removeEditAppointment();
          setIsEditAppointmentModalOpen(false);
        }}
        onSubmit={handleEdit}
        editData={editAppointmentData as Appointment}
        isLoading={editClientAppointmentMutation.isPending}
      />
    </div>
  );
};

export default AppointmentsList;
