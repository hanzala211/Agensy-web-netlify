import React, { useEffect, useState } from "react";
import {
  Card,
  EmptyStateCard,
  AddAppointmentModal,
  AppointmentDetailsModal,
  BorderedCard,
  AntdBadge,
} from "@agensy/components";
import { ICONS } from "@agensy/constants";
import type { AppointmentFormData, IUser } from "@agensy/types";
import { DateUtils } from "@agensy/utils";
import type { Appointment } from "@agensy/types";
import { useAddClientAppointmentMutation } from "@agensy/api";
import { useAppointmentsContext } from "@agensy/context";
import { toast } from "@agensy/utils";
import { useQueryClient } from "@tanstack/react-query";

interface TodaysAppointmentsCardProps {
  appointments?: Array<{
    id: string;
    title: string | null;
    appointment_type: string | null;
    location: string | null;
    start_time: string;
    end_time: string | null;
    created_by: string;
    client?: {
      id: string;
      first_name: string;
      last_name: string;
      date_of_birth?: string | null;
    } | null;
    healthCareProvider?: {
      id: string;
      provider_name: string;
      provider_type: string | null;
      specialty: string | null;
    } | null;
  }>;
}

export const TodaysAppointmentsCard: React.FC<TodaysAppointmentsCardProps> = ({
  appointments = [],
}) => {
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] =
    useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const addClientAppointmentMutation = useAddClientAppointmentMutation();
  const { addAppointment } = useAppointmentsContext();
  const queryClient = useQueryClient();

  // Map API appointments to match Appointment type structure
  const todaysAppointments = appointments.map((appt) => ({
    id: appt.id,
    title: appt.title || "",
    appointment_type: appt.appointment_type || "",
    location: appt.location || "",
    start_time: appt.start_time,
    end_time: appt.end_time || "",
    all_day: false,
    notes: "",
    reminder_sent: false,
    active: true, // Default to true since API doesn't provide this field
    created_by: appt.created_by,
    client_id: appt.client?.id || "",
    healthcare_provider_id: appt.healthCareProvider?.id || "",
    provider_id: appt.healthCareProvider?.id || "",
    createdBy: {} as IUser,
  })) as Appointment[];

  const handleAddAppointment = () => {
    setIsAddAppointmentModalOpen(true);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  const handleSubmit = (data: AppointmentFormData) => {
    const postData = {
      title: data.title ? data.title : null,
      appointment_type: data.appointment_type ? data.appointment_type : null,
      start_time: data.start_time
        ? DateUtils.changetoISO(data.start_time)
        : null,
      end_time: data.end_time ? DateUtils.changetoISO(data.end_time) : null,
      notes: data.notes ? data.notes : null,
      location: data.location ? data.location : null,
      healthcare_provider_id: data.healthcare_provider_id
        ? data.healthcare_provider_id
        : null,
      post_appointment_notes: data.post_appointment_notes
        ? data.post_appointment_notes
        : null,
    };
    addClientAppointmentMutation.mutate({
      items: postData,
      clientId: data.clientId as string,
    });
  };

  useEffect(() => {
    if (addClientAppointmentMutation.status === "success") {
      addAppointment(addClientAppointmentMutation.data);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Appointment added successfully");
      setIsAddAppointmentModalOpen(false);
    } else if (addClientAppointmentMutation.status === "error") {
      toast.error("Failed to add appointment");
    }
  }, [addClientAppointmentMutation.status]);

  return (
    <>
      <Card
        title="Today's Appointments"
        buttonText={<ICONS.plus size={18} />}
        ariaLabel="Add appointment"
        onButtonClick={handleAddAppointment}
        className="border-gray-300"
      >
        {todaysAppointments.length > 0 ? (
          <div className="space-y-1.5">
            {todaysAppointments.map((appointment) => (
              <BorderedCard key={appointment.id} className="!p-2">
                <div
                  className="cursor-pointer "
                  onClick={() => handleAppointmentClick(appointment)}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-lg text-gray-800 truncate min-w-0 flex-1">
                        {appointment.title || "Untitled Appointment"}
                      </h3>
                      <AntdBadge
                        size="small"
                        status={
                          appointment.active
                            ? new Date().toISOString() <= appointment.start_time
                              ? "success"
                              : appointment.end_time &&
                                new Date().toISOString() <= appointment.end_time
                              ? "processing"
                              : "default"
                            : "error"
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <ICONS.clockCircle
                          className="text-gray-400"
                          size={14}
                        />
                        <span>
                          {DateUtils.formatToTime(appointment.start_time)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ICONS.home className="text-gray-400" size={14} />
                        <span className="truncate">
                          {appointment.location || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ICONS.user className="text-gray-400" size={14} />
                        <span>
                          {appointment.appointment_type
                            ? appointment.appointment_type
                                .split("_")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ")
                            : "Appointment"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </BorderedCard>
            ))}
          </div>
        ) : (
          <EmptyStateCard
            label="appointments"
            ICON={ICONS.calendar}
            onClick={handleAddAppointment}
          />
        )}
      </Card>
      <AddAppointmentModal
        isOpen={isAddAppointmentModalOpen}
        onClose={() => setIsAddAppointmentModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={addClientAppointmentMutation.isPending}
      />
      <AppointmentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment}
      />
    </>
  );
};

export default TodaysAppointmentsCard;
