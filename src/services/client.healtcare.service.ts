import type { ClientHealthProviderFormData } from "@agensy/types";
import { sendRequest } from "@agensy/utils";

export const addHealthCareProvider = async (
  data: ClientHealthProviderFormData,
  clientId: string
) => {
  try {
    const response = await sendRequest({
      method: "POST",
      data,
      url: `/client/${clientId}/healthcare-providers`,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Healthcare Service [addHealthCareProvider] error: ${error}`
    );
    throw error;
  }
};

export const updateHealthCareProvider = async (
  data: ClientHealthProviderFormData,
  clientID: string,
  providerId: string
) => {
  try {
    const response = await sendRequest({
      method: "PUT",
      url: `/client/${clientID}/healthcare-providers/${providerId}`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Healthcare Service [updateHealthCareProvider] error: ${error}`
    );
    throw error;
  }
};

export const deleteHealthCareProvider = async (
  providerId: string,
  clientId: string
) => {
  try {
    const response = await sendRequest({
      method: "DELETE",
      url: `/client/${clientId}/healthcare-providers/${providerId}`,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Healthcare Service [deleteHealthCareProvider] error: ${error}`
    );
    throw error;
  }
};
