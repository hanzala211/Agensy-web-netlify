import { sendRequest } from "@agensy/utils";

export const addMedicalHistory = async (
  clientId: string,
  data: unknown
) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/medical`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Medical History Service [addMedicalHistory] error: ${error}`
    );
    throw error;
  }
};

export const updateMedicalHistory = async (
  clientId: string,
  data: unknown
) => {
  try {
    const response = await sendRequest({
      method: "PUT",
      url: `/client/${clientId}/medical`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Medical History Service [updateMedicalHistory] error: ${error}`
    );
    throw error;
  }
};
