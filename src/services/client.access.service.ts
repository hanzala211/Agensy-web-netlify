import { sendRequest } from "@agensy/utils";

export const addClientAccess = async (data: unknown, clientId: string) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/users`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Access Service [addClientAccess] error: ${error}`);
    throw error;
  }
};

export const deleteClientAccess = async (clientId: string, userId: string) => {
  try {
    return await sendRequest({
      method: "DELETE",
      url: `/client/${clientId}/users/${userId}`,
    });
  } catch (error) {
    console.log(`Client Access Service [deleteClientAccess] error: ${error}`);
    throw error;
  }
};

export const editClientAccessUser = async (
  clientId: string,
  userId: string,
  data: unknown
) => {
  try {
    const response = await sendRequest({
      method: "PUT",
      url: `/client/${clientId}/users/${userId}`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Access Service [editClientAccessUser] error: ${error}`);
    throw error;
  }
};

export const getAllClientSubUsers = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: "/users",
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Access Service [getAllClientSubUsers] error: ${error}`);
    throw error;
  }
};
