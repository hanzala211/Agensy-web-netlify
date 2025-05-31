import { ClientMedicalHistoryService } from "@agensy/services";
import type { ClientMedicalHistoryRequestData } from "@agensy/types";
import { useMutation } from "@tanstack/react-query";

export const useAddClientMedicalHistoryMutation = () => {
  return useMutation({
    mutationFn: async (data: {
      clientId: string;
      postData: ClientMedicalHistoryRequestData;
    }) =>
      await ClientMedicalHistoryService.addMedicalHistory(
        data.clientId,
        data.postData
      ),
  });
};

export const useUpdateClientMedicalHistoryMutation = () => {
  return useMutation({
    mutationFn: async (data: {
      clientId: string;
      postData: ClientMedicalHistoryRequestData;
    }) =>
      await ClientMedicalHistoryService.updateMedicalHistory(
        data.clientId,
        data.postData
      ),
  });
};
