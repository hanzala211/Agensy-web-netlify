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
};

export const useGetChecklistForms = (param: string, clientId: string) => {
  return useQuery({
    queryKey: ["checklist", param, clientId],
    queryFn: () => ClientAgensyFormsService.getChecklistsForms(param, clientId),
    enabled: true,
  });
};

export const usePostChecklistFormsMutation = () => {
  return useMutation({
    mutationFn: ({
      clientId,
      param,
      data,
    }: {
      clientId: string;
      param: string;
      data: unknown;
    }) => ClientAgensyFormsService.postChecklistForms(param, clientId, data),
  });
};

export const useGetEssentialDocumentsForAging = (clientId: string) => {
  return useQuery({
    queryKey: ["essential-documents-for-aging", clientId],
    queryFn: () =>
      ClientAgensyFormsService.getEssentialDocumentsForAging(clientId),
    enabled: false,
  });
};

export const usePostEssentialDocumentsForAgingMutation = () => {
  return useMutation({
    mutationFn: ({ clientId, data }: { clientId: string; data: unknown }) =>
      ClientAgensyFormsService.postEssentialDocumentsForAging(clientId, data),
  });
};

export const useGetCareRecipientQuestionnaire = (clientId: string) => {
  return useQuery({
    queryKey: ["care-recipient-questionnaire", clientId],
    queryFn: () =>
      ClientAgensyFormsService.getCareRecipientQuestionnaire(clientId),
    enabled: false,
  });
};

export const usePostCareRecipientQuestionaireMutation = () => {
  return useMutation({
    mutationFn: ({ clientId, data }: { clientId: string; data: unknown }) =>
      ClientAgensyFormsService.postCareRecipientQuestionaire(clientId, data),
  });
};

export const useGetCaregiverInformation = (clientId: string) => {
  return useQuery({
    queryKey: ["care-giver-info", clientId],
    queryFn: () =>
      ClientAgensyFormsService.getClientCareGiverInformation(clientId),
    enabled: false,
  });
};

export const usePostCaregiverInformationMutation = () => {
  return useMutation({
    mutationFn: ({ clientId, data }: { clientId: string; data: unknown }) =>
      ClientAgensyFormsService.postClientCaregiverInformation(clientId, data),
  });
};

export const useGetMedicalAppointmentTemplate = (clientId: string) => {
  return useQuery({
    queryKey: ["medical-appointment-template", clientId],
    queryFn: () => ClientAgensyFormsService.getMedicalAppointmentTemplate(clientId),
    enabled: false,
  });
};

export const usePostMedicalAppointmentTemplateMutation = () => {
  return useMutation({
    mutationFn: ({ clientId, data }: { clientId: string; data: unknown }) =>
      ClientAgensyFormsService.postMedicalAppointmentTemplate(clientId, data),
  });
};