import { useState, useCallback, useEffect } from "react";
import type { Appointment, AppointmentFormData, ViewMode } from "@agensy/types";
import { CalendarUtils, DateUtils, toast } from "@agensy/utils";
import { useDeleteClientAppointmentMutation } from "@agensy/api";
import { useAppointmentsContext } from "@agensy/context";
import { useEditClientAppointmentMutation } from "@agensy/api";

export const useCalendarState = (appointments: Appointment[]) => {
  const deleteClientAppointmentMutation = useDeleteClientAppointmentMutation();
  const editClientAppointmentMutation = useEditClientAppointmentMutation();
  const { deleteAppointment, editAppointment } = useAppointmentsContext();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [selectedAppointments, setSelectedAppointments] = useState<
    Appointment[]
  >([]);
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

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
      setSelectedAppointments(
        CalendarUtils.getFilteredAppointments(
          currentDate,
          appointments,
          viewMode,
          clientFilter,
          typeFilter
        )
      );
      toast.success("Appointment deleted successfully");
    } else if (deleteClientAppointmentMutation.status === "error") {
      toast.error("Failed to delete appointment");
    }
  }, [deleteClientAppointmentMutation.status]);

  useEffect(() => {
    if (editClientAppointmentMutation.status === "success") {
      toast.success("Appointment updated successfully");
      editAppointment(editClientAppointmentMutation.data);
      setSelectedAppointments(
        CalendarUtils.getFilteredAppointments(
          currentDate,
          appointments,
          viewMode,
          clientFilter,
          typeFilter
        )
      );
      setIsEditAppointmentModalOpen(false);
      setEditAppointmentData(null);
    } else if (editClientAppointmentMutation.status === "error") {
      toast.error("Failed to update appointment");
    }
  }, [editClientAppointmentMutation.status]);

  const handleEdit = (data: AppointmentFormData) => {
    const postData = {
      title: data.title ? data.title : null,
      appointment_type: data.appointment_type ? data.appointment_type : null,
      start_time: data.start_time
        ? DateUtils.changetoISO(data.start_time)
        : null,
      end_time: data.end_time ? DateUtils.changetoISO(data.end_time) : null,
      notes: data.notes ? data.notes : null,
      location: data.location ? data.location : null,
      healthcare_provider_id: data.healthcare_provider_id
        ? data.healthcare_provider_id
        : null,
      post_appointment_notes: data.post_appointment_notes
        ? data.post_appointment_notes
        : null,
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

  const handleSelectSlot = useCallback(
    (slotInfo: { start: Date; end: Date; action: string }) => {
      const { start } = slotInfo;
      setCurrentDate(start);
      setSelectedSlot(start);
      setSelectedAppointments(
        CalendarUtils.getFilteredAppointments(
          start,
          appointments,
          viewMode,
          clientFilter,
          typeFilter
        )
      );
    },
    [appointments, viewMode]
  );

  useEffect(() => {
    setSelectedAppointments(
      CalendarUtils.getFilteredAppointments(
        currentDate,
        appointments,
        viewMode,
        clientFilter,
        typeFilter
      )
    );
  }, [viewMode, currentDate, appointments, clientFilter, typeFilter]);

  useEffect(() => {
    if (viewMode === "month") {
      setSelectedSlot(currentDate);
    } else {
      setSelectedSlot(null);
    }
  }, [viewMode, currentDate]);

  return {
    currentDate,
    viewMode,
    selectedSlot,
    selectedAppointments,
    setCurrentDate,
    setViewMode,
    setSelectedSlot,
    handleSelectSlot,
    handleDelete,
    handleEdit,
    handleOpenEditModal,
    removeEditAppointment,
    isEditAppointmentModalOpen,
    setIsEditAppointmentModalOpen,
    editAppointmentData,
    setEditAppointmentData,
    deleteClientAppointmentMutation,
    editClientAppointmentMutation,
    setSelectedAppointments,
    clientFilter,
    setClientFilter,
    typeFilter,
    setTypeFilter,
  };
};
