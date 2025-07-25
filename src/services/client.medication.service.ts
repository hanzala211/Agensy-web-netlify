import { sendRequest } from "@agensy/utils";

export const addClientMedication = async (data: {
  client_id: string;
  postData: unknown;
}) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${data.client_id}/medications`,
      data: data.postData,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Service [addClientMedication] error: ${error}`);
    throw error;
  }
};

export const getClientMedications = async (clientId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/client/${clientId}/medications`,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Service [getClientMedications] error: ${error}`);
    throw error;
  }
};

export const editClientMedication = async (data: {
  medication_id: string;
  clientId: string;
  postData: unknown;
}) => {
  try {
    const response = await sendRequest({
      method: "PUT",
      url: `/client/${data.clientId}/medications/${data.medication_id}`,
      data: data.postData,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Service [editClientMedication] error: ${error}`);
    throw error;
  }
};

export const deleteClientMedication = async (
  medicationId: string,
  clientId: string
) => {
  try {
    const response = await sendRequest({
      method: "DELETE",
      url: `/client/${clientId}/medications/${medicationId}`,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Service [deleteClientMedication] error: ${error}`);
    throw error;
  }
};
