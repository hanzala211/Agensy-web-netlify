import { ClientNoteService } from "@agensy/services";

import { useMutation } from "@tanstack/react-query";

export const useAddNoteMutation = () => {
  return useMutation({
    mutationFn: async (data: { text: string; client_id: string }) =>
      await ClientNoteService.addNote(data),
  });
};

export const useEditNoteMutation = () => {
  return useMutation({
    mutationFn: async (data: {
      noteId: string;
      text: string;
      clientId: string;
    }) => await ClientNoteService.editNote(data),
  });
};

export const useDeleteNoteMutation = () => {
  return useMutation({
    mutationFn: async (data: { noteId: string; clientId: string }) =>
      await ClientNoteService.deleteNote(data.noteId, data.clientId),
  });
};
