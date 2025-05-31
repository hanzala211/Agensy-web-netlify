import { ClientService } from "@agensy/services";
import type {
  ClientAddRequestData,
  ClientHealthcareRequestData,
} from "@agensy/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAddClientMutation = () => {
  return useMutation({
    mutationFn: async (data: ClientAddRequestData) =>
      await ClientService.addClient(data),
  });
};

export const useGetClientsQuery = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => await ClientService.getClients(),
    enabled: false,
  });
};

export const useGetSingleClientQuery = (id: string) => {
  return useQuery({
    queryKey: ["client", id],
    queryFn: async () => await ClientService.getSingleClient(id),
    enabled: Boolean(id),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
};

export const useUpdateClientMutation = () => {
  return useMutation({
    mutationFn: async (data: { id: string; data: ClientAddRequestData }) =>
      await ClientService.updateClient(data),
  });
};

export const useUpdateClientStatusMutation = () => {
  return useMutation({
    mutationFn: async (data: { id: string; status: boolean }) =>
      await ClientService.updateClientStatus(data.id, data.status),
  });
};

export const useUpdateClientHealthcareMutation = () => {
  return useMutation({
    mutationFn: async (data: {
      clientId: string;
      data: ClientHealthcareRequestData;
    }) => await ClientService.updateClientHealthcare(data.clientId, data.data),
  });
};
