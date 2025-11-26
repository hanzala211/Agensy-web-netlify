import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import React, { useEffect, useMemo, useState } from "react";
import {
  AppointmentsCalendarCard,
  CalendarHeader,
  createCalendarComponents,
  AppointmentDetailsModal,
} from "@agensy/components";
import { useAppointmentsContext, useClientContext } from "@agensy/context";
import { enUS } from "date-fns/locale";
import { useCalendarState } from "@agensy/hooks";
import { CalendarUtils } from "@agensy/utils";
import type { ViewMode, Appointment } from "@agensy/types";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    "en-US": enUS,
  },
});

export const AppointmentsCalendar: React.FC = () => {
  const { appointments, setIsAddAppointmentModalOpen } =
    useAppointmentsContext();
  const { selectedClientId } = useClientContext();

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    currentDate,
    viewMode,
    selectedAppointments,
    setCurrentDate,
    setViewMode,
    handleSelectSlot,
    clientFilter,
    setClientFilter,
    typeFilter,
    setTypeFilter,
  } = useCalendarState(appointments);

  const clientFilteredAppointments = useMemo(() => {
    if (!appointments) return [];
    if (selectedClientId) {
      return appointments.filter(
        (appointment) => appointment.client_id?.toString() === selectedClientId
      );
    }
    return appointments;
  }, [appointments, selectedClientId]);

  const filteredAppointments = useMemo(() => {
    if (clientFilter === "all" && typeFilter === "all") {
      return clientFilteredAppointments;
    }
    if (clientFilter === "all") {
      return clientFilteredAppointments.filter(
        (appointment) => appointment.appointment_type === typeFilter
      );
    }
    if (typeFilter === "all") {
      return clientFilteredAppointments.filter(
        (appointment) => appointment.client_id === clientFilter
      );
    }
    return clientFilteredAppointments.filter(
      (appointment) =>
        appointment.client_id === clientFilter &&
        appointment.appointment_type === typeFilter
    );
  }, [clientFilteredAppointments, clientFilter, typeFilter]);

  const events = useMemo(() => {
    return filteredAppointments.map((appointment) => ({
      id: appointment.id,
      title: appointment.title
        ? appointment.title.length > 15
          ? appointment.title.substring(0, 15) + "..."
          : appointment.title
        : "N/A",
      start: new Date(appointment.start_time),
      end: new Date(appointment.end_time),
      appointment: appointment,
    }));
  }, [filteredAppointments]);

  const components = useMemo(
    () =>
      createCalendarComponents(
        filteredAppointments,
        viewMode,
        (appointment) => {
          setSelectedAppointment(appointment);
          setIsAppointmentModalOpen(true);
        }
      ),
    [filteredAppointments, viewMode]
  );

  const handlePrevious = () => {
    setCurrentDate(CalendarUtils.getPreviousDate(currentDate, viewMode));
  };

  const handleNext = () => {
    setCurrentDate(CalendarUtils.getNextDate(currentDate, viewMode));
  };

  const handleEventClick = (event: { appointment: Appointment }) => {
    console.log("Calendar event clicked:", event);
    setSelectedAppointment(event.appointment);
    setIsAppointmentModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAppointmentModalOpen(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <div className="bg-white rounded-md border border-gray-200 md:p-4 p-3 shadow-sm overflow-hidden">
        <CalendarHeader
          currentDate={currentDate}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onPrevious={handlePrevious}
          onNext={handleNext}
          clientFilter={clientFilter}
          setClientFilter={setClientFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
        />
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{
            height: "70vh",
            minHeight: 400,
            width:
              viewMode === "week" && windowWidth <= 540 ? 310 : "100%",
          }}
          view={viewMode}
          onView={(newView) => setViewMode(newView as ViewMode)}
          date={currentDate}
          onNavigate={setCurrentDate}
          components={components}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          toolbar={false}
          selectable={true}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleEventClick}
          step={60}
          timeslots={1}
          min={new Date(0, 0, 0, 0, 0, 0)}
          max={new Date(0, 0, 0, 23, 59, 59)}
        />
      </div>
      <AppointmentsCalendarCard
        viewMode={viewMode}
        currentDate={currentDate}
        selectedAppointments={selectedAppointments}
        setIsAddAppointmentModalOpen={setIsAddAppointmentModalOpen}
      />

      <AppointmentDetailsModal
        isOpen={isAppointmentModalOpen}
        onClose={handleCloseModal}
        appointment={selectedAppointment}
      />
    </div>
  );
};

export default AppointmentsCalendar;
