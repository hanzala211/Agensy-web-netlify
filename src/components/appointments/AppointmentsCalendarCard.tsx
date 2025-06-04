import { AddAppointmentModal, AppointmentCard } from "@agensy/components";
import { EmptyStateCard } from "@agensy/components";
import { APP_ACTIONS, ICONS, PERMISSIONS } from "@agensy/constants";
import type { Appointment } from "@agensy/types";
import React from "react";
import { useCalendarState } from "@agensy/hooks";
import { CalendarUtils } from "@agensy/utils";
import { useAuthContext } from "@agensy/context";

interface AppointmentsCalendarCardProps {
  viewMode: "month" | "week" | "day";
  currentDate: Date;
  selectedAppointments: Appointment[];
  setIsAddAppointmentModalOpen: (isOpen: boolean) => void;
}

export const AppointmentsCalendarCard: React.FC<
  AppointmentsCalendarCardProps
> = ({
  viewMode,
  currentDate,
  selectedAppointments,
  setIsAddAppointmentModalOpen,
}) => {
  const {
    isEditAppointmentModalOpen,
    removeEditAppointment,
    setIsEditAppointmentModalOpen,
    editAppointmentData,
    editClientAppointmentMutation,
    handleEdit,
    handleOpenEditModal,
    handleDelete,
    deleteClientAppointmentMutation,
  } = useCalendarState(selectedAppointments);
  const { userData } = useAuthContext();
  const userPermissions =
    PERMISSIONS[userData?.role as keyof typeof PERMISSIONS] || [];

  return (
    <React.Fragment>
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">
          Appointments for {CalendarUtils.getHeaderDate(currentDate, viewMode)}
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
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onEdit={handleOpenEditModal}
                onDelete={handleDelete}
                isDeleting={deleteClientAppointmentMutation.isPending}
                showActions={userPermissions.includes(APP_ACTIONS.ClientAppointmentInfoEdit)}
              />
            ))
          )}
        </div>
      </div>
      <AddAppointmentModal
        isOpen={isEditAppointmentModalOpen}
        onClose={() => {
          removeEditAppointment();
          setIsEditAppointmentModalOpen(false);
        }}
        onSubmit={handleEdit}
        editData={editAppointmentData as Appointment}
        isLoading={editClientAppointmentMutation.isPending}
      />
    </React.Fragment>
  );
};
