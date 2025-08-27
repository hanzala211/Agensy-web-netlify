import { DocumentService } from "@agensy/services";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetGeneralDocumentsQuery = () => {
  return useQuery({
    queryKey: ["general-documents"],
    queryFn: async () => await DocumentService.getGeneralDocuments(),
    enabled: false,
  });
};

export const useAddGeneralDocumentMutation = () => {
  return useMutation({
    mutationFn: async (data: FormData) =>
      await DocumentService.addGeneralDocument(data),
  });
};

export const useAnalyzeGeneralDocumentMutation = () => {
  return useMutation({
    mutationFn: async (data: FormData) =>
      await DocumentService.analyzeGeneralDocument(data),
  });
};

export const useDeleteGeneralDocumentMutation = () => {
  return useMutation({
    mutationFn: async (documentId: string) =>
      await DocumentService.deleteGeneralDocument(documentId),
  });
};

export const useGetSingleGeneralDocumentQuery = (documentId: string) => {
  return useQuery({
    queryKey: ["general-document", documentId],
    queryFn: async () =>
      await DocumentService.getSingleGeneralDocument(documentId),
    enabled: false,
  });
};
