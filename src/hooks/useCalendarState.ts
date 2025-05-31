import { useState, useCallback, useEffect } from "react";
import type { Appointment, ViewMode } from "@agensy/types";
import { CalendarUtils } from "@agensy/utils";

interface CalendarState {
  currentDate: Date;
  viewMode: ViewMode;
  selectedSlot: Date | null;
  selectedAppointments: Appointment[];
  setCurrentDate: (date: Date) => void;
  setViewMode: (mode: ViewMode) => void;
  setSelectedSlot: (date: Date | null) => void;
  handleSelectSlot: (slotInfo: {
    start: Date;
    end: Date;
    action: string;
  }) => void;
}

export const useCalendarState = (
  appointments: Appointment[]
): CalendarState => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [selectedAppointments, setSelectedAppointments] = useState<
    Appointment[]
  >([]);

  const handleSelectSlot = useCallback(
    (slotInfo: { start: Date; end: Date; action: string }) => {
      const { start } = slotInfo;
      setCurrentDate(start);
      setSelectedSlot(start);
      setSelectedAppointments(
        CalendarUtils.getFilteredAppointments(start, appointments, viewMode)
      );
    },
    [appointments, viewMode]
  );

  useEffect(() => {
    setSelectedAppointments(
      CalendarUtils.getFilteredAppointments(currentDate, appointments, viewMode)
    );
  }, [viewMode, currentDate, appointments]);

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
  };
};
