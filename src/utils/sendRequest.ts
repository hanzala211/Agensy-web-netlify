import { getJwtToken } from "./authCognito";
import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const removeEmptyValues = (value: unknown): unknown => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "string" && value.trim() === "") return undefined;

  if (Array.isArray(value)) {
    const cleanedArray = value
      .map((item) => removeEmptyValues(item))
      .filter((item) => item !== undefined);
    return cleanedArray.length > 0 ? cleanedArray : undefined;
  }

  if (typeof value === "object") {
    const input = value as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    Object.keys(input).forEach((key) => {
      const cleaned = removeEmptyValues(input[key]);
      if (cleaned !== undefined) {
        result[key] = cleaned;
      }
    });
    return Object.keys(result).length > 0 ? result : undefined;
  }

  return value;
};

export const sendRequest = async (
  configs: AxiosRequestConfig
): Promise<AxiosResponse> => {
  const { accessToken: token } = await getJwtToken();
  console.log("token: ", token);
  const timezoneValue = dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  const headers = { ...(configs.headers || {}) } as Record<string, string>;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  headers["x-timezone"] = timezoneValue;

  const requestConfig: AxiosRequestConfig = {
    baseURL: import.meta.env.VITE_API_URL as string,
    ...configs,
    headers,
  };

  if (requestConfig.params) {
    const cleaned = removeEmptyValues(requestConfig.params);
    requestConfig.params = cleaned as AxiosRequestConfig["params"];
  }

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
