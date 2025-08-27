import { sendRequest } from "@agensy/utils";

export const addDocument = async (clientId: string, data: FormData) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/documents`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Document Service [addDocument] error: ${error}`);
    throw error;
  }
};

export const analyzeDocument = async (clientId: string, data: FormData) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/documents/analyze`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Document Service [analyzeDocument] error: ${error}`);
    throw error;
  }
};

export const deleteDocument = async (clientId: string, documentId: string) => {
  try {
    const response = await sendRequest({
      method: "DELETE",
      url: `/client/${clientId}/documents/${documentId}`,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Document Service [deleteDocument] error: ${error}`);
    throw error;
  }
};

export const getSingleDocument = async (
  clientId: string,
  documentId: string
) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/client/${clientId}/documents/${documentId}`,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Document Service [getSingleDocument] error: ${error}`);
    throw error;
  }
};
