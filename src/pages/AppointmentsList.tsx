import React, { useEffect, useState } from "react";
import {
  AddAppointmentModal,
  AppointmentCard,
  EmptyStateCard,
  Pagination,
  SearchFilterBar,
} from "@agensy/components";
import {
  APPOINTMENT_SORT_OPTIONS,
  APPOINTMENT_TYPE_FILTERS,
  ICONS,
} from "@agensy/constants";
import type { Appointment, AppointmentFormData, Client } from "@agensy/types";
import { useAppointmentManager } from "@agensy/hooks";
import { useAppointmentsContext, useAuthContext } from "@agensy/context";
import {
  useDeleteClientAppointmentMutation,
  useEditClientAppointmentMutation,
} from "@agensy/api";
import { toast } from "@agensy/utils";

export const AppointmentsList: React.FC = () => {
  const deleteClientAppointmentMutation = useDeleteClientAppointmentMutation();
  const editClientAppointmentMutation = useEditClientAppointmentMutation();
  const {
    appointments,
    setIsAddAppointmentModalOpen,
    deleteAppointment,
    editAppointment,
  } = useAppointmentsContext();
  const { clients } = useAuthContext();
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
    handleDeleteMoveToLastPage,
    clientFilter,
    setClientFilter,
    from,
    setFrom,
    to,
    setTo,
  } = useAppointmentManager({
    appointments: appointments as Appointment[],
    initialItemsPerPage: 4,
  });
  const [editAppointmentData, setEditAppointmentData] =
    useState<Appointment | null>(null);
  const [isEditAppointmentModalOpen, setIsEditAppointmentModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    if (!isEditAppointmentModalOpen) removeEditAppointment();
  }, [isEditAppointmentModalOpen]);

  useEffect(() => {
    if (deleteClientAppointmentMutation.status === "success") {
      deleteAppointment(
        deleteClientAppointmentMutation.variables.appointmentId
      );
      toast.success("Appointment deleted successfully");
      handleDeleteMoveToLastPage(
        deleteClientAppointmentMutation.variables.appointmentId
      );
    } else if (deleteClientAppointmentMutation.status === "error") {
      toast.error("Failed to delete appointment");
    }
  }, [deleteClientAppointmentMutation.status]);

  useEffect(() => {
    if (editClientAppointmentMutation.status === "success") {
      toast.success("Appointment updated successfully");
      editAppointment(editClientAppointmentMutation.data);
      setIsEditAppointmentModalOpen(false);
      setEditAppointmentData(null);
    } else if (editClientAppointmentMutation.status === "error") {
      toast.error("Failed to update appointment");
    }
  }, [editClientAppointmentMutation.status]);

  const handleEdit = (data: AppointmentFormData) => {
    const postData = {
      title: data.title,
      appointment_type: data.appointment_type,
      start_time: new Date(data.start_time).toISOString(),
      end_time: new Date(data.end_time).toISOString(),
      notes: data.notes,
      location: data.location,
      healthcare_provider_id: data.healthcare_provider_id,
      post_appointment_notes: data.post_appointment_notes || "",
    };
    editClientAppointmentMutation.mutate({
      clientId: data.clientId as string,
      appointmentId: editAppointmentData?.id as string,
      items: postData,
    });
  };

  const handleDelete = (appointment: Appointment) => {
    deleteClientAppointmentMutation.mutate({
      clientId: appointment.client_id,
      appointmentId: appointment.id,
    });
  };

  const handleOpenEditModal = (appointment: Appointment) => {
    setEditAppointmentData(appointment);
    setIsEditAppointmentModalOpen(true);
  };

  const removeEditAppointment = () => {
    setTimeout(() => {
      setEditAppointmentData(null);
    }, 100);
  };

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
            showText={true}
            onClick={() => setIsAddAppointmentModalOpen(true)}
          />
        ) : (
          paginatedAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onEdit={handleOpenEditModal}
              onDelete={handleDelete}
              isDeleting={deleteClientAppointmentMutation.isPending}
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
