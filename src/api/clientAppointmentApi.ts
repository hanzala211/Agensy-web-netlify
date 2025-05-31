import { useMutation, useQuery } from "@tanstack/react-query";
import { ClientAppointmentService } from "@agensy/services";

export const useAddClientAppointmentMutation = () => {
  return useMutation({
    mutationFn: async (data: { items: unknown; clientId: string }) =>
      await ClientAppointmentService.addClientAppointment(
        data.items,
        data.clientId
      ),
  });
};

export const useGetClientAppointmentQuery = () => {
  return useQuery({
    queryFn: async () => await ClientAppointmentService.getClientAppointments(),
    queryKey: ["client-appointments"],
    enabled: false,
  });
};

export const useDeleteClientAppointmentMutation = () => {
  return useMutation({
    mutationFn: async (data: { clientId: string; appointmentId: string }) =>
      await ClientAppointmentService.deleteClientAppointment(
        data.clientId,
        data.appointmentId
      ),
  });
};

export const useEditClientAppointmentMutation = () => {
  return useMutation({
    mutationFn: async (data: {
      clientId: string;
      appointmentId: string;
      items: unknown;
    }) =>
      await ClientAppointmentService.editClientAppointment(
        data.items,
        data.clientId,
        data.appointmentId
      ),
  });
};

export const useCancelAppointmentMutation = () => {
  return useMutation({
    mutationFn: async (data: {
      clientId: string;
      appointmentId: string;
      data: unknown;
    }) =>
      await ClientAppointmentService.cancelAppointment(
        data.clientId,
        data.appointmentId,
        data.data
      ),
  });
};
