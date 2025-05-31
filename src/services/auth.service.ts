import { sendRequest } from "@agensy/utils";

export const signUp = async (data: unknown) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: "/users/signup",
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Auth Service [signUp] error: ${error}`);
    throw error;
  }
};

export const login = async () => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: "/users/login",
    });
    return response.data.data;
  } catch (error) {
    console.log(`Auth Service [login] error: ${error}`);
    throw error;
  }
};

export const me = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: "/users/me",
    });
    return response.data.data;
  } catch (error) {
    console.log(`Auth Service [me] error: ${error}`);
    throw error;
  }
};
