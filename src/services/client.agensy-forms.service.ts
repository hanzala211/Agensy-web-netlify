import { sendRequest } from "@agensy/utils";

export const getFaceSheetShortForm = async (clientId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/client/${clientId}/agensy-forms/face-sheet-short`,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [getFaceSheetShortForm] error: ${error}`
    );
    throw error;
  }
};

export const postFaceSheetShortForm = async (
  clientId: string,
  data: unknown
) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/agensy-forms/face-sheet-short`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [postFaceSheetShortForm] error: ${error}`
    );
    throw error;
  }
};

export const getFaceSheetLongForm = async (clientId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/client/${clientId}/agensy-forms/face-sheet-long`,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [getFaceSheetLongForm] error: ${error}`
    );
    throw error;
  }
};

export const postFaceSheetLongForm = async (
  clientId: string,
  data: unknown
) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/agensy-forms/face-sheet-long`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [postFaceSheetLongForm] error: ${error}`
    );
    throw error;
  }
};
