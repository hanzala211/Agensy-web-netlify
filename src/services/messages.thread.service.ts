import { sendRequest } from "@agensy/utils";

export const createThread = async (data: unknown) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: "/threads",
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Messages Thread Service [createThread] error: ${error}`);
    throw error;
  }
};

export const getAllThreads = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: "/threads",
    });
    return response.data.data;
  } catch (error) {
    console.log(`Messages Thread Service [getAllThreads] error: ${error}`);
    throw error;
  }
};

export const getSingleThread = async (threadId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/threads/${threadId}`,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Messages Thread Service [getSingleThread] error: ${error}`);
    throw error;
  }
};
