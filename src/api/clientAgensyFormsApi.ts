import { ClientAgensyFormsService } from "@agensy/services";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetFaceSheetShortForm = (clientId: string) => {
  return useQuery({
    queryKey: ["face-sheet-short-form", clientId],
    queryFn: () => ClientAgensyFormsService.getFaceSheetShortForm(clientId),
    enabled: false,
  });
};

export const usePostFaceSheetShortFormMutation = () => {
  return useMutation({
    mutationFn: ({ clientId, data }: { clientId: string; data: unknown }) =>
      ClientAgensyFormsService.postFaceSheetShortForm(clientId, data),
  });
};

export const useGetFaceSheetLongForm = (clientId: string) => {
  return useQuery({
    queryKey: ["face-sheet-long-form", clientId],
    queryFn: () => ClientAgensyFormsService.getFaceSheetLongForm(clientId),
    enabled: false,
  });
};

export const usePostFaceSheetLongFormMutation = () => {
  return useMutation({
    mutationFn: ({ clientId, data }: { clientId: string; data: unknown }) =>
      ClientAgensyFormsService.postFaceSheetLongForm(clientId, data),
  });
};

export const useGetHealthHistoryForm = (clientId: string) => {
  return useQuery({
    queryKey: ["health-history-form", clientId],
    queryFn: () => ClientAgensyFormsService.getHealthHistoryForm(clientId),
    enabled: false,
  });
};


export const usePostHealthHistoryFormMutation = () => {
  return useMutation({
    mutationFn: ({ clientId, data }: { clientId: string; data: unknown }) =>
      ClientAgensyFormsService.postHealthHistoryForm(clientId, data),
  });
}