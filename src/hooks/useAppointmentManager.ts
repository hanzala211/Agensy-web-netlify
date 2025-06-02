import { useState, useMemo } from "react";
import type { Appointment } from "@agensy/types";
import dayjs from "dayjs";

interface UseAppointmentManagerProps {
  appointments?: Appointment[];
  initialItemsPerPage?: number;
}

export const useAppointmentManager = ({
  appointments = [],
  initialItemsPerPage = 5,
}: UseAppointmentManagerProps = {}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterBy, setFilterBy] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(initialItemsPerPage);
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchesSearch = (
        appointment.title.toLowerCase() +
        " " +
        appointment.appointment_type.toLowerCase() +
        " " +
        (appointment.location || "").toLowerCase()
      ).includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "active" && appointment.active) ||
        (filterBy === "inactive" && !appointment.active) ||
        appointment.appointment_type.toLowerCase() === filterBy.toLowerCase();

      const matchesClientFilter =
        clientFilter === "all" || appointment.client_id === clientFilter;

      const matchesFromtoTo =
        from === "" ||
        to === "" ||
        (dayjs(appointment.start_time).isAfter(dayjs(from)) &&
          dayjs(appointment.start_time).isBefore(dayjs(to)));

      return (
        matchesSearch && matchesFilter && matchesClientFilter && matchesFromtoTo
      );
    });
  }, [appointments, searchTerm, filterBy, clientFilter, from, to]);

  const sortedAppointments = useMemo(() => {
    return [...filteredAppointments].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(String(b.createdAt)).getTime() -
            new Date(String(a.createdAt)).getTime()
          );
        case "oldest":
          return (
            new Date(String(a.createdAt)).getTime() -
            new Date(String(b.createdAt)).getTime()
          );
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "type":
          return a.appointment_type.localeCompare(b.appointment_type);
        default:
          return 0;
      }
    });
  }, [filteredAppointments, sortBy]);

  const totalPages = useMemo(() => {
    return Math.ceil(sortedAppointments.length / itemsPerPage);
  }, [sortedAppointments, itemsPerPage]);

  const paginatedAppointments = useMemo(() => {
    return sortedAppointments.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [sortedAppointments, currentPage, itemsPerPage]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDeleteMoveToLastPage = (appointmentId: string) => {
    const remainingAppointments = sortedAppointments.filter(
      (appointment) => appointment.id !== appointmentId
    );
    const newTotalPages = Math.ceil(
      remainingAppointments.length / itemsPerPage
    );

    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    filterBy,
    setFilterBy,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedAppointments,
    handlePrevPage,
    handleNextPage,
    handleDeleteMoveToLastPage,
    clientFilter,
    setClientFilter,
    from,
    setFrom,
    to,
    setTo,
  };
};
