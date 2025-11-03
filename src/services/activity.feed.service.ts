import { sendRequest } from "@agensy/utils";

export const getActivities = async (params?: {
  page?: number;
  client_id?: string;
  limit?: number;
  category?: "medical" | "messages" | "appointments" | "documents";
  entity_type?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }

    if (params?.client_id) {
      queryParams.append("client_id", params.client_id);
    }

    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    if (params?.category) {
      queryParams.append("category", params.category);
    }

    if (params?.entity_type) {
      queryParams.append("entity_type", params.entity_type);
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `/activity-feed?${queryString}`
      : "/activity-feed";

    const response = await sendRequest({
      method: "GET",
      url,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Activity Feed Service [getActivities] error: ${error}`);
    throw error;
  }
};
