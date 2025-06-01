import { useCancelAppointmentMutation } from "@agensy/api";
import {
  ActionButtons,
  AntdBadge,
  AntdTag,
  BorderedCard,
} from "@agensy/components";
import { APPOINTMENT_TYPES, ICONS } from "@agensy/constants";
import { useAppointmentsContext, useAuthContext } from "@agensy/context";
import type { Appointment } from "@agensy/types";
import { DateUtils, toast } from "@agensy/utils";
import { Modal } from "antd";
import React, { useEffect, useState } from "react";

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointment: Appointment) => void;
  isDeleting?: boolean;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onEdit,
  onDelete,
  isDeleting = false,
}) => {
  const cancelClientAppointmentMutation = useCancelAppointmentMutation();
  const { filterHealthCareProvider, filterClient } = useAuthContext();
  const { cancelAppointment } = useAppointmentsContext();
  const appointmentType = APPOINTMENT_TYPES.find(
    (type) => type.value === appointment.appointment_type
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleCancelAppointment = () => {
    setIsModalOpen(false);
    cancelClientAppointmentMutation.mutate({
      clientId: appointment.client_id,
      appointmentId: appointment.id,
      data: {
        active: false,
      },
    });
  };

  useEffect(() => {
    if (cancelClientAppointmentMutation.status === "success") {
      toast.success("Appointment cancelled successfully");
      cancelAppointment(appointment.id);
    } else if (cancelClientAppointmentMutation.status === "error") {
      toast.error("Failed to cancel appointment");
    }
  }, [cancelClientAppointmentMutation.status]);

  return (
    <BorderedCard>
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <ICONS.calendar className="text-blue-500" />
              <h3 className="font-semibold text-lg">
                {appointment.title}{" "}
                <span className="text-sm">
                  (
                  {
                    filterHealthCareProvider(
                      appointment.client_id,
                      appointment.healthcare_provider_id
                    )?.provider_name
                  }
                  )
                </span>
              </h3>
            </div>
            <AntdBadge
              size="large"
              status={
                appointment.active
                  ? new Date().toISOString() <= appointment.start_time
                    ? "success"
                    : new Date().toISOString() <= appointment.end_time
                    ? "processing"
                    : "default"
                  : "error"
              }
              text={appointmentType?.label}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex flex-col gap-2 text-gray-600">
              <div className="flex items-center gap-2 text-gray-600">
                <ICONS.clockCircle className="text-gray-400" size={14} />
                <span>{DateUtils.formatDateTime(appointment.start_time)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <ICONS.clockCircle className="text-gray-400" size={14} />
                <span>{DateUtils.formatDateTime(appointment.end_time)}</span>
              </div>
              {appointment.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <ICONS.home className="text-gray-400" size={14} />
                  <span>{appointment.location}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 text-gray-600">
              <div className="flex items-center gap-2 text-gray-600">
                <ICONS.user className="text-gray-400" size={14} />
                <span>
                  Client: {filterClient(appointment.client_id)?.first_name}{" "}
                  {filterClient(appointment.client_id)?.last_name}
                </span>
              </div>
              {appointment.createdBy && (
                <div className="flex items-center gap-2 text-gray-600">
                  <ICONS.user className="text-gray-400" size={14} />
                  <span>
                    Created by: {appointment.createdBy.first_name}{" "}
                    {appointment.createdBy.last_name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {appointment.notes && (
            <div className="flex items-center text-sm gap-2 text-gray-600">
              <span>Notes: {appointment.notes}</span>
            </div>
          )}

          {appointment.post_appointment_notes && (
            <div className="flex items-center text-sm gap-2 text-gray-600">
              <span>
                Post Appointment Notes: {appointment.post_appointment_notes}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 md:items-center items-start">
          <div className="flex gap-2 items-start">
            <AntdTag
              color={
                appointment.active
                  ? new Date().toISOString() <= appointment.start_time
                    ? "success"
                    : new Date().toISOString() <= appointment.end_time
                    ? "processing"
                    : "default"
                  : "error"
              }
            >
              {appointment.active
                ? new Date().toISOString() <= appointment.start_time
                  ? "Upcoming"
                  : new Date().toISOString() <= appointment.end_time
                  ? "Live"
                  : "Completed"
                : "Cancelled"}
            </AntdTag>
            {/* @ts-expect-error // Antd Modal props are not typed */}
            <Modal
              title="Cancel Appointment"
              centered
              open={isModalOpen}
              onOk={() => handleCancelAppointment()}
              onCancel={() => setIsModalOpen(false)}
              okText="Yes"
              cancelText="No"
            >
              <p>Are you sure you want to cancel this appointment?</p>
            </Modal>
          </div>
          <div className="flex gap-2 items-start">
            <ActionButtons
              editLabel="Edit Appointment"
              deleteLabel="Delete Appointment"
              onDelete={() => onDelete?.(appointment)}
              onEdit={() => onEdit?.(appointment)}
              isDeleting={isDeleting}
            />
            {appointment.active &&
              new Date(appointment.end_time) > new Date() && (
                <button
                  className={`text-sm ${
                    cancelClientAppointmentMutation.isPending
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-100 cursor-pointer"
                  } font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 py-1 px-2 rounded-md transition-colors duration-200 text-basicRed hover:text-darkRed focus:ring-basicRed`}
                  onClick={() => setIsModalOpen(true)}
                  disabled={cancelClientAppointmentMutation.isPending}
                  aria-label="Cancel Appointment"
                >
                  {cancelClientAppointmentMutation.isPending
                    ? "Cancelling..."
                    : "Cancel"}
                </button>
              )}
          </div>
        </div>
      </div>
    </BorderedCard>
  );
};
