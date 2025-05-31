import { sendRequest } from "@agensy/utils";
import type { ContactAddRequestData } from "@agensy/types";

export const addContact = async (data: ContactAddRequestData) => {
  try {
    const clientId = data.client_id;
    delete data.client_id;
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/contacts`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Service [addContact] error: ${error}`);
    throw error;
  }
};

export const updateContact = async (data: {
  clientId: string;
  contactId: string;
  data: ContactAddRequestData;
}) => {
  try {
    const response = await sendRequest({
      method: "PUT",
      url: `/client/${data.clientId}/contacts/${data.contactId}`,
      data: data.data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Service [updateContact] error: ${error}`);
    throw error;
  }
};

export const deleteContact = async (clientId: string, contactId: string) => {
  try {
    const response = await sendRequest({
      method: "DELETE",
      url: `/client/${clientId}/contacts/${contactId}`,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Service [deleteContact] error: ${error}`);
    throw error;
  }
};

export const getClientContacts = async (clientId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/client/${clientId}/contacts`,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Service [getClientContacts] error: ${error}`);
    throw error;
  }
};
