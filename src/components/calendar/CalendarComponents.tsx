import React from "react";
import { isSameDay } from "date-fns";
import { AntdBadge } from "@agensy/components";
import type { Components } from "react-big-calendar";
import type { Appointment, ViewMode } from "@agensy/types";

interface WrapperProps {
  appointments: Appointment[];
  viewMode: ViewMode;
  onSelectSlot?: (date: Date) => void;
}

interface DateCellProps extends WrapperProps {
  value: Date;
  children: React.ReactElement;
}

interface TimeSlotProps extends WrapperProps {
  value: Date;
  children: React.ReactElement;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  appointment: Appointment;
}

const DateCellWrapper: React.FC<DateCellProps> = ({
  value,
  children,
  appointments,
  viewMode,
  onSelectSlot,
}) => {
  const dayAppointments = appointments.filter((appointment: Appointment) =>
    isSameDay(new Date(appointment.start_time), value)
  );

  const handleCellClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelectSlot) {
      onSelectSlot(value);
    }
  };

  return (
    <div 
      className={`${viewMode === "day" ? "" : "rbc-day-bg"} relative cursor-pointer touch-manipulation`}
      onClick={handleCellClick}
      onTouchEnd={handleCellClick}
      role="button"
      tabIndex={0}
    >
      {children}
      <div
        className={`custom-badge-container absolute top-0 left-0 ${
          viewMode === "month" ? "md:flex flex-col md:gap-2 grid grid-cols-2 gap-0" : "hidden"
        }`}
      >
        {dayAppointments.map((appointment: Appointment) => (
          <AntdBadge
            key={appointment.id}
            status={
              appointment.active
                ? new Date().toISOString() <= appointment.start_time
                  ? "success"
                  : new Date().toISOString() <= appointment.end_time
                  ? "processing"
                  : "default"
                : "error"
            }
            text={
              viewMode === "month" && window.innerWidth > 1024
                ? appointment.title
                : ""
            }
            size="small"
          />
        ))}
      </div>
    </div>
  );
};

const TimeSlotWrapper: React.FC<TimeSlotProps> = ({
  value,
  children,
  appointments,
  onSelectSlot,
}) => {
  const timeSlotAppointments = appointments.filter(
    (appointment: Appointment) => {
      const appointmentStart = new Date(appointment.start_time);
      const slotTime = value;

      return (
        isSameDay(appointmentStart, slotTime) &&
        appointmentStart.getHours() === slotTime.getHours() &&
        slotTime.getMinutes() === 0
      );
    }
  );

  const handleTimeSlotClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelectSlot) {
      onSelectSlot(value);
    }
  };

  return (
    <div 
      className="rbc-time-slot cursor-pointer touch-manipulation"
      onClick={handleTimeSlotClick}
      onTouchEnd={handleTimeSlotClick}
      role="button"
      tabIndex={0}
    >
      {children}
      <div className="custom-badge-container">
        {timeSlotAppointments.map((appointment: Appointment) => (
          <AntdBadge  
            key={appointment.id}
            status={
              appointment.active
                ? new Date().toISOString() <= appointment.start_time
                  ? "success"
                  : new Date().toISOString() <= appointment.end_time
                  ? "processing"
                  : "default"
                : "error"
            }
            size="small"
            text={appointment.title}
          />
        ))}
      </div>
    </div>
  );
};

export const createCalendarComponents = (
  appointments: Appointment[],
  viewMode: ViewMode,
  onSelectSlot?: (date: Date) => void
): Components<CalendarEvent> => ({
  event: () => null,
  dateCellWrapper: (props) => (
    <DateCellWrapper
      {...(props as unknown as DateCellProps)}
      appointments={appointments}
      viewMode={viewMode}
      onSelectSlot={onSelectSlot}
    />
  ),
  timeSlotWrapper: (props) => (
    <TimeSlotWrapper
      {...(props as TimeSlotProps)}
      appointments={appointments}
      viewMode={viewMode}
      onSelectSlot={onSelectSlot}
    />
  ),
  toolbar: () => null,
});
