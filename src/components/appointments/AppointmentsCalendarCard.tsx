import { AntdBadge } from "@agensy/components";
import { EmptyStateCard } from "@agensy/components";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { ICONS } from "@agensy/constants";
import { DateUtils } from "@agensy/utils";
import type { Client } from "@agensy/types";
import type { Appointment } from "@agensy/types";
import type { HealthcareProvider } from "@agensy/types";

interface AppointmentsCalendarCardProps {
  viewMode: "month" | "week" | "day";
  currentDate: Date;
  provider: HealthcareProvider;
  client: Client;
  selectedAppointments: Appointment[];
  setIsAddAppointmentModalOpen: (isOpen: boolean) => void;
}

export const AppointmentsCalendarCard: React.FC<
  AppointmentsCalendarCardProps
> = ({
  viewMode,
  currentDate,
  provider,
  client,
  selectedAppointments,
  setIsAddAppointmentModalOpen,
}) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">
        Appointments for{" "}
        {viewMode === "week"
          ? `Week of ${format(startOfWeek(currentDate), "MMMM d")} - ${format(
              endOfWeek(currentDate),
              "MMMM d, yyyy"
            )}`
          : viewMode === "month"
          ? format(currentDate, "MMMM d, yyyy")
          : format(currentDate, "MMMM d, yyyy, hh:mm a")}
      </h3>
      <div className="grid gap-4">
        {selectedAppointments.length === 0 ? (
          <EmptyStateCard
            ICON={ICONS.plus}
            label="Appointments"
            showText={true}
            onClick={() => setIsAddAppointmentModalOpen(true)}
          />
        ) : (
          selectedAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <AntdBadge
                  status={
                    appointment.active
                      ? new Date().toISOString() <= appointment.start_time
                        ? "success"
                        : new Date().toISOString() <= appointment.end_time
                        ? "processing"
                        : "default"
                      : "error"
                  }
                  size="large"
                />
                <div>
                  <h4 className="font-medium">{appointment.title}</h4>
                  <p className="text-sm text-gray-500">
                    Provider: {provider?.provider_name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Client: {`${client?.first_name} ${client?.last_name}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {DateUtils.formatDateTime(appointment.start_time)} -{" "}
                    {DateUtils.formatDateTime(appointment.end_time)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
