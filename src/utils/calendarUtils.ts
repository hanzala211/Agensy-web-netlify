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
      return format(currentDate, "MMMM, yyyy");
    case "week":
      return `${format(startOfWeek(currentDate), "MMMM d")} - ${format(
        endOfWeek(currentDate),
        "MMMM d, yyyy"
      )}`;
    case "day":
      return format(currentDate, "MMMM d, yyyy");
    default:
      return format(currentDate, "MMMM d, yyyy");
  }
};

export const getFilteredAppointments = (
  value: Date,
  appointments: Appointment[],
  viewMode: ViewMode,
  clientFilter: string,
  typeFilter: string
): Appointment[] => {
  return appointments.filter((appointment) => {
    const appointmentDate = dayjs(appointment.start_time);
    const weekStartTime = startOfWeek(value);
    const weekEndTime = endOfWeek(value);
    const appointmentStartDate = new Date(appointment.start_time);
    const valueDate = new Date(value);

    const matchesClient =
      clientFilter === "all" || appointment.client_id === clientFilter;

    const matchesType =
      typeFilter === "all" || appointment.appointment_type === typeFilter;

    let matchesDate = false;
    switch (viewMode) {
      case "month":
        matchesDate =
          appointmentStartDate.getFullYear() === valueDate.getFullYear() &&
          appointmentStartDate.getMonth() === valueDate.getMonth();
        break;
      case "week":
        matchesDate =
          appointmentDate.isAfter(weekStartTime) &&
          appointmentDate.isBefore(weekEndTime);
        break;
      case "day":
        matchesDate = isSameDay(appointmentStartDate, value);
        break;
      default:
        matchesDate = false;
    }

    return matchesClient && matchesType && matchesDate;
  });
};
