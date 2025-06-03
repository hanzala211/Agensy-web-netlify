import { sendRequest } from "@agensy/utils";

export const getSessionDetails = async (sessionId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/subscription/session/${sessionId}`,
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
      url: "/subscription/checkout-session",
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Stripe Session Service [createCheckoutSession] error: ${error}`
    );
    throw error;
  }
};

export const cancelSubscription = async () => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: "/subscription/cancel",
    });
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.log(`Stripe Session Service [cancelSubscription] error: ${error}`);
    throw error;
  }
};

export const getBillingHistory = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: "/subscription/history",
    });
    return response.data.data;
  } catch (error) {
    console.log(`Stripe Session Service [getBillingHistory] error: ${error}`);
    throw error;
  }
};

export const getInvoiceLink = async (invoiceId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/subscription/${invoiceId}`,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Stripe Session Service [getInvoiceLink] error: ${error}`);
    throw error;
  }
};
