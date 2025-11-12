import { sendRequest } from "@agensy/utils";

export const addClient = async (data: unknown) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: "/clients",
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Service [addClient] error: ${error}`);
    throw error;
  }
};

export const getClients = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: "/clients",
    });

    return response.data.data;
  } catch (error) {
    console.log(`Client Service [getClients] error: ${error}`);
    throw error;
  }
};

export const getClientsWithFilters = async (params?: {
  status?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    const queryParams: Record<string, string | number> = {};

    // Map filter values: "all" → undefined, "active" → "active", "inactive" → "inactive"
    if (params?.status && params.status !== "all") {
      queryParams.status = params.status;
    }

    // Map sortBy values: "dob" → "date_of_birth", "living" → "living_situation", others stay the same
    if (params?.sortBy) {
      const sortByMap: Record<string, string> = {
        dob: "date_of_birth",
        living: "living_situation",
      };
      queryParams.sortBy = sortByMap[params.sortBy] || params.sortBy;
    }

    if (params?.sortOrder) {
      queryParams.sortOrder = params.sortOrder;
    }

    if (params?.page) {
      queryParams.page = params.page;
    }

    if (params?.limit) {
      queryParams.limit = params.limit;
    }

    if (params?.search) {
      queryParams.search = params.search;
    }

    const response = await sendRequest({
      method: "GET",
      url: "/clients",
      params: queryParams,
    });

    return response.data.data;
  } catch (error) {
    console.log(`Client Service [getClientsWithFilters] error: ${error}`);
    throw error;
  }
};

export const getSingleClient = async (id: string) => {
  try {
    const client = await sendRequest({
      method: "GET",
      url: `/clients/${id}`,
    });
    return {
      ...client.data.data,
    };
  } catch (error) {
    console.log(`Client Service [getSingleClient] error: ${error}`);
    throw error;
  }
};

export const deleteSingleClient = async (id: string) => {
  try {
    const client = await sendRequest({
      method: "DELETE",
      url: `/clients/${id}`,
    });
    return {
      ...client.data.data,
    };
  } catch (error) {
    console.log(`Client Service [getSingleClient] error: ${error}`);
    throw error;
  }
};

export const updateClient = async (data: { id: string; data: unknown }) => {
  try {
    const response = await sendRequest({
      method: "PUT",
      url: `/clients/${data.id}`,
      data: data.data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Service [updateClient] error: ${error}`);
    throw error;
  }
};

export const updateClientStatus = async (id: string, status: boolean) => {
  try {
    const response = await sendRequest({
      method: "PUT",
      url: `/clients/${id}/status`,
      data: { status },
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Service [updateClientStatus] error: ${error}`);
    throw error;
  }
};

export const updateClientHealthcare = async (
  clientId: string,
  data: unknown
) => {
  try {
    const response = await sendRequest({
      method: "PUT",
      url: `/clients/${clientId}/hospital-pharmacy`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Service [updateClientHealthcare] error: ${error}`);
    throw error;
  }
};
