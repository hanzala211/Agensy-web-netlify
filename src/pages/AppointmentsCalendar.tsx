import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import React, { useMemo } from "react";
import {
  AppointmentsCalendarCard,
  CalendarHeader,
  createCalendarComponents,
} from "@agensy/components";
import { useAppointmentsContext } from "@agensy/context";
import { enUS } from "date-fns/locale";
import { useCalendarState } from "@agensy/hooks";
import { CalendarUtils } from "@agensy/utils";
import type { ViewMode } from "@agensy/types";

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

  const {
    currentDate,
    viewMode,
    selectedAppointments,
    setCurrentDate,
    setViewMode,
    handleSelectSlot,
  } = useCalendarState(appointments);

  const events = useMemo(() => {
    return appointments.map((appointment) => ({
      id: appointment.id,
      title: appointment.title,
      start: new Date(appointment.start_time),
      end: new Date(appointment.end_time),
      appointment: appointment,
    }));
  }, [appointments]);

  const components = useMemo(
    () => createCalendarComponents(appointments, viewMode),
    [appointments, viewMode, handleSelectSlot]
  );

  const handlePrevious = () => {
    setCurrentDate(CalendarUtils.getPreviousDate(currentDate, viewMode));
  };

  const handleNext = () => {
    setCurrentDate(CalendarUtils.getNextDate(currentDate, viewMode));
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
    </div>
  );
};

export default AppointmentsCalendar;
