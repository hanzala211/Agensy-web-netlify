import { sendRequest } from "@agensy/utils";

export const getDashboardData = async (clientId?: string) => {
  try {
    const url = clientId ? `/dashboard?clientId=${clientId}` : `/dashboard`;
    const response = await sendRequest({
      method: "GET",
      url,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Dashboard Service [getDashboardData] error: ${error}`);
    throw error;
  }
};
