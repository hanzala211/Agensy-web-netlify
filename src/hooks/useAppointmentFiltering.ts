import { startOfWeek, endOfWeek, isSameDay } from "date-fns";
import dayjs from "dayjs";
import type { Appointment, ViewMode } from "@agensy/types";

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
        const appointmentStart = new Date(appointment.start_time);
        return (
          isSameDay(appointmentStart, value) &&
          appointmentStart.getHours() === value.getHours()
        );
      }
      default:
        return false;
    }
  });
};
