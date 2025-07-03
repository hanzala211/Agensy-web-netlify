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
