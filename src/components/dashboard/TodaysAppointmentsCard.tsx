import React, { useEffect, useState } from "react";
import {
  Card,
  EmptyStateCard,
  AddAppointmentModal,
  AppointmentDetailsModal,
  BorderedCard,
  AntdBadge,
} from "@agensy/components";
import { ICONS, DASHBOARD_TODAYS_APPOINTMENTS } from "@agensy/constants";
import type { AppointmentFormData } from "@agensy/types";
import { DateUtils } from "@agensy/utils";
import type { Appointment } from "@agensy/types";
import { useAddClientAppointmentMutation } from "@agensy/api";
import { useAppointmentsContext } from "@agensy/context";
import { toast } from "@agensy/utils";

export const TodaysAppointmentsCard: React.FC = () => {
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] =
    useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const addClientAppointmentMutation = useAddClientAppointmentMutation();
  const { addAppointment } = useAppointmentsContext();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaysAppointments = DASHBOARD_TODAYS_APPOINTMENTS.filter((appt) => {
    const apptDate = new Date(appt.start_time);
    apptDate.setHours(0, 0, 0, 0);
    return apptDate.getTime() === today.getTime();
  });

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
      if (addClientAppointmentMutation.data) {
        addAppointment(addClientAppointmentMutation.data);
      }
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
                              : new Date().toISOString() <= appointment.end_time
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
