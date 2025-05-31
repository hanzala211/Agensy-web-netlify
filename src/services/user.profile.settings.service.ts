import { sendRequest } from "@agensy/utils";

export const updateUserAvatar = async (data: FormData) => {
  try {
    const response = await sendRequest({
      method: "PUT",
      url: `/user-profile/avatar`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `User Profile Settings Service [updateUserAvatar] error: ${error}`
    );
    throw error;
  }
};

export const updateUserProfile = async (data: unknown) => {
  try {
    const response = await sendRequest({
      method: "PUT",
      url: `/user-profile`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `User Profile Settings Service [updateUserProfile] error: ${error}`
    );
    throw error;
  }
};
