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
import { ROUTES } from "@agensy/constants";
import { useAppointmentsContext } from "@agensy/context";
import type { AppointmentFormData } from "@agensy/types";
import { toast } from "@agensy/utils";
import type React from "react";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export const AppointmentsManager: React.FC = () => {
  const { setAppointments } = useAppointmentsContext();
  const {
    data: appointments,
    isLoading: isLoadingAppointments,
    refetch: loadAppointments,
  } = useGetClientAppointmentQuery();

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    if (appointments) {
      setAppointments(appointments);
    }
  }, [appointments]);
  const {
    addAppointment,
    isAddAppointmentModalOpen,
    setIsAddAppointmentModalOpen,
  } = useAppointmentsContext();

  const addClientAppointmentMutation = useAddClientAppointmentMutation();

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
      start_time: new Date(data.start_time).toISOString(),
      end_time: new Date(data.end_time).toISOString(),
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
        showButton={true}
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
