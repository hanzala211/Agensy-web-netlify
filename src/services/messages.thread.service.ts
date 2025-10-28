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

export const getThreadByParticipants = async (
  participants: string[],
  clientId?: string,
  type?: string
) => {
  try {
    const participantsParam = participants.join(",");
    const params = new URLSearchParams({
      participants: participantsParam,
    });

    if (clientId) {
      params.append("client_id", clientId);
    }

    if (type) {
      params.append("type", type);
    }

    const response = await sendRequest({
      method: "GET",
      url: `/threads/existing?${params.toString()}`,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Messages Thread Service [getThreadByParticipants] error: ${error}`
    );
    throw error;
  }
};

export const uploadThreadFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await sendRequest({
      method: "POST",
      url: "/threads/file",
      data: formData,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Messages Thread Service [uploadThreadFile] error: ${error}`);
    throw error;
  }
};
