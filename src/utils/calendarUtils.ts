import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  isSameDay,
} from "date-fns";
import type { Appointment, ViewMode } from "@agensy/types";
import dayjs from "dayjs";

export const getNextDate = (currentDate: Date, viewMode: ViewMode): Date => {
  switch (viewMode) {
    case "month":
      return addMonths(currentDate, 1);
    case "week":
      return addWeeks(currentDate, 1);
    case "day":
      return addDays(currentDate, 1);
  }
};

export const getPreviousDate = (
  currentDate: Date,
  viewMode: ViewMode
): Date => {
  switch (viewMode) {
    case "month":
      return subMonths(currentDate, 1);
    case "week":
      return subWeeks(currentDate, 1);
    case "day":
      return subDays(currentDate, 1);
  }
};

export const getHeaderDate = (
  currentDate: Date,
  viewMode: ViewMode
): string => {
  switch (viewMode) {
    case "month":
      return format(currentDate, "MMMM d, yyyy");
    case "week":
      return `${format(startOfWeek(currentDate), "MMMM d")} - ${format(
        endOfWeek(currentDate),
        "MMMM d, yyyy"
      )}`;
    case "day":
      return format(currentDate, "MMMM d, yyyy, hh:mm a");
    default:
      return format(currentDate, "MMMM d, yyyy");
  }
};

export const getFilteredAppointments = (
  value: Date,
  appointments: Appointment[],
  viewMode: ViewMode
): Appointment[] => {
  return appointments.filter((appointment) => {
    const appointmentDate = dayjs(appointment.start_time);
    const weekStartTime = startOfWeek(value);
    const weekEndTime = endOfWeek(value);
    const appointmentStartDate = new Date(appointment.start_time);
    const valueDate = new Date(value);

    switch (viewMode) {
      case "month":
        return (
          appointmentStartDate.getFullYear() === valueDate.getFullYear() &&
          appointmentStartDate.getMonth() === valueDate.getMonth() &&
          appointmentStartDate.getDate() === valueDate.getDate()
        );
      case "week":
        return (
          appointmentDate.isAfter(weekStartTime) &&
          appointmentDate.isBefore(weekEndTime)
        );
      case "day": {
        return (
          isSameDay(appointmentStartDate, value) &&
          appointmentStartDate.getHours() === value.getHours()
        );
      }
      default:
        return false;
    }
  });
};
