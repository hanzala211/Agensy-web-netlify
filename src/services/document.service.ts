import { sendRequest } from "@agensy/utils";

export const getGeneralDocuments = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/general-documents`,
    });

    return response.data.data;
  } catch (error) {
    console.log(`Document Service [getGeneralDocument] error: ${error}`);
    throw error;
  }
};

export const addGeneralDocument = async (data: FormData) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/general-documents`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Document Service [addGeneralDocument] error: ${error}`);
    throw error;
  }
};

export const analyzeGeneralDocument = async (data: FormData) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/general-documents/analyze`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Document Service [analyzeGeneralDocument] error: ${error}`);
    throw error;
  }
};

export const deleteGeneralDocument = async (documentId: string) => {
  try {
    const response = await sendRequest({
      method: "DELETE",
      url: `/general-documents/${documentId}`,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Document Service [deleteGeneralDocument] error: ${error}`);
    throw error;
  }
};

export const getSingleGeneralDocument = async (documentId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/general-documents/${documentId}`,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Document Service [getSingleGeneralDocument] error: ${error}`);
    throw error;
  }
};
