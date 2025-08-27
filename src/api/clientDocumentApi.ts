import { ClientDocumentService } from "@agensy/services";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAddDocumentMutation = () => {
  return useMutation({
    mutationFn: async (data: { clientId: string; data: FormData }) =>
      await ClientDocumentService.addDocument(data.clientId, data.data),
  });
};

export const useAnalyzeDocumentMutation = () => {
  return useMutation({
    mutationFn: async (data: { clientId: string; data: FormData }) =>
      await ClientDocumentService.analyzeDocument(data.clientId, data.data),
  });
};

export const useDeleteDocumentMutation = () => {
  return useMutation({
    mutationFn: async (data: { clientId: string; documentId: string }) =>
      await ClientDocumentService.deleteDocument(
        data.clientId,
        data.documentId
      ),
  });
};

export const useGetSingleDocumentQuery = (
  clientId: string,
  documentId: string
) => {
  return useQuery({
    queryKey: ["clientDocument", clientId, documentId],
    queryFn: async () =>
      await ClientDocumentService.getSingleDocument(clientId, documentId),
    enabled: false,
  });
};
