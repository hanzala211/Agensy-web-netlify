import { sendRequest } from "@agensy/utils";

export const getClientNotes = async (clientId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/client/${clientId}/notes`,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Note Service [getClientNotes] error: ${error}`);
    throw error;
  }
};

export const addNote = async (data: { text: string; client_id: string }) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${data.client_id}/notes`,
      data: { text: data.text },
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Service [addNote] error: ${error}`);
    throw error;
  }
};

export const editNote = async (data: {
  noteId: string;
  clientId: string;
  text: string;
}) => {
  try {
    const response = await sendRequest({
      method: "PUT",
      url: `/client/${data.clientId}/notes/${data.noteId}`,
      data: { text: data.text },
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Service [editNote] error: ${error}`);
    throw error;
  }
};

export const deleteNote = async (noteId: string, clientId: string) => {
  try {
    const response = await sendRequest({
      method: "DELETE",
      url: `/client/${clientId}/notes/${noteId}`,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Service [deleteNote] error: ${error}`);
    throw error;
  }
};
