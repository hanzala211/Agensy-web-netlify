import React from "react";
import { Modal } from "@agensy/components";
import { AntdBadge, AntdTag } from "@agensy/components";
import { APPOINTMENT_TYPES, ICONS } from "@agensy/constants";
import { useAuthContext } from "@agensy/context";
import type { Appointment } from "@agensy/types";
import { DateUtils } from "@agensy/utils";

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

export const AppointmentDetailsModal: React.FC<
  AppointmentDetailsModalProps
> = ({ isOpen, onClose, appointment }) => {
  const { filterHealthCareProvider, filterClient } = useAuthContext();

  if (!appointment) return null;

  const appointmentType = APPOINTMENT_TYPES.find(
    (type) => type.value === appointment.appointment_type
  );

  const truncateName = (
    name: string | undefined,
    maxLength: number = 15
  ): string => {
    if (!name) return "";
    return name.length > maxLength
      ? name.substring(0, maxLength) + "..."
      : name;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Appointment Details"
      maxWidth="max-w-4xl"
      height="h-[90%] xl:h-auto"
    >
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <ICONS.calendar className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {appointment.title ? appointment.title : "N/A"}
              </h2>
              <p className="text-gray-600 mt-1">
                {filterHealthCareProvider(
                  appointment?.client_id,
                  appointment?.healthcare_provider_id
                )
                  ? truncateName(
                      filterHealthCareProvider(
                        appointment?.client_id,
                        appointment?.healthcare_provider_id
                      )?.provider_name
                    )
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
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
              text={appointmentType?.label ? appointmentType?.label : "N/A"}
            />
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
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Time & Location */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Schedule & Location
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <ICONS.clockCircle className="text-gray-600" size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Start Time</p>
                  <p className="font-medium text-gray-900">
                    {appointment?.start_time
                      ? DateUtils.formatDateTime(appointment?.start_time)
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <ICONS.clockCircle className="text-gray-600" size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Time</p>
                  <p className="font-medium text-gray-900">
                    {appointment?.end_time
                      ? DateUtils.formatDateTime(appointment?.end_time)
                      : "N/A"}
                  </p>
                </div>
              </div>
              {appointment.location && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <ICONS.home className="text-gray-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">
                      {appointment.location}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* People */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              People
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <ICONS.user className="text-gray-600" size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Care Recipient</p>
                  <p className="font-medium text-gray-900">
                    {truncateName(
                      filterClient(appointment.client_id)?.first_name
                    )}{" "}
                    {truncateName(
                      filterClient(appointment.client_id)?.last_name
                    )}
                  </p>
                </div>
              </div>
              {appointment.createdBy && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <ICONS.user className="text-gray-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created by</p>
                    <p className="font-medium text-gray-900">
                      {truncateName(appointment.createdBy.first_name)}{" "}
                      {truncateName(appointment.createdBy.last_name)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {(appointment.notes || appointment.post_appointment_notes) && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Notes
            </h3>
            <div className="space-y-4">
              {appointment.notes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <ICONS.uploadDoc className="text-gray-500 mt-1" size={18} />
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Appointment Notes
                      </p>
                      <p className="text-gray-600">{appointment.notes}</p>
                    </div>
                  </div>
                </div>
              )}
              {appointment.post_appointment_notes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <ICONS.uploadDoc className="text-gray-500 mt-1" size={18} />
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Post Appointment Notes
                      </p>
                      <p className="text-gray-600">
                        {appointment.post_appointment_notes}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Created on{" "}
            {DateUtils.formatDateTime(
              appointment.createdAt as unknown as string
            )}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default AppointmentDetailsModal;
