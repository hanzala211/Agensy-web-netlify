import { ClientMedicalHistoryService } from "@agensy/services";
import { useMutation } from "@tanstack/react-query";

export const useAddClientMedicalHistoryMutation = () => {
  return useMutation({
    mutationFn: async (data: {
      clientId: string;
      postData: unknown;
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
      postData: unknown;
    }) =>
      await ClientMedicalHistoryService.updateMedicalHistory(
        data.clientId,
        data.postData
      ),
  });
};
