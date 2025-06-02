import { sendRequest } from "@agensy/utils";

export const getSessionDetails = async (sessionId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/stripe/session/${sessionId}`,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Stripe Session Service [getSessionDetails] error: ${error}`);
    throw error;
  }
};

export const createCheckoutSession = async () => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: "/stripe/checkout-session",
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Stripe Session Service [createCheckoutSession] error: ${error}`
    );
    throw error;
  }
};
