import {
  useAddClientAppointmentMutation,
  useGetClientAppointmentQuery,
} from "@agensy/api";
import {
  AddAppointmentModal,
  AppointmentsSkeleton,
  PageHeader,
  TabLink,
} from "@agensy/components";
import { APP_ACTIONS, PERMISSIONS, ROUTES } from "@agensy/constants";
import { useAppointmentsContext, useAuthContext } from "@agensy/context";
import type { AppointmentFormData } from "@agensy/types";
import { DateUtils, toast } from "@agensy/utils";
import type React from "react";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export const AppointmentsManager: React.FC = () => {
  const { setAppointments } = useAppointmentsContext();
  const { userData } = useAuthContext();
  const {
    addAppointment,
    isAddAppointmentModalOpen,
    setIsAddAppointmentModalOpen,
  } = useAppointmentsContext();
  const addClientAppointmentMutation = useAddClientAppointmentMutation();
  const {
    data: appointments,
    isLoading: isLoadingAppointments,
    refetch: loadAppointments,
  } = useGetClientAppointmentQuery();
  const userPermissions =
    PERMISSIONS[userData?.role as keyof typeof PERMISSIONS] || [];

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    if (appointments) {
      setAppointments(appointments);
    }
  }, [appointments]);

  useEffect(() => {
    if (addClientAppointmentMutation.status === "success") {
      addAppointment(addClientAppointmentMutation.data);
      toast.success("Appointment added successfully");
      setIsAddAppointmentModalOpen(false);
    } else if (addClientAppointmentMutation.status === "error") {
      toast.error("Failed to add appointment");
    }
  }, [addClientAppointmentMutation.status]);

  const handleAddAppointment = (data: AppointmentFormData) => {
    const postData = {
      title: data.title,
      appointment_type: data.appointment_type,
      start_time: DateUtils.changetoISO(data.start_time),
      end_time: DateUtils.changetoISO(data.end_time),
      notes: data.notes,
      location: data.location,
      healthcare_provider_id: data.healthcare_provider_id,
      post_appointment_notes: "",
    };
    addClientAppointmentMutation.mutate({
      items: postData,
      clientId: data.clientId as string,
    });
  };

  return (
    <div className="overflow-y-auto h-[100dvh] max-h-[calc(100dvh-50px)] md:max-h-[calc(100dvh)] w-full px-4 py-6">
      <PageHeader
        title={`${"Appointments"}`}
        showBackButton={false}
        buttonText="Add Appointment"
        buttonAriaLabel="Add Appointment"
        showButton={userPermissions.includes(
          APP_ACTIONS.ClientAppointmentInfoEdit
        )}
        onButtonClick={() => setIsAddAppointmentModalOpen(true)}
      />
      <AddAppointmentModal
        isOpen={isAddAppointmentModalOpen}
        onClose={() => setIsAddAppointmentModalOpen(false)}
        onSubmit={handleAddAppointment}
        isLoading={addClientAppointmentMutation.isPending}
      />
      <div className="border-[1px] border-mediumGray px-2 sm:px-5 rounded-xl mt-4">
        <div className="flex flex-wrap md:flex-nowrap border-b border-mediumGray w-full">
          <TabLink to={`${ROUTES.appointments}`} end>
            Calendar
          </TabLink>
          <TabLink to={`${ROUTES.appointments}/${ROUTES.appointmentsList}`}>
            List
          </TabLink>
        </div>
      </div>
      <main className="mt-8">
        {isLoadingAppointments ? <AppointmentsSkeleton /> : <Outlet />}
      </main>
    </div>
  );
};

export default AppointmentsManager;
