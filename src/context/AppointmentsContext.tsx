import type { Appointment, AppointmentsContextType } from "@agensy/types";
import { createContext, useContext, useState } from "react";
import { useAuthContext } from "./AuthContext";

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(
  undefined
);

export const AppointmentsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { userData } = useAuthContext();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] =
    useState<boolean>(false);

  const addAppointment = (appointment: Appointment) => {
    setAppointments([
      ...appointments,
      {
        ...appointment,
        createdBy: {
          first_name: userData?.first_name as string,
          last_name: userData?.last_name as string,
          email: userData?.email as string,
          cognito_id: userData?.cognito_id as string,
          active: userData?.active as boolean,
          email_verified: userData?.email_verified as boolean,
          last_login: userData?.last_login as Date,
          id: userData?.id as string,
        },
      },
    ]);
  };

  const deleteAppointment = (appointmentId: string) => {
    setAppointments(
      appointments.filter((appointment) => appointment.id !== appointmentId)
    );
  };

  const editAppointment = (appointment: Appointment) => {
    setAppointments(
      appointments.map((app) =>
        app.id === appointment.id
          ? {
              ...appointment,
              createdBy: {
                first_name: userData?.first_name as string,
                last_name: userData?.last_name as string,
                email: userData?.email as string,
                cognito_id: userData?.cognito_id as string,
                active: userData?.active as boolean,
                email_verified: userData?.email_verified as boolean,
                last_login: userData?.last_login as Date,
                id: userData?.id as string,
              },
            }
          : app
      )
    );
  };

  const cancelAppointment = (appointmentId: string) => {
    setAppointments(
      appointments.map((app) =>
        app.id === appointmentId ? { ...app, active: false } : app
      )
    );
  };

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        setAppointments,
        addAppointment,
        isAddAppointmentModalOpen,
        deleteAppointment,
        setIsAddAppointmentModalOpen,
        editAppointment,
        cancelAppointment,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
};

export const useAppointmentsContext = (): AppointmentsContextType => {
  const context = useContext(AppointmentsContext);
  if (!context)
    throw new Error(
      "useAppointmentsContext must be used within a AppointmentsProvider"
    );
  return context;
};
