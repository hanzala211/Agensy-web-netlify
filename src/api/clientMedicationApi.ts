import { useMutation } from "@tanstack/react-query";
import { ClientMedicationService } from "@agensy/services";

export const useAddClientMedicationMutation = () => {
  return useMutation({
    mutationFn: async (data: {
      client_id: string;
      postData: unknown;
    }) => await ClientMedicationService.addClientMedication(data),
  });
};

export const useEditClientMedicationMutation = () => {
  return useMutation({
    mutationFn: async (data: {
      medication_id: string;
      postData: unknown;
      clientId: string;
    }) => await ClientMedicationService.editClientMedication(data),
  });
};

export const useDeleteClientMedicationMutation = () => {
  return useMutation({
    mutationFn: async (data: { medicationId: string; clientId: string }) =>
      await ClientMedicationService.deleteClientMedication(
        data.medicationId,
        data.clientId
      ),
  });
};
