import { ClientContactService } from "@agensy/services";
import type { ContactAddRequestData } from "@agensy/types";
import { useMutation } from "@tanstack/react-query";

export const useAddContactMutation = () => {
  return useMutation({
    mutationFn: async (data: ContactAddRequestData) =>
      await ClientContactService.addContact(data),
  });
};

export const useUpdateContactMutation = () => {
  return useMutation({
    mutationFn: async (data: {
      clientId: string;
      contactId: string;
      data: ContactAddRequestData;
    }) => await ClientContactService.updateContact(data),
  });
};

export const useDeleteClientContactMutation = () => {
  return useMutation({
    mutationFn: async (data: { contactId: string; clientId: string }) =>
      await ClientContactService.deleteContact(data.clientId, data.contactId),
  });
};
