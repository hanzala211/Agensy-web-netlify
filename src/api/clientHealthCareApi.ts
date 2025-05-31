import type { ClientHealthProviderFormData } from "@agensy/types";
import { useMutation } from "@tanstack/react-query";
import { ClientHealthCareService } from "@agensy/services";

export const useAddHealthCareMutation = () => {
  return useMutation({
    mutationFn: async (data: {
      provider: ClientHealthProviderFormData;
      clientId: string;
    }) =>
      await ClientHealthCareService.addHealthCareProvider(
        data.provider,
        data.clientId
      ),
  });
};

export const useUpdateHealthCareMutation = () => {
  return useMutation({
    mutationFn: async (data: {
      provider: ClientHealthProviderFormData;
      providerId: string;
      clientId: string;
    }) =>
      await ClientHealthCareService.updateHealthCareProvider(
        data.provider,
        data.clientId,
        data.providerId
      ),
  });
};

export const useDeleteHealthCareMutation = () => {
  return useMutation({
    mutationFn: async (data: { providerId: string; clientId: string }) =>
      await ClientHealthCareService.deleteHealthCareProvider(
        data.providerId,
        data.clientId
      ),
  });
};
