import { getJwtToken } from "./authCognito";
import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

export const sendRequest = async (
  configs: AxiosRequestConfig
): Promise<AxiosResponse> => {
  const { accessToken: token } = await getJwtToken();
  console.log("token: ", token);
  const headers = { ...(configs.headers || {}) } as Record<string, string>;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const requestConfig: AxiosRequestConfig = {
    baseURL: import.meta.env.VITE_API_URL as string,
    ...configs,
    headers,
  };

  try {
    return await axios(requestConfig);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === "ERR_CANCELED") return Promise.reject(error);
      const responseError =
        error.response?.data.data || error.response?.data.message;
      if (responseError) return Promise.reject(responseError);
    }
    return Promise.reject(error);
  }
};
