import { sendRequest } from "@agensy/utils";

export const postScanDocument = async (data: unknown) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: "/scan-documents",
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`OCR Service [postScanDocument] error: ${error}`);
    throw error;
  }
};
