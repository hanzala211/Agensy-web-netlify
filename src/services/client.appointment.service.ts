import { sendRequest } from "@agensy/utils";

export const addClientAppointment = async (data: unknown, clientId: string) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/appointments`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Appointment Service [addClientAppointment] error: ${error}`
    );
    throw error;
  }
};

export const getClientAppointments = async () => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/appointments`,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Appointment Service [getClientAppointments] error: ${error}`
    );
    throw error;
  }
};

export const deleteClientAppointment = async (
  clientId: string,
  appointmentId: string
) => {
  try {
    const response = await sendRequest({
      method: "DELETE",
      url: `/client/${clientId}/appointments/${appointmentId}`,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Appointment Service [deleteClientAppointment] error: ${error}`
    );
    throw error;
  }
};

export const editClientAppointment = async (
  data: unknown,
  clientId: string,
  appointmentId: string
) => {
  try {
    const response = await sendRequest({
      method: "PUT",
      url: `/client/${clientId}/appointments/${appointmentId}`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Appointment Service [editClientAppointment] error: ${error}`
    );
    throw error;
  }
};

export const cancelAppointment = async (
  clientId: string,
  appointmentId: string,
  data: unknown
) => {
  try {
    const response = await sendRequest({
      method: "PUT",
      url: `/client/${clientId}/appointments/${appointmentId}/status`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Appointment Service [cancelAppointment] error: ${error}`
    );
    throw error;
  }
};
