import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import React, { useMemo, useState } from "react";
import {
  AppointmentsCalendarCard,
  CalendarHeader,
  createCalendarComponents,
  AppointmentDetailsModal,
} from "@agensy/components";
import { useAppointmentsContext } from "@agensy/context";
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

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

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

  const filteredAppointments = useMemo(() => {
    if (clientFilter === "all" && typeFilter === "all") {
      return appointments;
    }
    if (clientFilter === "all") {
      return appointments.filter(
        (appointment) => appointment.appointment_type === typeFilter
      );
    }
    if (typeFilter === "all") {
      return appointments.filter(
        (appointment) => appointment.client_id === clientFilter
      );
    }
    return appointments.filter(
      (appointment) =>
        appointment.client_id === clientFilter &&
        appointment.appointment_type === typeFilter
    );
  }, [appointments, clientFilter, typeFilter]);

  const events = useMemo(() => {
    return filteredAppointments.map((appointment) => ({
      id: appointment.id,
      title: appointment.title,
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
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-xl p-5 shadow-sm">
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
          style={{ height: window.innerWidth > 768 ? 800 : 400 }}
          view={viewMode}
          onView={(newView) => setViewMode(newView as ViewMode)}
          date={currentDate}
          onNavigate={setCurrentDate}
          components={components}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          toolbar={false}
          selectable={true} // it is used to enable selection
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleEventClick}
          step={60}
          timeslots={1}
          min={new Date(0, 0, 0, 0, 0, 0)} // it is used to show starting of time in day view
          max={new Date(0, 0, 0, 23, 59, 59)} // it is used to show ending of time in day view
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
