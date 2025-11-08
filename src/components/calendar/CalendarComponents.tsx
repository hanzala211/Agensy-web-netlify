import React from "react";
import { isSameDay } from "date-fns";
import { AntdBadge } from "@agensy/components";
import type { Components } from "react-big-calendar";
import type { Appointment, ViewMode } from "@agensy/types";

interface WrapperProps {
  appointments: Appointment[];
  viewMode: ViewMode;
  onAppointmentClick?: (appointment: Appointment) => void;
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
  onAppointmentClick,
}) => {
  const dayAppointments = appointments.filter((appointment: Appointment) =>
    isSameDay(new Date(appointment.start_time), value)
  );

  const handleCellClick = (e: React.MouseEvent | React.TouchEvent) => {
    const target = e.target as HTMLElement;
    const isBadgeClick =
      target.closest(".custom-badge-container") ||
      target.closest(".ant-badge") ||
      target.closest('[class*="cursor-pointer"]');

    if (!isBadgeClick) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleAppointmentClick = (
    appointment: Appointment,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Appointment clicked:", appointment);
    onAppointmentClick?.(appointment);
  };

  return (
    <div
      className={`${viewMode === "day" ? "" : "rbc-day-bg"} cursor-default`}
      onClick={handleCellClick}
      onTouchEnd={handleCellClick}
      role="button"
      tabIndex={0}
    >
      {children}
      <div
        className={`custom-badge-container relative z-10 ${
          viewMode === "month" ? "flex flex-col md:gap-2" : "hidden"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {dayAppointments.map((appointment: Appointment, index: number) => (
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
                  ? appointment.title.length > 15
                    ? appointment.title.substring(0, 15) + "..."
                    : appointment.title
                  : "N/A"
                : ""
            }
            size="small"
            className={`!cursor-pointer ${index === 0 ? "mt-2" : ""}`}
            onClick={(e: React.MouseEvent) =>
              handleAppointmentClick(appointment, e)
            }
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
  onAppointmentClick,
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

  const handleAppointmentClick = (
    appointment: Appointment,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Appointment clicked:", appointment);
    onAppointmentClick?.(appointment);
  };

  return (
    <div className="rbc-time-slot cursor-default" role="button" tabIndex={0}>
      {children}
      <div className="custom-badge-container relative z-10">
        {timeSlotAppointments.map((appointment: Appointment, index: number) => (
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
            className={`!cursor-pointer ${index === 0 ? "mt-1" : ""}`}
            text={
              appointment.title
                ? appointment.title.length > 15
                  ? appointment.title.substring(0, 15) + "..."
                  : appointment.title
                : "N/A"
            }
            onClick={(e: React.MouseEvent) =>
              handleAppointmentClick(appointment, e)
            }
          />
        ))}
      </div>
    </div>
  );
};

export const createCalendarComponents = (
  appointments: Appointment[],
  viewMode: ViewMode,
  onAppointmentClick?: (appointment: Appointment) => void
): Components<CalendarEvent> => ({
  event: () => null,
  dateCellWrapper: (props) => (
    <DateCellWrapper
      {...(props as unknown as DateCellProps)}
      appointments={appointments}
      viewMode={viewMode}
      onAppointmentClick={onAppointmentClick}
    />
  ),
  timeSlotWrapper: (props) => (
    <TimeSlotWrapper
      {...(props as TimeSlotProps)}
      appointments={appointments}
      onAppointmentClick={onAppointmentClick}
      viewMode={viewMode}
    />
  ),
  toolbar: () => null,
});
