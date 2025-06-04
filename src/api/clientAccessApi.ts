import { useMutation } from "@tanstack/react-query";
import { ClientAccessService } from "@agensy/services";

export const useAddClientAccessMutation = () => {
  return useMutation({
    mutationFn: async (data: { items: unknown; clientId: string }) =>
      await ClientAccessService.addClientAccess(data.items, data.clientId),
  });
};

export const useDeleteClientAccessMutation = () => {
  return useMutation({
    mutationFn: async (data: { clientId: string; userId: string }) =>
      await ClientAccessService.deleteClientAccess(data.clientId, data.userId),
  });
};

export const useEditClientAccessMutation = () => {
  return useMutation({
    mutationFn: async (data: {
      clientId: string;
      userId: string;
      data: unknown;
    }) =>
      await ClientAccessService.editClientAccessUser(
        data.clientId,
        data.userId,
        data.data
      ),
  });
};
