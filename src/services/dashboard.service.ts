import { sendRequest } from "@agensy/utils";

export const getDashboardData = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: "/dashboard",
    });
    return response.data.data;
  } catch (error) {
    console.log(`Dashboard Service [getDashboardData] error: ${error}`);
    throw error;
  }
};
