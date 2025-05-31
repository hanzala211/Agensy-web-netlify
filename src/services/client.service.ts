import type {
  ClientAddRequestData,
  ClientHealthcareRequestData,
} from "@agensy/types";
import { sendRequest } from "@agensy/utils";

export const addClient = async (data: ClientAddRequestData) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: "/clients",
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Service [addClient] error: ${error}`);
    throw error;
  }
};

export const getClients = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: "/clients",
    });

    return response.data.data;
  } catch (error) {
    console.log(`Client Service [getClients] error: ${error}`);
    throw error;
  }
};

export const getSingleClient = async (id: string) => {
  try {
    const client = await sendRequest({
      method: "GET",
      url: `/clients/${id}`,
    });
    return {
      ...client.data.data,
    };
  } catch (error) {
    console.log(`Client Service [getSingleClient] error: ${error}`);
    throw error;
  }
};

export const updateClient = async (data: {
  id: string;
  data: ClientAddRequestData;
}) => {
  try {
    const response = await sendRequest({
      method: "PUT",
      url: `/clients/${data.id}`,
      data: data.data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Service [updateClient] error: ${error}`);
    throw error;
  }
};

export const updateClientStatus = async (id: string, status: boolean) => {
  try {
    const response = await sendRequest({
      method: "PUT",
      url: `/clients/${id}/status`,
      data: { status },
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Service [updateClientStatus] error: ${error}`);
    throw error;
  }
};

export const updateClientHealthcare = async (
  clientId: string,
  data: ClientHealthcareRequestData
) => {
  try {
    const response = await sendRequest({
      method: "PUT",
      url: `/clients/${clientId}/hospital-pharmacy`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Service [updateClientHealthcare] error: ${error}`);
    throw error;
  }
};
